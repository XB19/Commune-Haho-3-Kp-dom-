import PageHeader from "../components/PageHeader.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Icon from "../components/Icon.jsx";
import { img, useContent } from "../lib/content.jsx";

// Contenu modifiable depuis l'administration (Pages › Projets).
export default function Projets() {
  const p = useContent("projets");
  const ORIENTATIONS = p.orientations ?? [];
  const REALISES = p.realises ?? [];
  const INFRAS = p.infrastructures ?? [];
  return (
    <>
      <PageHeader eyebrow="Projets" title={p.titre} intro={p.intro} image={img(p.image_entete)} />

      <section className="px-6 lg:px-10 py-24">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <img data-reveal="left"
            src={img(p.orientations_image)}
            alt="Projet d'infrastructure communale"
            loading="lazy"
            className="w-full aspect-[4/3] object-cover rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15)]"
          />
          <div>
            <SectionTitle eyebrow="PDC validé" title="Nos grandes orientations" />
            <p className="mt-8 leading-relaxed text-lg whitespace-pre-line">{p.orientations_texte}</p>
            <ul data-stagger="right" className="mt-8 space-y-4">
              {ORIENTATIONS.map((o, i) => (
                <li key={i} className="flex items-center gap-4 bg-mist rounded-xl p-4">
                  <span className="size-10 shrink-0 rounded-full bg-gold text-white font-display font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="font-display font-semibold text-ink">{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10 py-24 bg-ink">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle eyebrow="Réalisations" title="Projets réalisés" light center />
          <div data-stagger="up" className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {REALISES.map((r, i) => (
              <div key={i} className="rounded-2xl p-7 bg-white/5 ring-1 ring-white/10 hover:bg-gold transition-colors group">
                <Icon name={r.icon} className="size-8 text-gold-light group-hover:text-white" />
                <p className="mt-5 text-white/85 leading-relaxed">{r.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10 py-24">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle eyebrow="Patrimoine communal" title="Infrastructures" center />
          <div data-stagger="up" className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {INFRAS.map((it, i) => (
              <article key={i} className="bg-white rounded-2xl p-7 shadow-[0_10px_40px_rgba(0,0,0,0.07)] border-t-4 border-gold">
                <h3 className="text-lg font-bold text-bronze">{it.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed">{it.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
