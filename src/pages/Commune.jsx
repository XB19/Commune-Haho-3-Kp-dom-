import PageHeader from "../components/PageHeader.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Icon from "../components/Icon.jsx";
import { img, useContent } from "../lib/content.jsx";

// Contenu modifiable depuis l'administration (Pages › La Commune).
export default function Commune() {
  const c = useContent("commune");
  const maire = useContent("maire");
  const FAITS = c.faits ?? [];
  const ROLES = c.roles ?? [];
  const CONSEIL = c.conseil ?? [];
  const GOUVERNANCE = c.gouvernance ?? [];
  return (
    <>
      <PageHeader eyebrow="La Commune" title={c.titre} intro={c.intro} image={img(c.image_entete)} />

      <section id="presentation" className="scroll-mt-32 px-6 lg:px-10 py-24">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative" data-reveal="left">
            <img
              src={img(c.presentation_image)}
              alt="Paysage de la commune"
              loading="lazy"
              className="w-full aspect-[4/3] object-cover rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.15)]"
            />
            <div className="hidden md:block absolute -bottom-8 -right-8 bg-gold text-white rounded-2xl p-7 shadow-xl">
              <p className="font-display text-4xl font-extrabold">{c.badge_valeur}</p>
              <p className="font-display text-xs uppercase tracking-[0.2em] mt-1 text-white/80">{c.badge_label}</p>
            </div>
          </div>
          <div>
            <SectionTitle eyebrow="Présentation" title={c.presentation_titre} />
            <p className="mt-8 leading-relaxed text-lg whitespace-pre-line">{c.presentation_texte}</p>
            <dl data-stagger="up" className="mt-10 grid sm:grid-cols-3 gap-4">
              {FAITS.map((f, i) => (
                <div key={i} className="bg-mist rounded-xl p-5 border-t-[3px] border-gold">
                  <dt className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">{f.label}</dt>
                  <dd className="mt-2 font-display font-bold text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="elus" className="scroll-mt-32 px-6 lg:px-10 py-24 bg-mist">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle eyebrow="Conseil municipal" title="Les élus" center />
          <div data-stagger="up" className="mt-14 grid md:grid-cols-3 gap-6">
            {ROLES.map((r, i) => (
              <article
                key={i}
                className="group bg-white rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform"
              >
                <div className="size-14 rounded-full bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                  <Icon name={r.icon} className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-bronze">{r.title}</h3>
                <p className="mt-3 leading-relaxed">{r.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="conseil" className="scroll-mt-32 px-6 lg:px-10 py-24">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[360px_1fr] gap-12 items-start">
          <div data-reveal="left" className="lg:sticky lg:top-36 space-y-6">
            <SectionTitle eyebrow="Composition" title={c.conseil_titre} />
            <p className="leading-relaxed whitespace-pre-line">{c.conseil_texte}</p>
            <img src={img(maire.photo)} alt="Le Maire de la commune" loading="lazy" className="w-full aspect-square object-cover rounded-2xl" />
          </div>
          <div data-reveal="right" className="overflow-x-auto rounded-2xl ring-1 ring-line bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            <table className="w-full min-w-[640px] text-sm text-left">
              <thead className="bg-ink text-white font-display">
                <tr>
                  <th className="px-5 py-4 w-16">N°</th>
                  <th className="px-5 py-4">Nom et prénoms</th>
                  <th className="px-5 py-4">Qualité / Fonction</th>
                </tr>
              </thead>
              <tbody data-stagger="up" data-stagger-step="60" className="divide-y divide-line">
                {CONSEIL.map((m, i) => (
                  <tr key={i} className="hover:bg-mist transition-colors">
                    <td className="px-5 py-4">
                      <span className="inline-flex size-8 items-center justify-center rounded-full bg-gold/10 text-gold font-display font-bold">
                        {i + 1}
                      </span>
                    </td>
                    <th scope="row" className="px-5 py-4 font-display font-semibold text-ink">
                      {m.nom}
                    </th>
                    <td className="px-5 py-4">{m.fonction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="gouvernance" className="scroll-mt-32 px-6 lg:px-10 py-24 bg-ink">
        <div className="max-w-[1400px] mx-auto">
          <SectionTitle eyebrow="Gouvernance" title="Une administration de proximité" light center />
          <div data-stagger="up" className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GOUVERNANCE.map((g, i) => (
              <div key={i} className="rounded-2xl p-8 bg-white/5 ring-1 ring-white/10 hover:bg-gold transition-colors group">
                <Icon name={g.icon} className="size-8 text-gold-light group-hover:text-white" />
                <h3 className="mt-6 text-lg font-bold text-white">{g.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70 group-hover:text-white/90">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
