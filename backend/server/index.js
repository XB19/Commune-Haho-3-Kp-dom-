// Backend du portail de la Commune Haho 3 – Kpédomé : API (Express + PostgreSQL) et tableau de bord.
// En développement, les serveurs Vite (frontend et admin) redirigent /api et /uploads vers ce serveur.
// En production, il sert aussi l'administration compilée (backend/dist) sous /admin, et le site public
// compilé (frontend/dist) s'il est présent — sinon le site public est servi par son propre conteneur Nginx.
import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "./db.js";
import { CATEGORIES, CONTENT_KEYS, DEFAULT_CONTENT } from "../content/defaults.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Fichiers envoyés depuis la médiathèque (hors du dossier server/ pour ne pas relancer le serveur en développement).
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");
const ADMIN_DIST = path.join(__dirname, "..", "dist");
const SITE_DIST = process.env.SITE_DIST || path.join(__dirname, "..", "..", "frontend", "dist");
const PORT = Number(process.env.PORT) || 4000;
const SECRET = process.env.JWT_SECRET;
const COOKIE = "haho3_admin";
// Cookie « Secure » (HTTPS uniquement) : activez COOKIE_SECURE=true dès que le site est servi en HTTPS.
const SECURE_COOKIE = process.env.COOKIE_SECURE === "true";

if (!SECRET || SECRET.length < 32) {
  console.error("JWT_SECRET manquant ou trop court dans .env");
  process.exit(1);
}
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Petite aide : transforme les erreurs asynchrones en réponse 500.
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const fail = (res, status, message) => res.status(status).json({ error: message });
const str = (v, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function log(userId, action, detail = null) {
  try {
    await query("insert into journal (utilisateur_id, action, detail) values ($1, $2, $3)", [userId, action, detail]);
  } catch {}
}

/* ---------------- Authentification ---------------- */

async function loadUser(req) {
  const token = req.cookies[COOKIE];
  if (!token) return null;
  try {
    const { sub } = jwt.verify(token, SECRET);
    const r = await query("select id, nom, email, role from utilisateurs where id = $1 and actif", [sub]);
    return r.rows[0] ?? null;
  } catch {
    return null;
  }
}

const auth = h(async (req, res, next) => {
  const user = await loadUser(req);
  if (!user) return fail(res, 401, "Session expirée, veuillez vous reconnecter.");
  req.user = user;
  next();
});

const adminOnly = (req, res, next) =>
  req.user?.role === "admin" ? next() : fail(res, 403, "Réservé aux administrateurs.");

// Limite les tentatives de connexion : 8 essais par 15 minutes et par adresse IP.
const attempts = new Map();
function tooManyAttempts(ip) {
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  attempts.set(ip, list);
  return list.length >= 8;
}

app.post(
  "/api/auth/login",
  h(async (req, res) => {
    const ip = req.ip;
    if (tooManyAttempts(ip)) return fail(res, 429, "Trop de tentatives. Réessayez dans quelques minutes.");
    const email = str(req.body?.email, 200).toLowerCase();
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const r = await query("select * from utilisateurs where email = $1 and actif", [email]);
    const user = r.rows[0];
    if (!user || !(await bcrypt.compare(password, user.mot_de_passe))) {
      attempts.get(ip).push(Date.now());
      return fail(res, 401, "Email ou mot de passe incorrect.");
    }
    attempts.delete(ip);
    await query("update utilisateurs set derniere_connexion = now() where id = $1", [user.id]);
    const token = jwt.sign({ sub: user.id }, SECRET, { expiresIn: "8h" });
    res.cookie(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: SECURE_COOKIE, maxAge: 8 * 3600 * 1000 });
    await log(user.id, "connexion");
    res.json({ id: user.id, nom: user.nom, email: user.email, role: user.role });
  })
);

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE);
  res.json({ ok: true });
});

app.get("/api/auth/me", auth, (req, res) => res.json(req.user));

