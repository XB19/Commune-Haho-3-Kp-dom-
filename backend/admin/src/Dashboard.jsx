import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./components/Icon.jsx";
import { api } from "./lib/api.js";
import { formatDate } from "./lib/actualites.js";
import { useAuth } from "./auth.jsx";
import { SECTIONS } from "./schemas.js";
import { Badge, Card, Empty, PageTitle, Spinner, formatSize, timeAgo, useToast } from "./ui.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [s, setS] = useState(null);

  useEffect(() => {
    api("/api/admin/stats")
      .then(setS)
      .catch((e) => toast(e.message, "error"));
  }, [toast]);

  const hour = new Date().getHours();

  return (
    <>
      <PageTitle
        eyebrow={new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        title={`${hour < 18 ? "Bonjour" : "Bonsoir"}, ${user.nom}`}
        description="Voici l'activité du portail de la Commune Haho 3 – Kpédomé."
        actions={
          <Link
            to="/admin/actualites?nouveau=1"
            className="inline-flex items-center gap-2 font-display text-sm font-bold bg-gold text-white px-5 py-2.5 rounded-lg hover:bg-gold-dark transition-colors shadow-[0_6px_16px_rgba(131,105,54,0.3)]"
          >
            <Icon name="plus" className="size-4" strokeWidth={2.4} /> Publier une actualité
          </Link>
        }
      />

      {!s ? (
        <Spinner />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat to="/admin/actualites" icon="news" label="Actualités publiées" value={s.actualites.publiees} sub={`${s.actualites.brouillons} brouillon(s)`} />
            <Stat
              to="/admin/messages"
              icon="inbox"
              label="Messages non lus"
              value={s.messages.non_lus}
              sub={`${s.messages.total} reçu(s) au total`}
              highlight={s.messages.non_lus > 0}
            />
            <Stat to="/admin/medias" icon="photo" label="Fichiers médias" value={s.medias.total} sub={formatSize(s.medias.taille)} />
            <Stat
              to={user.role === "admin" ? "/admin/utilisateurs" : "/admin/compte"}
              icon="users"
              label="Comptes actifs"
              value={s.utilisateurs}
              sub="Équipe de la mairie"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            <Card
              title="Derniers messages des citoyens"
              padded={false}
              actions={
                <Link to="/admin/messages" className="font-display text-xs font-bold text-gold hover:text-crimson">
                  Tout voir
                </Link>
              }
            >
              {s.derniers_messages.length === 0 ? (
                <Empty icon="inbox" title="Aucun message">
                  Les messages du formulaire de contact arriveront ici.
                </Empty>
              ) : (
                <ul className="divide-y divide-line">
                  {s.derniers_messages.map((m) => (
                    <li key={m.id}>
                      <Link to={`/admin/messages?id=${m.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-mist transition-colors">
                        <span
                          className={`size-10 shrink-0 rounded-full font-display font-bold flex items-center justify-center ${
                            m.lu ? "bg-mist text-body" : "bg-gold text-white"
                          }`}
                        >
                          {m.nom.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-sm ${m.lu ? "text-char" : "font-display font-bold text-ink"}`}>{m.objet}</span>
                          <span className="block truncate text-xs">{m.nom}</span>
                        </span>
                        <span className="text-xs shrink-0">{timeAgo(m.created_at)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Activité récente" padded={false}>
              {s.journal.length === 0 ? (
                <Empty icon="clock" title="Aucune activité" />
              ) : (
                <ol className="px-6 py-4 space-y-4">
                  {s.journal.map((j, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gold" />
                      <span className="min-w-0">
                        <span className="text-ink">
                          <b className="font-display">{j.nom ?? "Compte supprimé"}</b> · {j.action}
                        </span>
                        {j.detail && <span className="block truncate text-xs text-body">{j.detail}</span>}
                        <span className="block text-xs text-body/70">{timeAgo(j.created_at)}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            <Card
              title="Dernières actualités"
              padded={false}
              actions={
                <Link to="/admin/actualites" className="font-display text-xs font-bold text-gold hover:text-crimson">
                  Gérer
                </Link>
              }
            >
              {s.dernieres_actualites.length === 0 ? (
                <Empty icon="news" title="Aucune actualité publiée">
                  Publiez votre première actualité pour la voir sur l'accueil.
                </Empty>
              ) : (
                <ul className="divide-y divide-line">
                  {s.dernieres_actualites.map((a) => (
                    <li key={a.id} className="flex items-center gap-4 px-6 py-4">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-sm font-semibold text-ink">{a.titre}</span>
                        <span className="block text-xs">
                          {a.categorie} · {formatDate(a.date_publication)}
                        </span>
                      </span>
                      {a.publie ? <Badge tone="green">Publiée</Badge> : <Badge tone="gray">Brouillon</Badge>}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Modifier une page">
              <div className="grid grid-cols-2 gap-2">
                {SECTIONS.map((sec) => (
                  <Link
                    key={sec.key}
                    to={`/admin/contenu/${sec.key}`}
                    className="group flex items-center gap-2.5 rounded-xl px-3 py-3 ring-1 ring-line hover:ring-gold hover:bg-gold/5 transition"
                  >
                    <span className="size-8 shrink-0 rounded-lg bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                      <Icon name={sec.icon} className="size-4" />
                    </span>
                    <span className="font-display text-[13px] font-semibold text-ink leading-tight">{sec.label}</span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ to, icon, label, value, sub, highlight }) {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl p-5 md:p-6 transition hover:-translate-y-0.5 ${
        highlight ? "bg-ink text-white shadow-[0_20px_40px_rgba(33,34,38,0.25)]" : "bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
      }`}
    >
      <span
        className={`size-11 rounded-xl flex items-center justify-center ${
          highlight ? "bg-gold text-white" : "bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white"
        } transition-colors`}
      >
        <Icon name={icon} className="size-5" />
      </span>
      <p className={`mt-5 font-display text-3xl md:text-4xl font-extrabold ${highlight ? "text-white" : "text-ink"}`}>
        {value.toLocaleString("fr-FR")}
      </p>
      <p className={`mt-1 font-display text-[13px] font-semibold ${highlight ? "text-white/85" : "text-ink"}`}>{label}</p>
      <p className={`text-xs mt-0.5 ${highlight ? "text-gold-light" : "text-body"}`}>{sub}</p>
    </Link>
  );
}
