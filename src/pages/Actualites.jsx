import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import NewsCard, { NewsModal } from "../components/NewsCard.jsx";
import Icon from "../components/Icon.jsx";
import { CATEGORIES, fetchActualites, formatDate } from "../lib/actualites.js";
import { img } from "../lib/content.jsx";

const FILTRES = ["Toutes", ...CATEGORIES];
const PAR_PAGE = 9;

export default function Actualites() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("Toutes");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetchActualites()
      .then((list) => setData(list.filter((a) => a.publie)))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const une = data.find((a) => a.a_la_une) ?? data[0];
  const reste = useMemo(
    () => data.filter((a) => a !== une && (filtre === "Toutes" || a.categorie === filtre)),
    [data, une, filtre]
  );
  const pages = Math.max(1, Math.ceil(reste.length / PAR_PAGE));
  const visibles = reste.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  return (
    <>
      <PageHeader
        eyebrow="Actualités"
        title="Ce qui bouge dans la commune"
        intro="Communiqués officiels, chantiers, événements et vie municipale : retrouvez ici toute l'actualité de la Commune Haho 3 – Kpédomé."
      />

      <section className="px-6 lg:px-10 py-24 bg-mist">
        <div className="max-w-[1400px] mx-auto space-y-14">
          {loading && <p>Chargement des actualités…</p>}

          {une && (
            <article data-reveal="up" className="grid lg:grid-cols-2 bg-ink rounded-[17px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
              <div className="relative min-h-72 bg-char">
                {une.image_url && (
                  <img src={img(une.image_url)} alt={une.titre} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                )}
                <span className="absolute top-0 left-0 m-5 bg-togo-yellow text-ink font-display text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                  À la une
                </span>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-crimson text-white font-display text-xs px-3 py-1 rounded-md">{une.categorie}</span>
                  <span className="font-display text-sm text-white/50">{formatDate(une.date_publication)}</span>
                </div>
                <h2 className="mt-5 text-2xl lg:text-3xl font-bold text-white leading-tight text-balance">{une.titre}</h2>
                <p className="mt-4 text-white/70 leading-relaxed line-clamp-4">{une.resume}</p>
                <button
                  onClick={() => setOpen(une)}
                  className="mt-8 self-start inline-flex items-center gap-2 font-display text-sm font-bold bg-gold text-white px-6 py-3.5 rounded-md hover:bg-gold-dark transition-colors"
                >
                  Lire l'article <Icon name="arrow" className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </article>
          )}

          <div>
            <div data-stagger="down" data-stagger-step="50" className="flex flex-wrap gap-2 mb-10">
              {FILTRES.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFiltre(f);
                    setPage(1);
                  }}
                  className={`font-display text-sm font-semibold px-5 py-2.5 rounded-full transition-colors ${
                    filtre === f ? "bg-gold text-white" : "bg-white text-char hover:text-gold"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {!loading && visibles.length === 0 && (
              <div className="bg-white rounded-[17px] p-12 text-center">
                <Icon name="doc" className="size-10 mx-auto text-gold-light" />
                <p className="mt-4 font-display font-semibold text-ink">Aucune actualité dans cette rubrique pour le moment.</p>
              </div>
            )}

            <div data-stagger="up" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibles.map((a) => (
                <NewsCard key={a.id} item={a} onOpen={setOpen} />
              ))}
            </div>

            {pages > 1 && (
              <nav className="mt-12 flex justify-center gap-2 font-display font-bold" aria-label="Pagination">
                <PageBtn disabled={page === 1} onClick={() => setPage(page - 1)}>
                  « Précédent
                </PageBtn>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <PageBtn key={n} active={n === page} onClick={() => setPage(n)}>
                    {n}
                  </PageBtn>
                ))}
                <PageBtn disabled={page === pages} onClick={() => setPage(page + 1)}>
                  Suivant »
                </PageBtn>
              </nav>
            )}
          </div>

          <div data-reveal="zoom" className="rounded-2xl bg-gold p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="font-display text-xl md:text-2xl font-bold text-white text-center md:text-left">
              Une information à partager avec la commune ?
            </p>
            <Link
              to="/contact"
              className="font-display text-sm font-bold bg-white text-gold px-7 py-4 rounded-md hover:bg-ink hover:text-white transition-colors"
            >
              Contacter la mairie
            </Link>
          </div>
        </div>
      </section>

      <NewsModal item={open} onClose={() => setOpen(null)} />
    </>
  );
}

function PageBtn({ active, disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={() => {
        onClick();
        window.scrollTo({ top: 400, behavior: "smooth" });
      }}
      className={`min-w-11 h-11 px-3 rounded-md transition-colors disabled:opacity-30 ${
        active ? "bg-gold text-white" : "bg-white text-ink hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}
