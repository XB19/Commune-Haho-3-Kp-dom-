import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

export default function NotFound() {
  return (
    <>
      <PageHeader eyebrow="Erreur 404" title="Page introuvable" intro="La page que vous recherchez n'existe pas ou a été déplacée." />
      <section className="px-6 py-24 text-center">
        <Link
          to="/"
          className="inline-block font-display text-sm font-bold bg-gold text-white px-7 py-4 rounded-md hover:bg-gold-dark transition-colors"
        >
          Retour à l'accueil
        </Link>
      </section>
    </>
  );
}