app.put(
  "/api/auth/password",
  auth,
  h(async (req, res) => {
    const { actuel, nouveau } = req.body ?? {};
    if (typeof nouveau !== "string" || nouveau.length < 8)
      return fail(res, 400, "Le nouveau mot de passe doit contenir au moins 8 caractères.");
    const r = await query("select mot_de_passe from utilisateurs where id = $1", [req.user.id]);
    if (!(await bcrypt.compare(String(actuel ?? ""), r.rows[0].mot_de_passe)))
      return fail(res, 400, "Mot de passe actuel incorrect.");
    await query("update utilisateurs set mot_de_passe = $1 where id = $2", [await bcrypt.hash(nouveau, 12), req.user.id]);
    await log(req.user.id, "mot de passe modifié");
    res.json({ ok: true });
  })
);

/* ---------------- Contenus des pages ---------------- */

app.get(
  "/api/content",
  h(async (req, res) => {
    const r = await query("select cle, valeur from contenus");
    const out = { ...DEFAULT_CONTENT };
    for (const row of r.rows) out[row.cle] = row.valeur;
    res.json(out);
  })
);

app.get(
  "/api/content/meta",
  auth,
  h(async (req, res) => {
    const r = await query(
      "select c.cle, c.updated_at, u.nom as par from contenus c left join utilisateurs u on u.id = c.updated_by"
    );
    res.json(r.rows);
  })
);

app.put(
  "/api/content/:cle",
  auth,
  h(async (req, res) => {
    const { cle } = req.params;
    if (!CONTENT_KEYS.includes(cle)) return fail(res, 404, "Section inconnue.");
    const valeur = req.body;
    if (!valeur || typeof valeur !== "object" || Array.isArray(valeur)) return fail(res, 400, "Contenu invalide.");
    await query(
      `insert into contenus (cle, valeur, updated_at, updated_by) values ($1, $2, now(), $3)
       on conflict (cle) do update set valeur = excluded.valeur, updated_at = now(), updated_by = excluded.updated_by`,
      [cle, JSON.stringify(valeur), req.user.id]
    );
    await log(req.user.id, "contenu modifié", cle);
    res.json({ ok: true });
  })
);

app.post(
  "/api/content/:cle/reset",
  auth,
  adminOnly,
  h(async (req, res) => {
    const { cle } = req.params;
    if (!CONTENT_KEYS.includes(cle)) return fail(res, 404, "Section inconnue.");
    await query("update contenus set valeur = $2, updated_at = now(), updated_by = $3 where cle = $1", [
      cle,
      JSON.stringify(DEFAULT_CONTENT[cle]),
      req.user.id,
    ]);
    await log(req.user.id, "contenu réinitialisé", cle);
    res.json(DEFAULT_CONTENT[cle]);
  })
);

/* ---------------- Actualités ---------------- */

const ACTU_ORDER = "order by a_la_une desc, date_publication desc, created_at desc";

app.get(
  "/api/actualites",
  h(async (req, res) => {
    const r = await query(`select * from actualites where publie ${ACTU_ORDER}`);
    res.json(r.rows);
  })
);

app.get(
  "/api/admin/actualites",
  auth,
  h(async (req, res) => {
    const r = await query(
      `select a.*, u.nom as auteur from actualites a left join utilisateurs u on u.id = a.auteur_id ${ACTU_ORDER}`
    );
    res.json(r.rows);
  })
);

function cleanActu(body) {
  const medias = Array.isArray(body.medias)
    ? body.medias
        .filter((m) => m && typeof m.url === "string")
        .slice(0, 30)
        .map((m) => ({ url: str(m.url, 500), type: m.type === "video" ? "video" : "image" }))
    : [];
  const date = /^\d{4}-\d{2}-\d{2}$/.test(body.date_publication) ? body.date_publication : null;
  return {
    titre: str(body.titre, 300),
    resume: str(body.resume, 20000),
    categorie: CATEGORIES.includes(body.categorie) ? body.categorie : CATEGORIES[0],
    image_url: str(body.image_url, 500) || null,
    medias,
    date_publication: date,
    publie: Boolean(body.publie),
    a_la_une: Boolean(body.a_la_une),
  };
}

