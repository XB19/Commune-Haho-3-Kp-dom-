import { Link } from "react-router-dom";
import hero from "../assets/hero-commune.jpg";

// Bandeau de page : image de couverture + dégradé sombre + fil d'Ariane.
export default function PageHeader({ eyebrow, title, intro, image = hero }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pt-40 pb-24 md:pt-60 md:pb-28">
      <img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover animate-hero-zoom" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#212226_0%,rgba(33,34,38,0.85)_40%,rgba(0,35,90,0.32)_100%)]" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 animate-fade-up">
        <nav className="flex items-center gap-2 text-xs font-display uppercase tracking-[0.18em] text-white/60 mb-6">
          <Link to="/" className="hover:text-gold-light">
            Accueil
          </Link>
          <span className="text-gold-light">/</span>
          <span className="text-white/90">{eyebrow}</span>
        </nav>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-[22ch] text-balance leading-[1.1]">
          {title}
        </h1>
        <span className="block w-20 h-1 bg-gold mt-7 mb-7" />
        {intro && <p className="text-lg text-white/80 max-w-[62ch] text-pretty leading-relaxed">{intro}</p>}
      </div>
    </section>
  );
}
