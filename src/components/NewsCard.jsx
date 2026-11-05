import { formatDate } from "../lib/actualites.js";
import logo from "../assets/logo-commune-haho3.png";
import { img } from "../lib/content.jsx";

export default function NewsCard({ item, onOpen }) {
  return (
    <article className="group bg-white rounded-[17px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow flex flex-col">
      <button type="button" onClick={() => onOpen?.(item)} className="relative block aspect-[10/9] overflow-hidden bg-mist text-left">
        {item.image_url ? (
          <img
            src={img(item.image_url)}
            alt={item.titre}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#f2f3f5,#e8e8e9)]">
            <img src={logo} alt="" className="h-24 w-24 object-contain opacity-40" />
          </div>
        )}
        <span className="absolute top-0 left-0 m-3 bg-crimson text-white font-display text-[13px] px-3 py-1 rounded-md">
          {item.categorie}
        </span>
      </button>
      <div className="px-8 pt-4 pb-8 flex flex-col flex-1">
        <p className="font-display text-sm text-[rgba(61,68,89,0.5)] mb-2">{formatDate(item.date_publication)}</p>
        <h3 className="text-xl leading-snug font-semibold text-bronze mb-3">
          <button type="button" onClick={() => onOpen?.(item)} className="text-left hover:text-gold transition-colors">
            {item.titre}
          </button>
        </h3>
        <p className="text-[15px] text-body leading-relaxed line-clamp-3">{item.resume}</p>
        <button
          type="button"
          onClick={() => onOpen?.(item)}
          className="mt-auto pt-5 self-start font-display text-sm font-bold text-gold hover:text-crimson transition-colors"
        >
          Lire la suite »
        </button>
      </div>
    </article>
  );
}

export function NewsModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div
      className="animate-page-in fixed inset-0 z-[70] bg-ink/80 backdrop-blur-sm flex items-start justify-center p-4 md:p-10 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <article className="animate-fade-up bg-white rounded-2xl max-w-3xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {item.image_url && <img src={img(item.image_url)} alt={item.titre} className="w-full max-h-[420px] object-cover" />}
        <div className="p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-crimson text-white font-display text-xs px-3 py-1 rounded-md">{item.categorie}</span>
            <span className="font-display text-sm text-[rgba(61,68,89,0.6)]">{formatDate(item.date_publication)}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gold leading-tight mb-6">{item.titre}</h2>
          <p className="whitespace-pre-line leading-relaxed text-body">{item.resume}</p>
          {item.medias?.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-8">
              {item.medias.map((m, i) =>
                m.type === "video" ? (
                  <video key={i} src={img(m.url)} controls className="w-full rounded-lg bg-black" />
                ) : (
                  <a key={i} href={img(m.url)} target="_blank" rel="noreferrer">
                    <img src={img(m.url)} alt="" className="w-full h-40 object-cover rounded-lg" loading="lazy" />
                  </a>
                )
              )}
            </div>
          )}
          <button
            onClick={onClose}
            className="mt-8 font-display text-sm font-bold bg-gold text-white px-6 py-3 rounded-md hover:bg-gold-dark transition-colors"
          >
            Fermer
          </button>
        </div>
      </article>
    </div>
  );
}