app.post(
  "/api/admin/actualites",
  auth,
  h(async (req, res) => {
    const a = cleanActu(req.body ?? {});
    if (!a.titre) return fail(res, 400, "Le titre est obligatoire.");
    if (a.a_la_une) await query("update actualites set a_la_une = false");
    const r = await query(
      `insert into actualites (titre, resume, categorie, image_url, medias, date_publication, publie, a_la_une, auteur_id)
       values ($1, $2, $3, $4, $5, coalesce($6::date, current_date), $7, $8, $9) returning *`,
      [a.titre, a.resume, a.categorie, a.image_url, JSON.stringify(a.medias), a.date_publication, a.publie, a.a_la_une, req.user.id]
    );
    await log(req.user.id, "actualité créée", a.titre);
    res.status(201).json(r.rows[0]);
  })
);

app.put(
  "/api/admin/actualites/:id",
  auth,
  h(async (req, res) => {
    const a = cleanActu(req.body ?? {});
    if (!a.titre) return fail(res, 400, "Le titre est obligatoire.");
    if (a.a_la_une) await query("update actualites set a_la_une = false where id <> $1", [req.params.id]);
    const r = await query(
      `update actualites set titre=$2, resume=$3, categorie=$4, image_url=$5, medias=$6,
       date_publication=coalesce($7::date, date_publication), publie=$8, a_la_une=$9, updated_at=now()
       where id = $1 returning *`,
      [req.params.id, a.titre, a.resume, a.categorie, a.image_url, JSON.stringify(a.medias), a.date_publication, a.publie, a.a_la_une]
    );
    if (!r.rowCount) return fail(res, 404, "Actualité introuvable.");
    await log(req.user.id, "actualité modifiée", a.titre);
    res.json(r.rows[0]);
  })
);

app.delete(
  "/api/admin/actualites/:id",
  auth,
  h(async (req, res) => {
    const r = await query("delete from actualites where id = $1 returning titre", [req.params.id]);
    if (!r.rowCount) return fail(res, 404, "Actualité introuvable.");
    await log(req.user.id, "actualité supprimée", r.rows[0].titre);
    res.json({ ok: true });
  })
);

/* ---------------- Messages du formulaire de contact ---------------- */

const recentMessages = new Map();
app.post(
  "/api/messages",
  h(async (req, res) => {
    // Anti-spam simple : champ piège invisible + 5 messages max par heure et par IP.
    if (req.body?.site_web) return res.status(201).json({ ok: true });
    const now = Date.now();
    const list = (recentMessages.get(req.ip) || []).filter((t) => now - t < 3600 * 1000);
    if (list.length >= 5) return fail(res, 429, "Trop de messages envoyés. Réessayez plus tard.");
    const m = {
      nom: str(req.body?.nom, 200),
      contact: str(req.body?.contact, 200),
      objet: str(req.body?.objet, 300),
      message: str(req.body?.message, 10000),
    };
    if (!m.nom || !m.contact || !m.objet || !m.message) return fail(res, 400, "Tous les champs sont obligatoires.");
    list.push(now);
    recentMessages.set(req.ip, list);
    await query("insert into messages (nom, contact, objet, message) values ($1, $2, $3, $4)", [
      m.nom,
      m.contact,
      m.objet,
      m.message,
    ]);
    res.status(201).json({ ok: true });
  })
);

app.get(
  "/api/admin/messages",
  auth,
  h(async (req, res) => {
    const r = await query("select * from messages order by created_at desc limit 500");
    res.json(r.rows);
  })
);

app.patch(
  "/api/admin/messages/:id",
  auth,
  h(async (req, res) => {
    const { lu, archive } = req.body ?? {};
    const r = await query(
      "update messages set lu = coalesce($2, lu), archive = coalesce($3, archive) where id = $1 returning *",
      [req.params.id, typeof lu === "boolean" ? lu : null, typeof archive === "boolean" ? archive : null]
    );
    if (!r.rowCount) return fail(res, 404, "Message introuvable.");
    res.json(r.rows[0]);
  })
);

app.delete(
  "/api/admin/messages/:id",
  auth,
  h(async (req, res) => {
    await query("delete from messages where id = $1", [req.params.id]);
    await log(req.user.id, "message supprimé");
    res.json({ ok: true });
  })
);

