// Actualités publiées, lues depuis l'API du backend (base PostgreSQL).
import { api } from "./api.js";

export async function fetchActualites() {
  const list = await api("/api/actualites");
  return list.map((a) => ({ ...a, medias: Array.isArray(a.medias) ? a.medias : [] }));
}

export function formatDate(d) {
  if (!d) return "";
  return new Date(String(d).slice(0, 10) + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
