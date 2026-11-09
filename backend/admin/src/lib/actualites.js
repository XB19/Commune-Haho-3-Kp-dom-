// Gestion des actualités depuis l'administration (base PostgreSQL via l'API).
import { api } from "./api.js";
export { CATEGORIES } from "../../../content/defaults.js";

const normalise = (a) => ({ ...a, medias: Array.isArray(a.medias) ? a.medias : [] });

// Toutes les actualités, brouillons compris.
export async function fetchAllActualites() {
  const list = await api("/api/admin/actualites");
  return list.map(normalise);
}

export function saveActualite(item) {
  return item.id
    ? api(`/api/admin/actualites/${item.id}`, { method: "PUT", body: item })
    : api("/api/admin/actualites", { method: "POST", body: item });
}

export function deleteActualite(id) {
  return api(`/api/admin/actualites/${id}`, { method: "DELETE" });
}

export function formatDate(d) {
  if (!d) return "";
  return new Date(String(d).slice(0, 10) + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