/* ---------------- Médiathèque ---------------- */

const MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "application/pdf": ".pdf",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, crypto.randomBytes(12).toString("hex") + MIME[file.mimetype]),
  }),
  limits: { fileSize: 50 * 1024 * 1024, files: 20 },
  fileFilter: (req, file, cb) =>
    MIME[file.mimetype] ? cb(null, true) : cb(new Error("Format non accepté (images, vidéos MP4/WebM ou PDF)."), false),
});

app.post(
  "/api/admin/medias",
  auth,
  (req, res, next) =>
    upload.array("fichiers")(req, res, (err) => {
      if (!err) return next();
      const msg = err.code === "LIMIT_FILE_SIZE" ? "Fichier trop lourd (50 Mo maximum)." : err.message;
      fail(res, 400, msg);
    }),
  h(async (req, res) => {
    const out = [];
    for (const f of req.files ?? []) {
      const type = f.mimetype.startsWith("video/") ? "video" : f.mimetype === "application/pdf" ? "pdf" : "image";
      const r = await query(
        "insert into medias (nom_original, fichier, url, type, taille, uploaded_by) values ($1,$2,$3,$4,$5,$6) returning *",
        [Buffer.from(f.originalname, "latin1").toString("utf8").slice(0, 200), f.filename, `/uploads/${f.filename}`, type, f.size, req.user.id]
      );
      out.push(r.rows[0]);
    }
    if (out.length) await log(req.user.id, "médias ajoutés", `${out.length} fichier(s)`);
    res.status(201).json(out);
  })
);

app.get(
  "/api/admin/medias",
  auth,
  h(async (req, res) => {
    const r = await query("select * from medias order by created_at desc");
    res.json(r.rows);
  })
);

app.delete(
  "/api/admin/medias/:id",
  auth,
  h(async (req, res) => {
    const r = await query("delete from medias where id = $1 returning fichier, nom_original", [req.params.id]);
    if (!r.rowCount) return fail(res, 404, "Média introuvable.");
    fs.rm(path.join(UPLOAD_DIR, path.basename(r.rows[0].fichier)), { force: true }, () => {});
    await log(req.user.id, "média supprimé", r.rows[0].nom_original);
    res.json({ ok: true });
  })
);

/* ---------------- Utilisateurs ---------------- */

app.get(
  "/api/admin/utilisateurs",
  auth,
  adminOnly,
  h(async (req, res) => {
    const r = await query(
      "select id, nom, email, role, actif, derniere_connexion, created_at from utilisateurs order by created_at"
    );
    res.json(r.rows);
  })
);

app.post(
  "/api/admin/utilisateurs",
  auth,
  adminOnly,
  h(async (req, res) => {
    const nom = str(req.body?.nom, 200);
    const email = str(req.body?.email, 200).toLowerCase();
    const role = req.body?.role === "admin" ? "admin" : "editeur";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!nom || !/^\S+@\S+\.\S+$/.test(email)) return fail(res, 400, "Nom et email valides obligatoires.");
    if (password.length < 8) return fail(res, 400, "Le mot de passe doit contenir au moins 8 caractères.");
    try {
      const r = await query(
        "insert into utilisateurs (nom, email, mot_de_passe, role) values ($1,$2,$3,$4) returning id, nom, email, role, actif, created_at",
        [nom, email, await bcrypt.hash(password, 12), role]
      );
      await log(req.user.id, "compte créé", email);
      res.status(201).json(r.rows[0]);
    } catch (e) {
      if (e.code === "23505") return fail(res, 409, "Un compte existe déjà avec cet email.");
      throw e;
    }
  })
);

async function adminCount(excludeId) {
  const r = await query("select count(*)::int as n from utilisateurs where role = 'admin' and actif and id <> $1", [excludeId]);
  return r.rows[0].n;
}

