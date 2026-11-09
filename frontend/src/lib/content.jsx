import { createContext, useCallback, useContext, useEffect, useState } from "react";
import hero from "../assets/hero-commune.jpg";
import projets from "../assets/projets.jpg";
import marche from "../assets/marche.jpg";
import maire from "../assets/maire.jpg";
import logo from "../assets/logo-commune-haho3.png";

// Images fournies avec le site, désignées dans le contenu par « asset:nom ».
export const ASSETS = { hero, projets, marche, maire, logo };

export function img(value) {
  if (typeof value !== "string" || !value) return "";
  return value.startsWith("asset:") ? ASSETS[value.slice(6)] ?? "" : value;
}

const ContentContext = createContext({});

// Tout le contenu du site (textes, images, listes) vient du backend : /api/content.
// Il se modifie depuis le tableau de bord d'administration.
export function ContentProvider({ children }) {
  const [state, setState] = useState({ status: "loading", content: null });

  const load = useCallback(() => {
    setState({ status: "loading", content: null });
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    fetch("/api/content", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((content) => setState({ status: "ready", content }))
      .catch(() => setState({ status: "error", content: null }))
      .finally(() => clearTimeout(timer));
  }, []);

  useEffect(load, [load]);

  if (state.status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white" aria-busy="true">
        <img src={logo} alt="" className="size-20 object-contain animate-pulse" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-mist px-6 text-center">
        <img src={logo} alt="Armoiries de la Commune Haho 3 – Kpédomé" className="size-24 object-contain" />
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink">Site momentanément indisponible</h1>
          <span className="block h-1 w-16 bg-gold mx-auto mt-4" />
          <p className="mt-5 max-w-md">
            Le portail de la Commune Haho 3 – Kpédomé ne parvient pas à charger ses informations. Merci de réessayer
            dans quelques instants.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="font-display text-sm font-bold bg-gold text-white px-7 py-3.5 rounded-md hover:bg-gold-dark transition-colors"
        >
          Réessayer
        </button>
      </main>
    );
  }

  return <ContentContext.Provider value={state.content}>{children}</ContentContext.Provider>;
}

export function useContent(key) {
  const all = useContext(ContentContext);
  return key ? all[key] ?? {} : all;
}
