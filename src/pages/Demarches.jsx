import PageHeader from "../components/PageHeader.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Icon from "../components/Icon.jsx";
import { img, useContent } from "../lib/content.jsx";

// Contenu modifiable depuis l'administration (Pages › Démarches).
export default function Demarches() {
  const d = useContent("demarches");
  const g = useContent("general");
  const SERVICES = d.services ?? [];
  return (
    <>
      <PageHeader eyebrow="Démarches" title={d.titre} intro={d.intro} image={img(d.image_entete)} />

      <section className="px-6 lg:px-10 py-24">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle eyebrow="Services" title="Le catalogue des services municipaux" center />
          <div data-stagger="up" className="mt-14 grid md:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <article
                key={i}
                id={s.id || undefined}
                className="scroll-mt-32 relative bg-white rounded-2xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.07)] overflow-hidden"
              >
                <span className="absolute top-6 right-8 font-display text-7xl font-extrabold text-mist select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative">
                  <div className="size-14 rounded-xl bg-gold text-white flex items-center justify-center">
                    <Icon name={s.icon} className="size-6" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-gold">{s.title}</h2>
                  <p className="mt-3 mb-6 leading-relaxed">{s.desc}</p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {(s.items ?? []).map((it, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[15px] text-char">
                        <Icon name="right" className="size-4 mt-0.5 shrink-0 text-crimson" strokeWidth={3} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10 pb-24">
        <div data-reveal="zoom" className="max-w-[1400px] mx-auto rounded-2xl bg-ink overflow-hidden grid md:grid-cols-[1fr_auto] items-center gap-8 p-10 md:p-14 relative isolate">
          <div className="absolute -left-20 -bottom-20 -z-10 size-80 rounded-full bg-gold/20 blur-3xl" />
          <div>
            <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-light">Accueil du public</span>
            <h2 className="mt-3 text-3xl font-bold text-white">Horaires d'ouverture de la mairie</h2>
            <p className="mt-3 text-white/70">{g.horaires_jours}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 ring-1 ring-white/10 rounded-xl px-6 py-5 text-center">
              <Icon name="clock" className="size-6 mx-auto text-gold-light" />
              <p className="mt-2 font-display text-xs uppercase tracking-widest text-white/60">Matin</p>
              <p className="font-display text-xl font-bold text-white">{g.horaires_matin}</p>
            </div>
            <div className="bg-white/5 ring-1 ring-white/10 rounded-xl px-6 py-5 text-center">
              <Icon name="clock" className="size-6 mx-auto text-gold-light" />
              <p className="mt-2 font-display text-xs uppercase tracking-widest text-white/60">Après-midi</p>
              <p className="font-display text-xl font-bold text-white">{g.horaires_apres_midi}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
