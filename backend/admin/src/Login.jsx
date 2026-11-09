import { useState } from "react";
import Icon from "./components/Icon.jsx";
import hero from "./assets/hero-commune.jpg";
import logo from "./assets/logo-commune-haho3.png";
import { useAuth } from "./auth.jsx";
import { inputClass } from "./ui.jsx";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-white">
      {/* Visuel */}
      <div className="relative isolate hidden lg:flex flex-col justify-between overflow-hidden bg-ink p-12 xl:p-16">
        <img src={hero} alt="" className="absolute inset-0 -z-20 size-full object-cover animate-hero-zoom" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#212226_0%,rgba(33,34,38,0.88)_45%,rgba(0,35,90,0.45)_100%)]" />
        <a href="/" className="flex items-center gap-4 group">
          <img src={logo} alt="" className="size-16 object-contain group-hover:rotate-[-4deg] transition-transform" />
          <div className="border-l-2 border-gold pl-4">
            <p className="font-display text-2xl font-extrabold text-white leading-tight">Commune Haho 3</p>
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-gold-light mt-1">Kpédomé · Togo</p>
          </div>
        </a>
        <div className="animate-fade-up">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-light">Espace mairie</p>
          <h1 className="mt-4 text-5xl xl:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
            Administration
            <br />
            du portail communal
          </h1>
          <span className="block h-1.5 w-24 bg-gold mt-8" />
          <p className="mt-8 text-lg text-white/75 max-w-[44ch] leading-relaxed">
            Actualités, pages, médias, messages des citoyens et comptes de l'équipe : gérez tout le site depuis un seul
            espace.
          </p>
        </div>
        <div className="flex gap-1 h-1 w-28">
          <span className="flex-1 bg-togo-green" />
          <span className="flex-1 bg-togo-yellow" />
          <span className="flex-1 bg-togo-red" />
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 xl:px-20 bg-mist lg:bg-white">
        <div className="w-full max-w-md mx-auto">
          <a href="/" className="lg:hidden flex items-center gap-3 mb-10">
            <img src={logo} alt="" className="size-14 object-contain" />
            <div className="border-l-2 border-gold pl-3">
              <p className="font-display text-lg font-extrabold text-ink leading-tight">Commune Haho 3</p>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Espace mairie</p>
            </div>
          </a>

          <form onSubmit={submit} className="animate-fade-up bg-white lg:bg-transparent rounded-2xl p-8 lg:p-0 shadow-xl lg:shadow-none space-y-6">
            <div>
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gold text-white">
                <Icon name="lock" className="size-6" />
              </span>
              <h2 className="mt-6 text-3xl font-extrabold text-ink tracking-tight">Connexion</h2>
              <p className="mt-2 text-sm">Accès réservé au personnel de la mairie.</p>
            </div>

            <label className="block space-y-1.5">
              <span className="font-display text-[13px] font-semibold text-ink">Adresse e-mail</span>
              <input
                type="email"
                required
                autoComplete="username"
                autoFocus
                className={`${inputClass} py-3`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="font-display text-[13px] font-semibold text-ink">Mot de passe</span>
              <span className="relative block">
                <input
                  type={show ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className={`${inputClass} py-3 pr-12`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-body hover:text-gold"
                >
                  <Icon name="eye" className="size-4" />
                </button>
              </span>
            </label>

            {error && (
              <p role="alert" className="text-sm text-crimson bg-crimson/5 border border-crimson/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 font-display font-bold bg-gold text-white py-3.5 rounded-lg hover:bg-gold-dark transition-colors shadow-[0_10px_25px_rgba(131,105,54,0.35)] disabled:opacity-60"
            >
              {busy ? "Connexion…" : "Se connecter"} <Icon name="arrow" className="size-4" strokeWidth={2.4} />
            </button>

            <a href="/" className="flex items-center justify-center gap-2 text-sm text-body hover:text-gold">
              <Icon name="left" className="size-4" /> Retour au site public
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
