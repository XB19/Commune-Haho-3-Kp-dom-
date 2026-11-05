import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SiteLayout from "./components/SiteLayout.jsx";
import { ContentProvider } from "./lib/content.jsx";
import Home from "./pages/Home.jsx";
import Commune from "./pages/Commune.jsx";
import Demarches from "./pages/Demarches.jsx";
import VieLocale from "./pages/VieLocale.jsx";
import Actualites from "./pages/Actualites.jsx";
import Projets from "./pages/Projets.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

// L'administration est chargée à part : les visiteurs du site ne téléchargent pas son code.
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

const TITLES = {
  "/": "Commune Haho 3 – Kpédomé | Portail officiel",
  "/commune": "La Commune | Haho 3 – Kpédomé",
  "/demarches": "Démarches | Haho 3 – Kpédomé",
  "/vie-locale": "Vie locale | Haho 3 – Kpédomé",
  "/actualites": "Actualités | Haho 3 – Kpédomé",
  "/projets": "Projets | Haho 3 – Kpédomé",
  "/contact": "Contact | Haho 3 – Kpédomé",
};

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<PublicSite />} />
    </Routes>
  );
}

function PublicSite() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = TITLES[pathname] ?? "Page introuvable | Haho 3 – Kpédomé";
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ContentProvider>
      <SiteLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/commune" element={<Commune />} />
          <Route path="/demarches" element={<Demarches />} />
          <Route path="/vie-locale" element={<VieLocale />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SiteLayout>
    </ContentProvider>
  );
}
