import { useEffect, useRef, useState } from "react";

// Compteur animé : « 58 695 » part de 0 quand il devient visible. Le suffixe (ex. « km² ») est conservé.
export default function CountUp({ value, duration = 1800 }) {
  // Le nombre se termine par un chiffre : l'espace avant le suffixe (« 592 km² ») reste dans le suffixe.
  const match = String(value).match(/^(\d(?:[\d\s ]*\d)?)(.*)$/);
  const target = match ? Number(match[1].replace(/[\s ]/g, "")) : NaN;
  const suffix = match ? match[2] : "";
  const ref = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (Number.isNaN(target) || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  if (Number.isNaN(target)) return <span>{value}</span>;
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}
