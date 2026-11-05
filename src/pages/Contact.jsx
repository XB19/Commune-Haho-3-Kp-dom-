import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Icon from "../components/Icon.jsx";
import { api } from "../lib/api.js";
import { img, useContent } from "../lib/content.jsx";

// Contenu modifiable depuis l'administration (Pages › Contact, Informations générales).
// Les messages envoyés arrivent dans l'administration (Messages).

const inputClass =
  "w-full rounded-md bg-mist border border-transparent px-4 py-3 text-sm text-ink focus:outline-none focus:bg-white focus:border-gold focus:ring-4 focus:ring-gold/15 transition";

const EMPTY = { nom: "", contact: "", objet: "", message: "", site_web: "" };
const tel = (t) => "tel:" + String(t).replace(/[^\d+]/g, "");

export default function Contact() {
  const c = useContent("contact");
  const g = useContent("general");
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setStatus({ state: "sending", message: "" });
    try {
      await api("/api/messages", { method: "POST", body: form });
      setForm(EMPTY);
      setStatus({ state: "ok", message: "Merci, votre message a bien été envoyé à la mairie. Nous vous répondrons rapidement." });
    } catch (err) {
      setStatus({
        state: "error",
        message: `${err.message} Vous pouvez aussi écrire directement à ${g.email}.`,
      });
    }
  }

  return (
    <>
      <PageHeader eyebrow="Contact" title={c.titre} intro={c.intro} image={img(c.image_entete)} />

      <section className="relative z-10 px-6 lg:px-10 -mt-14">
        <div data-stagger="up" className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-5">
          <ContactCard icon="pin" title="Adresse">
            {g.adresse}
          </ContactCard>
          <ContactCard icon="phone" title="Téléphones">
            {[g.telephone, g.telephone2].filter(Boolean).map((t, i) => (
              <span key={t} className="block">
                <a className="hover:text-gold" href={tel(t)}>
                  {t}
                </a>
              </span>
            ))}
          </ContactCard>
          <ContactCard icon="mail" title="E-mail">
            <a className="hover:text-gold break-all" href={`mailto:${g.email}`}>
              {g.email}
            </a>
          </ContactCard>
        </div>
      </section>

      <section className="px-6 lg:px-10 py-24">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-14">
          <div className="space-y-10">
            <SectionTitle eyebrow="Informations pratiques" title="Bon à savoir" />
            <div data-stagger="up" className="grid sm:grid-cols-2 gap-4">
              <div className="bg-mist rounded-xl p-6">
                <Icon name="clock" className="size-6 text-gold" />
                <h3 className="mt-3 font-bold text-ink">Horaires d'ouverture</h3>
                <p className="mt-2 text-sm">
                  {g.horaires_jours} · {g.horaires_matin} et {g.horaires_apres_midi}
                </p>
              </div>
              <div className="bg-mist rounded-xl p-6">
                <Icon name="map" className="size-6 text-gold" />
                <h3 className="mt-3 font-bold text-ink">Accès à la commune</h3>
                <p className="mt-2 text-sm">{c.acces}</p>
              </div>
            </div>
            <ul data-stagger="left" data-stagger-step="70" className="divide-y divide-line rounded-xl ring-1 ring-line overflow-hidden">
              {(c.infos ?? []).map((info, i) => (
                <li key={i} className="grid grid-cols-[120px_1fr] gap-4 p-5 text-sm">
                  <span className="font-display font-bold uppercase tracking-wider text-xs text-crimson pt-0.5">{info.label}</span>
                  <span className="text-char">{info.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <form
            data-reveal="right"
            onSubmit={submit}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.1)] space-y-5 h-fit border-t-4 border-gold"
          >
            <div>
              <h2 className="text-2xl font-bold text-gold">Formulaire de contact</h2>
              <p className="text-sm mt-1">Tous les champs sont obligatoires.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Noms et prénoms" id="nom" value={form.nom} onChange={set("nom")} />
              <Field label="Téléphone ou e-mail" id="contact" value={form.contact} onChange={set("contact")} />
            </div>
            <Field label="Objet" id="objet" value={form.objet} onChange={set("objet")} />
            <div className="space-y-1.5">
              <label htmlFor="message" className="font-display text-sm font-semibold text-ink">
                Message
              </label>
              <textarea id="message" required rows={6} maxLength={10000} value={form.message} onChange={set("message")} className={inputClass} />
            </div>
            {/* Champ piège anti-robots, invisible pour les visiteurs. */}
            <input
              type="text"
              name="site_web"
              tabIndex={-1}
              autoComplete="off"
              value={form.site_web}
              onChange={set("site_web")}
              className="hidden"
              aria-hidden="true"
            />
            <button
              type="submit"
              disabled={status.state === "sending"}
              className="inline-flex items-center gap-2 font-display text-sm font-bold bg-gold text-white px-7 py-4 rounded-md hover:bg-gold-dark transition-colors disabled:opacity-60"
            >
              {status.state === "sending" ? "Envoi en cours…" : "Envoyer le message"}
              <Icon name="arrow" className="size-4" strokeWidth={2.4} />
            </button>
            {status.message && (
              <p
                role="status"
                className={`text-sm rounded-md px-4 py-3 border ${
                  status.state === "ok"
                    ? "text-togo-green bg-togo-green/5 border-togo-green/25"
                    : "text-crimson bg-crimson/5 border-crimson/20"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function ContactCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex gap-5">
      <span className="size-14 shrink-0 rounded-full bg-gold text-white flex items-center justify-center">
        <Icon name={icon} className="size-6" />
      </span>
      <div>
        <h3 className="font-bold text-ink">{title}</h3>
        <div className="mt-1 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, id, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="font-display text-sm font-semibold text-ink">
        {label}
      </label>
      <input id={id} type="text" required maxLength={200} value={value} onChange={onChange} className={inputClass} />
    </div>
  );
}
