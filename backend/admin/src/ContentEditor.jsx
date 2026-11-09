import { useEffect, useMemo, useState } from "react";
import { useBlocker, useParams } from "react-router-dom";
import Icon from "./components/Icon.jsx";
import { api } from "./lib/api.js";
import { DEFAULT_CONTENT } from "../../content/defaults.js";
import { useAuth } from "./auth.jsx";
import { ImageField } from "./media.jsx";
import { ICONS, sectionByKey } from "./schemas.js";
import { Button, Card, Field, IconButton, PageTitle, Spinner, inputClass, timeAgo, useToast } from "./ui.jsx";

// Éditeur d'une section du site (Accueil, La Commune…), généré à partir de schemas.js.
export default function ContentEditor() {
  const { cle } = useParams();
  const section = sectionByKey(cle);
  const { user } = useAuth();
  const toast = useToast();
  const [saved, setSaved] = useState(null);
  const [value, setValue] = useState(null);
  const [meta, setMeta] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(null);
    setSaved(null);
    Promise.all([api("/api/content"), api("/api/content/meta")])
      .then(([all, m]) => {
        const v = { ...DEFAULT_CONTENT[cle], ...(all[cle] ?? {}) };
        setSaved(v);
        setValue(v);
        setMeta(m.find((x) => x.cle === cle) ?? null);
      })
      .catch((e) => toast(e.message, "error"));
  }, [cle, toast]);

  const dirty = useMemo(() => value && saved && JSON.stringify(value) !== JSON.stringify(saved), [value, saved]);

  // Avertit avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const fn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [dirty]);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (window.confirm("Des modifications ne sont pas enregistrées. Quitter quand même ?")) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  async function save() {
    setSaving(true);
    try {
      await api(`/api/content/${cle}`, { method: "PUT", body: value });
      setSaved(value);
      setMeta({ updated_at: new Date().toISOString(), par: user.nom });
      toast("Modifications enregistrées et publiées sur le site.");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!window.confirm("Remettre toute cette section à son contenu d'origine ? Vos modifications seront perdues.")) return;
    try {
      const v = await api(`/api/content/${cle}/reset`, { method: "POST" });
      setSaved(v);
      setValue(v);
      toast("Section réinitialisée.");
    } catch (e) {
      toast(e.message, "error");
    }
  }

  if (!section) return <p>Section inconnue.</p>;

  return (
    <div className="pb-24">
      <PageTitle
        eyebrow="Pages du site"
        title={section.label}
        description={section.description}
        actions={
          <>
            <a
              href={section.path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display text-sm font-bold rounded-lg px-5 py-2.5 bg-white ring-1 ring-line text-ink hover:ring-gold hover:text-gold transition-colors"
            >
              <Icon name="eye" className="size-4" /> Voir la page
            </a>
            {user.role === "admin" && (
              <Button variant="ghost" icon="refresh" onClick={reset}>
                Contenu d'origine
              </Button>
            )}
          </>
        }
      />

      {!value ? (
        <Spinner />
      ) : (
        <div className="space-y-6">
          {section.groups.map((g) => (
            <Card key={g.title} title={g.title}>
              <Fields fields={g.fields} value={value} onChange={setValue} />
            </Card>
          ))}
        </div>
      )}

      {/* Barre d'enregistrement fixe */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-72 z-30 bg-white/95 backdrop-blur border-t border-line">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-body flex items-center gap-2">
            {dirty ? (
              <>
                <span className="size-2 rounded-full bg-togo-yellow" /> Modifications non enregistrées
              </>
            ) : meta?.updated_at ? (
              <>
                <span className="size-2 rounded-full bg-togo-green" /> Enregistré {timeAgo(meta.updated_at)}
                {meta.par ? ` par ${meta.par}` : ""}
              </>
            ) : (
              <>
                <span className="size-2 rounded-full bg-togo-green" /> Contenu d'origine
              </>
            )}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" disabled={!dirty || saving} onClick={() => setValue(saved)}>
              Annuler
            </Button>
            <Button icon="check" disabled={!dirty || saving} onClick={save}>
              {saving ? "Enregistrement…" : "Enregistrer et publier"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Champs génériques ---------- */

function Fields({ fields, value, onChange }) {
  const set = (name) => (v) => onChange({ ...value, [name]: v });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
      {fields.map((f) => (
        <div key={f.name} className={`min-w-0 ${f.half ? "" : "md:col-span-2"}`}>
          <FieldInput field={f} value={value?.[f.name]} onChange={set(f.name)} />
        </div>
      ))}
    </div>
  );
}

function FieldInput({ field: f, value, onChange }) {
  switch (f.type) {
    case "textarea":
      return (
        <Field label={f.label} hint={f.hint}>
          <textarea className={inputClass} rows={f.rows ?? 3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
    case "image":
      return (
        <div className="space-y-1.5">
          {f.label && <span className="block font-display text-[13px] font-semibold text-ink">{f.label}</span>}
          <ImageField value={value ?? ""} onChange={onChange} aspect={f.aspect} />
        </div>
      );
    case "icon":
      return (
        <Field label={f.label}>
          <div className="flex gap-2">
            <span className="size-[42px] shrink-0 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
              <Icon name={value || "doc"} className="size-5" />
            </span>
            <select className={inputClass} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
              {ICONS.map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </Field>
      );
    case "strings":
      return <StringList label={f.label} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    case "list":
      return <ListField field={f} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    default:
      return (
        <Field label={f.label} hint={f.hint}>
          <input className={inputClass} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
  }
}

const move = (list, i, d) => {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
};

function StringList({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      {label && <span className="block font-display text-[13px] font-semibold text-ink">{label}</span>}
      {value.map((s, i) => (
        <div key={i} className="flex gap-1.5 items-center">
          <span className="w-7 shrink-0 text-center font-display text-xs font-bold text-gold">{i + 1}</span>
          <input className={inputClass} value={s} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
          <IconButton icon="chevup" label="Monter" disabled={i === 0} onClick={() => onChange(move(value, i, -1))} />
          <IconButton icon="chevron" label="Descendre" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, 1))} />
          <IconButton icon="trash" label="Supprimer" onClick={() => onChange(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <Button size="sm" variant="ghost" icon="plus" onClick={() => onChange([...value, ""])}>
        Ajouter une ligne
      </Button>
    </div>
  );
}

function ListField({ field: f, value, onChange }) {
  const [open, setOpen] = useState(() => (f.compact ? -1 : 0));

  function update(i, item) {
    onChange(value.map((x, j) => (j === i ? item : x)));
  }
  function remove(i) {
    if (!window.confirm("Supprimer cet élément ?")) return;
    onChange(value.filter((_, j) => j !== i));
  }
  function add() {
    onChange([...value, structuredClone(f.empty)]);
    setOpen(value.length);
  }

  return (
    <div className="space-y-3">
      {f.label && <span className="block font-display text-[13px] font-semibold text-ink">{f.label}</span>}
      {value.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`rounded-xl ring-1 transition ${isOpen ? "ring-gold/50 bg-mist/40" : "ring-line bg-white"}`}>
            <div className="flex items-center gap-1 pl-4 pr-2 py-2">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex-1 min-w-0 flex items-center gap-3 text-left py-1"
              >
                <Icon name={isOpen ? "chevron" : "right"} className="size-4 shrink-0 text-gold" strokeWidth={2.4} />
                <span className="truncate font-display text-sm font-semibold text-ink">{f.itemLabel(item, i)}</span>
              </button>
              <IconButton icon="chevup" label="Monter" disabled={i === 0} onClick={() => (onChange(move(value, i, -1)), setOpen(-1))} />
              <IconButton
                icon="chevron"
                label="Descendre"
                disabled={i === value.length - 1}
                onClick={() => (onChange(move(value, i, 1)), setOpen(-1))}
              />
              <IconButton icon="trash" label="Supprimer" onClick={() => remove(i)} />
            </div>
            {isOpen && (
              <div className="px-4 pb-5 pt-2 border-t border-line">
                <Fields fields={f.fields} value={item} onChange={(v) => update(i, v)} />
              </div>
            )}
          </div>
        );
      })}
      <Button size="sm" variant="ghost" icon="plus" onClick={add}>
        Ajouter
      </Button>
    </div>
  );
}
