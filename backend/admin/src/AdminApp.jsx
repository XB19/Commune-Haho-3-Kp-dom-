import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Icon from "./components/Icon.jsx";
import logo from "./assets/logo-commune-haho3.png";
import { api } from "./lib/api.js";
import { AuthProvider, useAuth } from "./auth.jsx";
import { SECTIONS } from "./schemas.js";
import { Spinner, ToastProvider } from "./ui.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import ActualitesAdmin from "./ActualitesAdmin.jsx";
import ContentEditor from "./ContentEditor.jsx";
import Messages from "./Messages.jsx";
import Medias from "./Medias.jsx";
import Utilisateurs from "./Utilisateurs.jsx";
import Compte from "./Compte.jsx";

// Administration du site : /admin/*. Séparée du site public (pas d'en-tête ni de pied de page publics).
export default function AdminApp() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </ToastProvider>
  );
}

function Gate() {
  const { user } = useAuth();
  useEffect(() => {
    document.title = "Espace mairie | Haho 3 – Kpédomé";
  }, []);
  if (user === undefined) return <Spinner label="Vérification de la session…" />;
  if (!user) return <Login />;
  return <Shell />;
}

function Shell() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  const [unread, setUnread] = useState(0);

  const refreshUnread = useCallback(
    () =>
      api("/api/admin/stats")
        .then((s) => setUnread(s.messages.non_lus))
        .catch(() => {}),
    []
  );

  useEffect(() => {
    refreshUnread();
    const t = setInterval(refreshUnread, 60000);
    window.addEventListener("haho3:messages", refreshUnread);
    return () => {
      clearInterval(t);
      window.removeEventListener("haho3:messages", refreshUnread);
    };
  }, [refreshUnread]);

  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-mist">
      {/* Bande tricolore */}
      <div className="fixed top-0 inset-x-0 z-[60] h-1 flex">
        <span className="flex-1 bg-togo-green" />
        <span className="flex-1 bg-togo-yellow" />
        <span className="flex-1 bg-togo-red" />
      </div>

      {/* Barre latérale */}
      <aside
        className={`fixed top-1 bottom-0 left-0 z-50 w-72 bg-ink text-white/70 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          menu ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <Link to="/admin" className="flex items-center gap-3 px-6 h-20 border-b border-white/10 shrink-0">
          <img src={logo} alt="" className="size-11 object-contain" />
          <div className="border-l-2 border-gold pl-3 leading-tight">
            <p className="font-display font-extrabold text-white">Commune Haho 3</p>
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-gold-light mt-0.5">Espace mairie</p>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          <NavGroup>
            <Item to="/admin" end icon="home" label="Tableau de bord" />
            <Item to="/admin/actualites" icon="news" label="Actualités" />
            <Item to="/admin/messages" icon="inbox" label="Messages" badge={unread} />
            <Item to="/admin/medias" icon="photo" label="Médiathèque" />
          </NavGroup>
          <NavGroup title="Pages du site">
            {SECTIONS.map((s) => (
              <Item key={s.key} to={`/admin/contenu/${s.key}`} icon={s.icon} label={s.label} />
            ))}
          </NavGroup>
          <NavGroup title="Administration">
            {user.role === "admin" && <Item to="/admin/utilisateurs" icon="users" label="Utilisateurs" />}
            <Item to="/admin/compte" icon="lock" label="Mon compte" />
          </NavGroup>
        </nav>

        <div className="border-t border-white/10 p-4 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <span className="size-10 shrink-0 rounded-full bg-gold text-white font-display font-bold flex items-center justify-center">
              {user.nom.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-white truncate">{user.nom}</p>
              <p className="text-xs truncate">{user.role === "admin" ? "Administrateur" : "Éditeur"}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Se déconnecter"
              aria-label="Se déconnecter"
              className="p-2 rounded-lg hover:bg-white/10 hover:text-gold-light transition-colors"
            >
              <Icon name="logout" className="size-5" />
            </button>
          </div>
        </div>
      </aside>

      {menu && <div className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={() => setMenu(false)} />}

      <div className="lg:pl-72 pt-1">
        {/* Barre supérieure */}
        <header className="sticky top-1 z-30 h-16 bg-white/95 backdrop-blur border-b border-line">
          <div className="h-full max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 text-ink hover:text-gold"
              onClick={() => setMenu(true)}
              aria-label="Ouvrir le menu"
            >
              <Icon name="menu" className="size-6" />
            </button>
            <p className="hidden sm:block text-sm">
              Bonjour <span className="font-display font-bold text-ink">{user.nom}</span>
            </p>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display text-sm font-bold text-gold hover:text-crimson transition-colors"
            >
              Voir le site <Icon name="external" className="size-4" />
            </a>
          </div>
        </header>

        <main key={pathname} className="animate-page-in max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="actualites" element={<ActualitesAdmin />} />
            <Route path="contenu/:cle" element={<ContentEditor />} />
            <Route path="messages" element={<Messages />} />
            <Route path="medias" element={<Medias />} />
            {user.role === "admin" && <Route path="utilisateurs" element={<Utilisateurs />} />}
            <Route path="compte" element={<Compte />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function NavGroup({ title, children }) {
  return (
    <div>
      {title && <p className="px-3 mb-2 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">{title}</p>}
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function Item({ to, icon, label, badge, end }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `relative flex items-center gap-3 px-3 py-2.5 rounded-lg font-display text-sm font-semibold transition-colors ${
            isActive ? "bg-gold text-white shadow-[0_8px_20px_rgba(131,105,54,0.35)]" : "hover:bg-white/5 hover:text-white"
          }`
        }
      >
        <Icon name={icon} className="size-[18px] shrink-0" />
        <span className="flex-1">{label}</span>
        {badge > 0 && (
          <span className="min-w-5 h-5 px-1.5 rounded-full bg-crimson text-white text-[11px] font-bold flex items-center justify-center">
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
}
