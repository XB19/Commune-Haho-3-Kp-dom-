import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../content/defaults.js";
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

const ContentContext = createContext(DEFAULT_CONTENT);

// Charge le contenu du site depuis la base de données (via l'API).
// Si l'API ne répond pas, le contenu par défaut s'affiche : le site reste toujours consultable.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let done = false;
    const finish = (c) => {
      if (done) return;
      done = true;
      setContent(c);
    };
    const timer = setTimeout(() => finish(DEFAULT_CONTENT), 4000);
    fetch("/api/content")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const merged = {};
        for (const key of Object.keys(DEFAULT_CONTENT)) merged[key] = { ...DEFAULT_CONTENT[key], ...(data?.[key] ?? {}) };
        finish(merged);
      })
      .catch(() => finish(DEFAULT_CONTENT))
      .finally(() => clearTimeout(timer));
    return () => clearTimeout(timer);
  }, []);

  if (!content) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white" aria-busy="true">
        <img src={logo} alt="" className="size-20 object-contain animate-pulse" />
      </div>
    );
  }
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent(key) {
  const all = useContext(ContentContext);
  return key ? all[key] ?? DEFAULT_CONTENT[key] : all;
}
