import PageHeader from "../components/PageHeader.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Icon from "../components/Icon.jsx";
import { img, useContent } from "../lib/content.jsx";

// Contenu modifiable depuis l'administration (Pages › Vie locale).
export default function VieLocale() {
  const v = useContent("vie_locale");
  const THEMES = v.themes ?? [];
  const MARCHES = v.marches ?? [];
  return (
    <>
      <PageHeader eyebrow="Vie locale" title={v.titre} intro={v.intro} image={img(v.image_entete)} />

      <section className="px-6 lg:px-10 py-24">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle eyebrow="Nos priorités" title="Les piliers de la vie communale" center />
          <div data-stagger="up" className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {THEMES.map((a, i) => (
              <article
                key={i}
                className="group bg-white rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.07)] border-b-4 border-transparent hover:border-gold transition-colors"
              >
                <div className="size-14 rounded-full bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                  <Icon name={a.icon} className="size-6" />
                </div>
                <h2 className="mt-6 text-xl font-bold text-bronze">{a.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed">{a.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10 py-24 bg-mist">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <img data-reveal="left" src={img(v.marches_image)} alt="Marché de la commune" loading="lazy" className="w-full aspect-[4/3] object-cover rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15)]" />
          <div>
            <SectionTitle eyebrow="Patrimoine vivant" title={v.marches_titre} />
            <p className="mt-8 leading-relaxed text-lg whitespace-pre-line">{v.marches_texte}</p>
            <div data-stagger="zoom" className="mt-8 grid grid-cols-3 gap-4">
              {MARCHES.map((m, i) => (
                <div key={i} className="bg-white rounded-xl p-5 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] border-t-[3px] border-gold">
                  <p className="font-display text-xs font-bold uppercase tracking-widest text-crimson">{m.jour}</p>
                  <p className="mt-2 font-display font-bold text-ink">{m.lieu}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