app.put(
  "/api/admin/utilisateurs/:id",
  auth,
  adminOnly,
  h(async (req, res) => {
    const id = Number(req.params.id);
    const role = req.body?.role === "admin" ? "admin" : "editeur";
    const actif = req.body?.actif !== false;
    if ((role !== "admin" || !actif) && (await adminCount(id)) === 0)
      return fail(res, 400, "Il doit rester au moins un administrateur actif.");
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (password && password.length < 8) return fail(res, 400, "Le mot de passe doit contenir au moins 8 caractères.");
    const r = await query(
      `update utilisateurs set nom = coalesce(nullif($2, ''), nom), role = $3, actif = $4,
       mot_de_passe = coalesce($5, mot_de_passe) where id = $1
       returning id, nom, email, role, actif, derniere_connexion, created_at`,
      [id, str(req.body?.nom, 200), role, actif, password ? await bcrypt.hash(password, 12) : null]
    );
    if (!r.rowCount) return fail(res, 404, "Compte introuvable.");
    await log(req.user.id, "compte modifié", r.rows[0].email);
    res.json(r.rows[0]);
  })
);

app.delete(
  "/api/admin/utilisateurs/:id",
  auth,
  adminOnly,
  h(async (req, res) => {
    const id = Number(req.params.id);
    if (id === req.user.id) return fail(res, 400, "Vous ne pouvez pas supprimer votre propre compte.");
    if ((await adminCount(id)) === 0) return fail(res, 400, "Il doit rester au moins un administrateur actif.");
    const r = await query("delete from utilisateurs where id = $1 returning email", [id]);
    if (!r.rowCount) return fail(res, 404, "Compte introuvable.");
    await log(req.user.id, "compte supprimé", r.rows[0].email);
    res.json({ ok: true });
  })
);

/* ---------------- Tableau de bord ---------------- */

app.get(
  "/api/admin/stats",
  auth,
  h(async (req, res) => {
    const [actus, msgs, medias, users, journal, derniersMsgs, dernieresActus] = await Promise.all([
      query("select count(*) filter (where publie)::int as publiees, count(*) filter (where not publie)::int as brouillons from actualites"),
      query("select count(*) filter (where not lu and not archive)::int as non_lus, count(*)::int as total from messages"),
      query("select count(*)::int as total, coalesce(sum(taille), 0)::bigint as taille from medias"),
      query("select count(*)::int as total from utilisateurs where actif"),
      query(
        "select j.action, j.detail, j.created_at, u.nom from journal j left join utilisateurs u on u.id = j.utilisateur_id order by j.created_at desc limit 8"
      ),
      query("select id, nom, objet, lu, created_at from messages where not archive order by created_at desc limit 5"),
      query("select id, titre, categorie, publie, date_publication from actualites order by updated_at desc limit 5"),
    ]);
    res.json({
      actualites: actus.rows[0],
      messages: msgs.rows[0],
      medias: { total: medias.rows[0].total, taille: Number(medias.rows[0].taille) },
      utilisateurs: users.rows[0].total,
      journal: journal.rows,
      derniers_messages: derniersMsgs.rows,
      dernieres_actualites: dernieresActus.rows,
    });
  })
);

/* ---------------- Fichiers ---------------- */

app.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "30d", immutable: true }));
app.use("/api", (req, res) => fail(res, 404, "Route inconnue."));

// Tableau de bord d'administration compilé (npm run build).
if (fs.existsSync(ADMIN_DIST)) {
  app.use("/admin", express.static(ADMIN_DIST, { index: false, redirect: false, maxAge: "1h" }));
  app.get(["/admin", "/admin/*"], (req, res) => res.sendFile(path.join(ADMIN_DIST, "index.html")));
}

// Site public compilé, s'il est présent (déploiement sans Docker, sur un seul serveur).
if (fs.existsSync(path.join(SITE_DIST, "index.html"))) {
  app.use(express.static(SITE_DIST, { index: false, maxAge: "1h" }));
  app.get("*", (req, res) => res.sendFile(path.join(SITE_DIST, "index.html")));
}

app.use((err, req, res, next) => {
  console.error("[api]", err);
  if (err.code === "22P02") return fail(res, 400, "Identifiant invalide.");
  fail(res, 500, "Erreur interne du serveur.");
});

app.listen(PORT, () => console.log(`API Haho 3 prête sur http://localhost:${PORT}`));
