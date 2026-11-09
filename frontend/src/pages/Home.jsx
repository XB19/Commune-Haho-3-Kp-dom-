import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import NewsCard, { NewsModal } from "../components/NewsCard.jsx";
import CountUp from "../components/CountUp.jsx";
import { fetchActualites } from "../lib/actualites.js";
import { img, useContent } from "../lib/content.jsx";

// Tout le contenu de cette page se modifie depuis l'administration (Pages › Accueil, Le Maire).
export default function Home() {
  return (
    <>
      <HeroSlider />
      <Services />
      <News />
      <MotDuMaire />
      <Chiffres />
      <Agenda />
      <Medias />
      <Liens />
    </>
  );
}

function HeroSlider() {
  const accueil = useContent("accueil");
  const general = useContent("general");
  // S'il n'y a plus aucune diapositive, la couverture affiche simplement le nom de la commune.
  const SLIDES = accueil.slides?.length
    ? accueil.slides
    : [{ image: "asset:hero", eyebrow: general.sous_titre, title: general.nom_complet, text: "" }];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [paused, SLIDES.length]);

  const go = (d) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative isolate flex flex-col lg:min-h-[100svh] overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== index}
        >
          <img
            src={img(s.image)}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover ${i === index ? "animate-hero-zoom" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#212226_0%,rgba(33,34,38,0.75)_35%,rgba(0,35,90,0.32)_70%)]" />

      {/* Contenu dans le flux : la couverture s'agrandit avec le texte au lieu de le laisser déborder. */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pt-36 md:pt-44 pb-12 grid lg:grid-cols-[minmax(320px,440px)_1fr] gap-10 xl:gap-20 items-center">
        <MaireHero />

        {/* Les 3 diapositives sont superposées dans la même cellule : la hauteur est celle de la plus longue,
            donc rien ne saute ni ne se chevauche quand le texte change. */}
        <div className="order-1 lg:order-2 grid min-w-0">
          {SLIDES.map((s, i) => {
            const active = i === index;
            return (
              <div
                key={active ? `on-${i}` : `off-${i}`}
                aria-hidden={!active}
                className={`[grid-area:1/1] self-center ${active ? "" : "invisible opacity-0"}`}
              >
                <span className={`${active ? "animate-fade-up" : ""} inline-flex items-center gap-3 font-display text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-white bg-ink/60 backdrop-blur-sm border-l-4 border-gold pl-4 pr-5 py-2.5 rounded-r-md`}>
                  {s.eyebrow}
                </span>
                {active ? (
                  <h1 style={{ animationDelay: "120ms" }} className="animate-fade-up mt-6 text-[40px] sm:text-6xl lg:text-[length:clamp(52px,min(5vw,9svh),84px)] font-extrabold text-white leading-[1.04] tracking-tight text-balance whitespace-pre-line drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
                    {s.title}
                  </h1>
                ) : (
                  <p className="mt-6 text-[40px] sm:text-6xl lg:text-[length:clamp(52px,min(5vw,9svh),84px)] font-display font-extrabold leading-[1.04] tracking-tight text-balance whitespace-pre-line">
                    {s.title}
                  </p>
                )}
                <span style={{ animationDelay: "350ms" }} className={`${active ? "animate-grow-x" : ""} block h-1.5 w-24 bg-gold mt-7`} />
                <p style={{ animationDelay: "300ms" }} className={`${active ? "animate-fade-up" : ""} mt-7 text-lg md:text-xl xl:text-2xl text-white/85 max-w-[48ch] leading-relaxed`}>
                  {s.text}
                </p>
                <div style={{ animationDelay: "450ms" }} className={`${active ? "animate-fade-up" : ""} mt-9 flex flex-wrap gap-4`}>
                  <Link
                    to="/demarches"
                    tabIndex={active ? undefined : -1}
                    className="font-display text-base font-bold bg-gold text-white px-8 py-4 rounded-md hover:bg-gold-dark transition-colors inline-flex items-center gap-2 shadow-[0_10px_30px_rgba(131,105,54,0.45)]"
                  >
                    Faire une démarche <Icon name="arrow" className="size-5" strokeWidth={2.4} />
                  </Link>
                  <Link
                    to="/commune"
                    tabIndex={active ? undefined : -1}
                    className="font-display text-base font-bold text-white px-8 py-4 rounded-md ring-2 ring-white/60 hover:bg-white hover:text-ink transition-colors"
                  >
                    Découvrir la commune
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barre de contrôle dans le flux, sous le contenu : elle ne peut plus recouvrir les boutons.
          Le pb-28 laisse la place au bloc « services » qui remonte sur la couverture. */}
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 pb-28 flex items-center justify-between gap-6">
        <div className="flex gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Diapositive ${i + 1}`}
              className={`h-1 rounded-full transition-all ${i === index ? "w-12 bg-gold" : "w-6 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "center" })}
          className="hidden md:flex flex-col items-center gap-2 text-white/70 hover:text-gold-light transition-colors"
          aria-label="Faire défiler vers le contenu"
        >
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.3em]">Défiler</span>
          <span className="h-10 w-6 rounded-full border-2 border-current flex justify-center pt-1.5">
            <span className="h-2 w-1 rounded-full bg-current animate-bounce-down" />
          </span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => go(-1)}
            aria-label="Précédent"
            className="size-11 rounded-full ring-1 ring-white/30 text-white flex items-center justify-center hover:bg-gold hover:ring-gold transition-colors"
          >
            <Icon name="left" className="size-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Suivant"
            className="size-11 rounded-full ring-1 ring-white/30 text-white flex items-center justify-center hover:bg-gold hover:ring-gold transition-colors"
          >
            <Icon name="right" className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

// Portrait officiel du Maire dans la couverture, comme le portrait présidentiel du site de référence.
function MaireHero() {
  const maire = useContent("maire");
  return (
    <Link
      to="/commune#elus"
      style={{ animationDelay: "200ms" }}
      className="animate-fade-right order-2 lg:order-1 group relative block w-full max-w-[440px] mx-auto lg:mx-0"
    >
      <div className="absolute -inset-10 -z-10 rounded-full bg-gold/25 blur-3xl animate-pulse [animation-duration:4s]" />
      <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[22px] border-2 border-gold animate-float group-hover:translate-x-2 group-hover:translate-y-2 transition-[translate] duration-500" />
      <div className="relative overflow-hidden rounded-[22px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <img
          src={img(maire.photo)}
          alt={`${maire.titre} ${maire.nom}, ${maire.fonction}`}
          width={1024}
          height={1024}
          className="w-full aspect-[4/4.4] object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
        />
        <div className="absolute top-0 left-0 m-4 bg-crimson text-white font-display text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-md">
          Le Maire
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/95 to-ink/0 pt-20 pb-6 px-6">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-gold-light">
            {maire.titre}
          </p>
          <p className="font-display text-2xl md:text-[28px] font-extrabold text-white leading-tight mt-1">
            {maire.nom}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="h-0.5 w-8 bg-gold" />
            <p className="text-sm text-white/80">{maire.fonction}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Services() {
  const SERVICES = useContent("accueil").services ?? [];
  return (
    <section id="services" className="relative z-10 px-6 lg:px-10 -mt-16">
      <div data-stagger="up" className="max-w-[1400px] mx-auto grid sm:grid-cols-2 lg:grid-cols-4 bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] overflow-hidden">
        {SERVICES.map((s, i) => (
          <Link
            key={i}
            to={s.to}
            className="group p-8 border-b sm:border-r border-line last:border-r-0 hover:bg-gold transition-colors"
          >
            <div className="size-14 rounded-full bg-mist text-gold flex items-center justify-center mb-5 group-hover:bg-white/15 group-hover:text-white transition-colors">
              <Icon name={s.icon} className="size-6" />
            </div>
            <h3 className="font-bold text-lg text-ink group-hover:text-white transition-colors">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed group-hover:text-white/85 transition-colors">{s.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function News() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    fetchActualites()
      .then((list) => setItems(list.filter((a) => a.publie).slice(0, 3)))
      .catch(() => setItems([]));
  }, []);

  return (
    <section className="px-6 lg:px-10 py-24 bg-mist mt-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <SectionTitle eyebrow="Actualité" title="Retrouvez l'actualité de la Commune" />
          <Link
            to="/actualites"
            className="font-display text-sm font-bold text-gold border-b-2 border-gold pb-1 hover:text-crimson hover:border-crimson transition-colors"
          >
            Toutes les actualités
          </Link>
        </div>

        {items.length > 0 ? (
          <div data-stagger="up" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((a) => (
              <NewsCard key={a.id} item={a} onOpen={setOpen} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[17px] p-12 text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            <Icon name="doc" className="size-10 mx-auto text-gold-light" />
            <p className="mt-4 font-display font-semibold text-ink">Les prochaines actualités arrivent bientôt.</p>
            <p className="mt-2 text-sm">Communiqués, chantiers et événements de la commune seront publiés ici.</p>
          </div>
        )}
      </div>
      <NewsModal item={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function MotDuMaire() {
  const maire = useContent("maire");
  const paragraphes = String(maire.mot_texte ?? "").split(/\n\s*\n/).filter(Boolean);
  return (
    <section className="relative isolate overflow-hidden bg-ink px-6 lg:px-10 py-24">
      <div className="absolute -right-40 -top-40 -z-10 size-[520px] rounded-full bg-gold/10 blur-3xl" />
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[440px_1fr] gap-14 items-center">
        <div className="relative" data-reveal="left">
          <div className="absolute -inset-3 border-2 border-gold rounded-2xl translate-x-6 translate-y-6" />
          <img
            src={img(maire.photo)}
            alt={`Portrait de ${maire.titre} ${maire.nom}`}
            loading="lazy"
            className="relative w-full aspect-[4/5] object-cover rounded-2xl"
          />
        </div>
        <div>
          <SectionTitle eyebrow="Mot du Maire" title={maire.mot_titre} light />
          <span className="block font-display text-[120px] leading-none text-gold/40 mt-6 -mb-14" aria-hidden="true">
            “
          </span>
          <blockquote data-reveal="up" className="space-y-4 text-white/80 text-lg leading-relaxed">
            {paragraphes.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </blockquote>
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="font-display text-xl font-bold text-white">
              {maire.titre} {maire.nom}
            </p>
            <p className="text-gold-light text-sm mt-1">{maire.fonction}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chiffres() {
  const CHIFFRES = useContent("accueil").chiffres ?? [];
  return (
    <section className="bg-gold px-6 lg:px-10 py-14">
      <dl data-stagger="zoom" className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {CHIFFRES.map((c, i) => (
          <div key={i}>
            <dd className="font-display text-4xl md:text-5xl font-extrabold text-white"><CountUp value={c.value} /></dd>
            <dt className="mt-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              {c.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Agenda() {
  const accueil = useContent("accueil");
  const AGENDA = accueil.agenda ?? [];
  return (
    <section className="px-6 lg:px-10 py-24">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_1.3fr] gap-14 items-start">
        <div>
          <SectionTitle eyebrow="Agenda" title="L'agenda de la commune" />
          <p className="mt-8 leading-relaxed max-w-[46ch]">
            {accueil.agenda_texte}
          </p>
          <Link
            to="/vie-locale"
            className="mt-8 inline-flex items-center gap-2 font-display text-sm font-bold bg-gold text-white px-6 py-3.5 rounded-md hover:bg-gold-dark transition-colors"
          >
            Découvrir la vie locale <Icon name="arrow" className="size-4" strokeWidth={2.4} />
          </Link>
        </div>
        <ul data-stagger="right" className="space-y-4">
          {AGENDA.map((a, i) => (
            <li
              key={i}
              className="group flex items-center gap-6 bg-white rounded-xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border-l-4 border-gold hover:border-crimson transition-colors"
            >
              <div className="shrink-0 w-28 text-center">
                <Icon name="calendar" className="size-6 mx-auto text-gold" />
                <p className="mt-1 font-display text-sm font-bold uppercase tracking-wider text-ink">{a.jour}</p>
              </div>
              <div className="border-l border-line pl-6">
                <h3 className="font-bold text-lg text-bronze">{a.titre}</h3>
                <p className="text-sm mt-1">{a.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Medias() {
  const GALERIE = useContent("accueil").galerie ?? [];
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="px-6 lg:px-10 py-24 bg-mist">
      <div className="max-w-[1400px] mx-auto">
        <SectionTitle eyebrow="Galerie" title="Espace médias" center />
        <div data-stagger="zoom" className="mt-14 grid md:grid-cols-3 gap-5">
          {GALERIE.map((g, i) => (
            <button
              key={i}
              onClick={() => setLightbox(g)}
              className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              <img
                src={img(g.src)}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-6 flex items-center gap-3 text-white text-left">
                <span className="size-10 rounded-full bg-gold flex items-center justify-center shrink-0">
                  <Icon name="photo" className="size-5" />
                </span>
                <span className="font-display font-semibold">{g.alt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="animate-page-in fixed inset-0 z-[70] bg-ink/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <img src={img(lightbox.src)} alt={lightbox.alt} className="animate-fade-up max-h-[85vh] max-w-full rounded-xl" />
          <button className="absolute top-6 right-6 text-white" aria-label="Fermer">
            <Icon name="close" className="size-8" />
          </button>
        </div>
      )}
    </section>
  );
}

function Liens() {
  const LIENS = useContent("accueil").liens ?? [];
  return (
    <section className="px-6 lg:px-10 py-24">
      <div className="max-w-[1400px] mx-auto">
        <SectionTitle eyebrow="Ressources" title="Liens utiles" center />
        <div data-stagger="up" className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LIENS.map((l, i) => (
            <a
              key={i}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group relative bg-white rounded-2xl p-7 ring-1 ring-line hover:ring-gold hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(131,105,54,0.15)] transition-all"
            >
              <Icon name="external" className="size-5 text-gold absolute top-7 right-7" />
              <h3 className="font-bold text-lg text-ink pr-8 group-hover:text-gold transition-colors">{l.titre}</h3>
              <p className="mt-2 text-sm">{l.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
