// Crée la base de données, les tables, le contenu initial et le premier compte administrateur.
// Sans risque à relancer : rien d'existant n'est écrasé.
// Usage : npm run db:init
import pg from "pg";
import bcrypt from "bcryptjs";
import { DEFAULT_CONTENT } from "../content/defaults.js";

const DB = process.env.PGDATABASE || "haho3";

const SCHEMA = `
create table if not exists utilisateurs (
  id serial primary key,
  nom text not null,
  email text not null unique,
  mot_de_passe text not null,
  role text not null default 'editeur' check (role in ('admin', 'editeur')),
  actif boolean not null default true,
  derniere_connexion timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists contenus (
  cle text primary key,
  valeur jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by integer references utilisateurs(id) on delete set null
);

create table if not exists actualites (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  resume text not null default '',
  categorie text not null,
  image_url text,
  medias jsonb not null default '[]',
  date_publication date not null default current_date,
  publie boolean not null default false,
  a_la_une boolean not null default false,
  auteur_id integer references utilisateurs(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists actualites_publie_idx on actualites (publie, date_publication desc);

create table if not exists messages (
  id serial primary key,
  nom text not null,
  contact text not null,
  objet text not null,
  message text not null,
  lu boolean not null default false,
  archive boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists medias (
  id serial primary key,
  nom_original text not null,
  fichier text not null unique,
  url text not null,
  type text not null,
  taille integer not null,
  uploaded_by integer references utilisateurs(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists journal (
  id serial primary key,
  utilisateur_id integer references utilisateurs(id) on delete set null,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);
`;

async function main() {
  // 1. Base de données
  const admin = new pg.Client({ database: "postgres" });
  await admin.connect();
  const exists = await admin.query("select 1 from pg_database where datname = $1", [DB]);
  if (exists.rowCount === 0) {
    await admin.query(`create database "${DB.replace(/"/g, "")}"`);
    console.log(`Base « ${DB} » créée.`);
  } else {
    console.log(`Base « ${DB} » déjà présente.`);
  }
  await admin.end();

  // 2. Tables + contenu
  const db = new pg.Client({ database: DB });
  await db.connect();
  await db.query(SCHEMA);
  console.log("Tables prêtes.");

  for (const [cle, valeur] of Object.entries(DEFAULT_CONTENT)) {
    const r = await db.query("insert into contenus (cle, valeur) values ($1, $2) on conflict (cle) do nothing", [
      cle,
      JSON.stringify(valeur),
    ]);
    if (r.rowCount) console.log(`Contenu « ${cle} » ajouté.`);
  }

  // 3. Premier administrateur
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const count = await db.query("select count(*)::int as n from utilisateurs");
  if (count.rows[0].n === 0) {
    if (!email || password.length < 8) {
      console.warn("Aucun compte créé : renseignez ADMIN_EMAIL et ADMIN_PASSWORD (8 caractères min.) dans .env");
    } else {
      await db.query("insert into utilisateurs (nom, email, mot_de_passe, role) values ($1, $2, $3, 'admin')", [
        process.env.ADMIN_NAME || "Administrateur",
        email,
        await bcrypt.hash(password, 12),
      ]);
      console.log(`Compte administrateur créé : ${email} (mot de passe : voir ADMIN_PASSWORD dans .env).`);
    }
  } else {
    console.log("Des comptes existent déjà : aucun compte créé.");
  }

  await db.end();
  console.log("Initialisation terminée.");
}

main().catch((e) => {
  console.error("Échec de l'initialisation :", e.message);
  process.exit(1);
});
