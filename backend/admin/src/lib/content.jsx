import hero from "../assets/hero-commune.jpg";
import projets from "../assets/projets.jpg";
import marche from "../assets/marche.jpg";
import maire from "../assets/maire.jpg";
import logo from "../assets/logo-commune-haho3.png";

// Images d'origine du site, désignées dans le contenu par « asset:nom » (mêmes noms que dans le frontend).
export const ASSETS = { hero, projets, marche, maire, logo };

export function img(value) {
  if (typeof value !== "string" || !value) return "";
  return value.startsWith("asset:") ? ASSETS[value.slice(6)] ?? "" : value;
}
