import { useEffect, useState } from "react";
import Icon from "./Icon.jsx";

const R = 22;
const C = 2 * Math.PI * R;

// Bouton « retour en haut » avec anneau de progression de lecture.
export default function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      setVisible(y > 400);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Revenir en haut de la page"
      title="Revenir en haut"
      className={`group fixed bottom-6 right-6 z-[65] size-14 rounded-full bg-ink text-white shadow-[0_15px_35px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-500 hover:bg-gold hover:-translate-y-1 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
        <circle
          cx="28"
          cy="28"
          r={R}
          fill="none"
          stroke="#b39a62"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          className="transition-[stroke-dashoffset] duration-150 group-hover:stroke-white"
        />
      </svg>
      <Icon name="up" className="relative size-5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.6} />
    </button>
  );
}
