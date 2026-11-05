import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";

// Composants d'interface de l'administration, dans la charte du site (or, encre, Montserrat).

export const inputClass =
  "w-full rounded-lg bg-white border border-line px-3.5 py-2.5 text-sm text-ink placeholder:text-body/50 focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/15 transition disabled:bg-mist";

const VARIANTS = {
  primary: "bg-gold text-white hover:bg-gold-dark shadow-[0_6px_16px_rgba(131,105,54,0.3)]",
  dark: "bg-ink text-white hover:bg-char",
  ghost: "bg-white text-ink ring-1 ring-line hover:ring-gold hover:text-gold",
  danger: "bg-white text-crimson ring-1 ring-crimson/25 hover:bg-crimson hover:text-white",
  subtle: "text-body hover:text-gold hover:bg-mist",
};

export function Button({ variant = "primary", icon, children, className = "", size = "md", ...props }) {
  const sz = size === "sm" ? "px-3 py-2 text-xs gap-1.5" : "px-5 py-2.5 text-sm gap-2";
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center font-display font-bold rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none ${sz} ${VARIANTS[variant]} ${className}`}
    >
      {icon && <Icon name={icon} className={size === "sm" ? "size-3.5" : "size-4"} strokeWidth={2.2} />}
      {children}
    </button>
  );
}

export function IconButton({ icon, label, variant = "subtle", className = "", ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`inline-flex size-9 items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none ${VARIANTS[variant]} ${className}`}
    >
      <Icon name={icon} className="size-4" strokeWidth={2} />
    </button>
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      {label && <span className="block font-display text-[13px] font-semibold text-ink">{label}</span>}
      {children}
      {hint && <span className="block text-xs text-body/70">{hint}</span>}
    </label>
  );
}

export function Card({ title, actions, children, className = "", padded = true }) {
  return (
    <section className={`min-w-0 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.03] ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-line">
          {title && <h2 className="font-display font-bold text-ink text-base">{title}</h2>}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </header>
      )}
      <div className={padded ? "p-6" : ""}>{children}</div>
    </section>
  );
}

export function PageTitle({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-crimson">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-ink tracking-tight">{title}</h1>
        <span className="block h-1 w-14 bg-gold mt-3 rounded-full" />
        {description && <p className="mt-4 text-sm max-w-[70ch]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Badge({ tone = "gold", children }) {
  const tones = {
    gold: "bg-gold/10 text-gold-dark",
    green: "bg-togo-green/10 text-togo-green",
    red: "bg-crimson/10 text-crimson",
    gray: "bg-mist text-body",
    dark: "bg-ink text-white",
  };
  return (
    <span className={`inline-flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Empty({ icon = "doc", title, children }) {
  return (
    <div className="text-center py-14 px-6">
      <span className="mx-auto size-14 rounded-full bg-mist text-gold-light flex items-center justify-center">
        <Icon name={icon} className="size-7" />
      </span>
      <p className="mt-4 font-display font-semibold text-ink">{title}</p>
      {children && <p className="mt-1 text-sm">{children}</p>}
    </div>
  );
}

export function Spinner({ label = "Chargement…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-body" role="status">
      <span className="size-5 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      {label}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <span className="relative">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="block h-6 w-11 rounded-full bg-line peer-checked:bg-gold transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-gold/20" />
        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      <span className="text-sm font-medium text-ink">{label}</span>
    </label>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="animate-page-in fixed inset-0 z-[80] bg-ink/70 backdrop-blur-sm flex items-start justify-center p-4 md:p-10 overflow-y-auto"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`animate-fade-up [animation-duration:0.35s] bg-white rounded-2xl w-full ${wide ? "max-w-5xl" : "max-w-xl"} shadow-2xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-line">
          <h2 className="font-display font-bold text-ink">{title}</h2>
          <IconButton icon="close" label="Fermer" onClick={onClose} />
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Notifications ---------- */

const ToastContext = createContext(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const id = useRef(0);
  const push = useCallback((message, tone = "ok") => {
    const t = { id: ++id.current, message, tone };
    setToasts((l) => [...l, t]);
    setTimeout(() => setToasts((l) => l.filter((x) => x.id !== t.id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-5 z-[90] space-y-2 w-[min(380px,calc(100vw-2.5rem))]" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-up [animation-duration:0.3s] flex items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-xl text-white ${
              t.tone === "error" ? "bg-crimson" : "bg-ink"
            }`}
          >
            <Icon name={t.tone === "error" ? "close" : "check"} className="size-4 mt-0.5 shrink-0 text-gold-light" strokeWidth={2.5} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- Utilitaires ---------- */

export function formatSize(bytes) {
  if (!bytes) return "0 o";
  const u = ["o", "Ko", "Mo", "Go"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} ${u[i]}`;
}

export function timeAgo(date) {
  const s = Math.round((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  if (s < 7 * 86400) return `il y a ${Math.floor(s / 86400)} j`;
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}
