import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo-commune-haho3.png";
import Icon from "./Icon.jsx";
import BackToTop from "./BackToTop.jsx";
import useScrollReveal from "../lib/useScrollReveal.js";
import { useContent } from "../lib/content.jsx";

const tel = (t) => "tel:" + String(t).replace(/[^\d+]/g, "");

export const NAV = [
  { to: "/", label: "Accueil" },
  {
    to: "/commune",
    label: "La Commune",
    children: [
      { to: "/commune#presentation", label: "Présentation" },
      { to: "/commune#elus", label: "Les élus" },
      { to: "/commune#conseil", label: "Conseil municipal" },
      { to: "/commune#gouvernance", label: "Gouvernance" },
    ],
  },
  {
    to: "/demarches",
    label: "Démarches",
    children: [
      { to: "/demarches#etat-civil", label: "État civil" },
      { to: "/demarches#urbanisme", label: "Urbanisme" },
      { to: "/demarches#sante-social", label: "Santé et social" },
      { to: "/demarches#formulaires", label: "Formulaires" },
    ],
  },
  { to: "/vie-locale", label: "Vie locale" },
  { to: "/projets", label: "Projets" },
  { to: "/actualites", label: "Actualités" },
  { to: "/contact", label: "Contact" },
];

export default function SiteLayout({ children }) {
  const { pathname, hash } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pageRef = useRef(null);
  const g = useContent("general");
  useScrollReveal(pageRef, pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  }, [pathname, hash]);

  // En-tête toujours opaque pour une lisibilité maximale ; l'ombre apparaît au défilement.
  const solid = true;

  return (
    <div className="min-h-screen bg-white selection:bg-gold/25 overflow-x-clip">
      {/* Bande tricolore */}
      <div className="fixed top-0 inset-x-0 z-[60] h-1 flex">
        <span className="flex-1 bg-togo-green" />
        <span className="flex-1 bg-togo-yellow" />
        <span className="flex-1 bg-togo-red" />
      </div>

      <header
        className={`fixed top-1 inset-x-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled || open ? "shadow-[0_8px_30px_rgba(0,0,0,0.12)]" : "shadow-[0_1px_0_rgba(0,0,0,0.06)]"
        }`}
      >
        {/* Barre supérieure */}
        <div
          className={`hidden md:block overflow-hidden bg-ink text-white/80 transition-[max-height,opacity] duration-500 ${
            scrolled ? "max-h-0 opacity-0" : "max-h-11 opacity-100"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-11 flex items-center justify-between text-[13px] font-display font-semibold tracking-wide">
            <span className="uppercase tracking-[0.18em]">{g.devise}</span>
            <div className="flex items-center gap-6">
              <a href={tel(g.telephone)} className="flex items-center gap-2 hover:text-gold-light transition-colors">
                <Icon name="phone" className="size-3.5" /> {g.telephone}
              </a>
              <a href={`mailto:${g.email}`} className="flex items-center gap-2 hover:text-gold-light transition-colors">
                <Icon name="mail" className="size-3.5" /> {g.email}
              </a>
            </div>
          </div>
        </div>

        <div
          className={`max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-6 transition-[height] duration-500 ${
            scrolled ? "h-20" : "h-20 md:h-24"
          }`}
        >
          <Link to="/" className="group flex items-center gap-4 shrink-0">
            <img
              src={logo}
              alt="Armoiries de la Commune Haho 3 – Kpédomé"
              width={68}
              height={68}
              className={`object-contain transition-all duration-500 group-hover:rotate-[-4deg] group-hover:scale-105 ${
                scrolled ? "h-14 w-14" : "h-14 w-14 md:h-[68px] md:w-[68px]"
              }`}
            />
            <div className="flex flex-col leading-tight border-l-2 border-gold pl-4">
              <span className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-ink">
                {g.nom}
              </span>
              <span className="font-display text-xs md:text-[13px] font-bold uppercase tracking-[0.22em] text-gold mt-0.5">
                {g.sous_titre}
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {NAV.map((item) => (
              <DesktopItem key={item.to} item={item} solid={solid} />
            ))}
          </nav>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="xl:hidden p-2 rounded-md text-ink hover:text-gold transition-colors"
          >
            <Icon name={open ? "close" : "menu"} className="size-7" />
          </button>
        </div>

        {open && (
          <nav className="xl:hidden border-t border-line bg-white max-h-[calc(100vh-6rem)] overflow-y-auto animate-fade-up [animation-duration:0.35s]">
            <ul className="px-6 py-4 space-y-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `block py-3 font-display text-lg font-bold border-b border-line ${
                        isActive ? "text-gold" : "text-ink"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                  {item.children && (
                    <ul className="pl-4 py-1">
                      {item.children.map((c) => (
                        <li key={c.to}>
                          <Link to={c.to} className="block py-2 text-sm text-body hover:text-gold">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <div ref={pageRef}>
        <main key={pathname} className="animate-page-in">
          {children}
        </main>

        <Footer />
      </div>
      <BackToTop />
    </div>
  );
}

function DesktopItem({ item, solid }) {
  if (item.to === "/contact") {
    return (
      <NavLink
        to="/contact"
        className="ml-3 inline-flex items-center gap-2 font-display text-[15px] font-bold bg-gold text-white px-6 py-3.5 rounded-md hover:bg-crimson transition-colors shadow-[0_8px_20px_rgba(131,105,54,0.35)]"
      >
        <Icon name="mail" className="size-4" strokeWidth={2.2} />
        Contact
      </NavLink>
    );
  }

  const base = `relative px-3 2xl:px-4 py-2 font-display text-[15px] font-bold transition-colors flex items-center gap-1 ${
    solid ? "text-ink hover:text-gold" : "text-white hover:text-gold-light"
  }`;

  return (
    <div className="relative group">
      <NavLink
        to={item.to}
        end={item.to === "/"}
        className={({ isActive }) =>
          `${base} ${isActive ? (solid ? "!text-gold" : "!text-gold-light") : ""} after:absolute after:left-3 after:right-3 2xl:after:left-4 2xl:after:right-4 after:-bottom-1 after:h-0.5 after:bg-gold after:origin-left after:scale-x-0 after:transition-transform group-hover:after:scale-x-100 ${
            isActive ? "after:scale-x-100" : ""
          }`
        }
      >
        {item.label}
        {item.children && <Icon name="chevron" className="size-3.5" strokeWidth={2.5} />}
      </NavLink>
      {item.children && (
        <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200">
          <ul className="min-w-56 bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-t-[3px] border-gold py-2">
            {item.children.map((c) => (
              <li key={c.to}>
                <Link
                  to={c.to}
                  className="block px-5 py-2.5 text-sm text-char hover:text-gold hover:bg-mist hover:pl-6 transition-all"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Footer() {
  const g = useContent("general");
  return (
    <footer className="bg-ink text-white/65">
      <div data-stagger="up" className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="" width={64} height={64} loading="lazy" className="h-16 w-16 object-contain" />
            <div>
              <p className="font-display text-white text-lg font-bold leading-tight">{g.nom_complet}</p>
              <p className="font-display text-gold-light text-xs uppercase tracking-[0.2em] mt-1">
                Travail – Liberté – Patrie
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-[38ch]">{g.footer_texte}</p>
          <div className="flex gap-1 h-1 w-24">
            <span className="flex-1 bg-togo-green" />
            <span className="flex-1 bg-togo-yellow" />
            <span className="flex-1 bg-togo-red" />
          </div>
        </div>

        <FooterCol
          title="La Commune"
          links={[
            ["/commune#presentation", "Présentation"],
            ["/commune#elus", "Les élus"],
            ["/commune#conseil", "Conseil municipal"],
            ["/projets", "Projets"],
          ]}
        />
        <FooterCol
          title="Services"
          links={[
            ["/demarches#etat-civil", "État civil"],
            ["/demarches#urbanisme", "Urbanisme"],
            ["/demarches#formulaires", "Formulaires"],
            ["/actualites", "Actualités"],
          ]}
        />

        <div className="space-y-5">
          <h4 className="font-display text-white text-base font-bold relative pb-3 after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gold">
            Mairie de Kpédomé
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <Icon name="pin" className="size-4 mt-0.5 shrink-0 text-gold-light" />
              {g.adresse}
            </li>
            <li className="flex gap-3">
              <Icon name="phone" className="size-4 mt-0.5 shrink-0 text-gold-light" />
              <a href={tel(g.telephone)} className="hover:text-white">
                {g.telephone}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="mail" className="size-4 mt-0.5 shrink-0 text-gold-light" />
              <a href={`mailto:${g.email}`} className="hover:text-white break-all">
                {g.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="clock" className="size-4 mt-0.5 shrink-0 text-gold-light" />
              <span>
                {g.horaires_jours}
                <br />
                {g.horaires_matin} / {g.horaires_apres_midi}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <span>© {new Date().getFullYear()} {g.nom_complet}. Tous droits réservés.</span>
          {/* Lien classique : l'administration est une application à part, servie par le backend. */}
          <a href="/admin" className="inline-flex items-center gap-2 hover:text-gold-light transition-colors uppercase tracking-widest">
            <Icon name="users" className="size-4" /> Espace mairie
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="space-y-5">
      <h4 className="font-display text-white text-base font-bold relative pb-3 after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gold">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm">
        {links.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="inline-flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">
              <Icon name="right" className="size-3 text-gold-light" strokeWidth={3} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
