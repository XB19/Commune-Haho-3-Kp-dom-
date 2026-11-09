import { useEffect } from "react";

// Anime à l'apparition tout élément portant data-reveal="up|down|left|right|zoom|fade".
// Un conteneur avec data-stagger="up" (ou autre) anime ses enfants directs en cascade.
// Les contenus ajoutés plus tard (actualités chargées, filtres…) sont pris en charge.
export default function useScrollReveal(rootRef, key) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Suivi propre à cette exécution de l'effet : en mode développement, React (StrictMode)
    // lance l'effet deux fois ; un marqueur posé sur le DOM empêcherait la 2e exécution d'observer.
    const bound = new WeakSet();
    const timers = [];

    const show = (el) => {
      el.classList.add("is-visible");
      // Une fois l'animation jouée, on rend la main aux transitions propres de l'élément (survol…).
      const delay = parseInt(el.style.getPropertyValue("--reveal-delay")) || 0;
      timers.push(
        setTimeout(() => {
          el.removeAttribute("data-reveal");
          el.style.removeProperty("--reveal-delay");
        }, delay + 1000)
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          show(e.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const prepare = () => {
      root.querySelectorAll("[data-stagger]").forEach((parent) => {
        const type = parent.getAttribute("data-stagger") || "up";
        const step = Number(parent.getAttribute("data-stagger-step") || 110);
        Array.from(parent.children).forEach((child, i) => {
          if (child.classList.contains("is-visible") || child.hasAttribute("data-staggered")) return;
          child.setAttribute("data-staggered", "");
          child.setAttribute("data-reveal", type);
          child.style.setProperty("--reveal-delay", `${Math.min(i, 8) * step}ms`);
        });
      });
      root.querySelectorAll("[data-reveal]:not(.is-visible), .title-bar:not(.is-visible)").forEach((el) => {
        if (bound.has(el)) return;
        bound.add(el);
        if (reduce) show(el);
        else io.observe(el);
      });
    };

    prepare();
    const mo = new MutationObserver(prepare);
    mo.observe(root, { childList: true, subtree: true });

    // Filet de sécurité : si un navigateur ne déclenche pas l'observateur, tout s'affiche quand même.
    const safety = setTimeout(() => {
      root.querySelectorAll("[data-reveal]:not(.is-visible), .title-bar:not(.is-visible)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show(el);
      });
    }, 1500);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(safety);
      timers.forEach(clearTimeout);
    };
  }, [rootRef, key]);
}
