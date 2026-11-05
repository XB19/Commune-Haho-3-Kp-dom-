import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { api } from "../lib/api.js";
import { img } from "../lib/content.jsx";
import { Button, Empty, Modal, Spinner, inputClass, useToast } from "./ui.jsx";

// Envoie des fichiers vers la médiathèque et renvoie les médias créés.
export async function uploadFiles(files) {
  const form = new FormData();
  for (const f of files) form.append("fichiers", f);
  return api("/api/admin/medias", { method: "POST", form });
}

export function useMedias() {
  const [list, setList] = useState(null);
  const reload = useCallback(() => api("/api/admin/medias").then(setList).catch(() => setList([])), []);
  useEffect(() => {
    reload();
  }, [reload]);
  return [list, reload];
}

const BUILTIN = [
  { url: "asset:hero", label: "Paysage (couverture)" },
  { url: "asset:projets", label: "École (projets)" },
  { url: "asset:marche", label: "Marché" },
  { url: "asset:maire", label: "Portrait du Maire" },
  { url: "asset:logo", label: "Armoiries" },
];

// Fenêtre de choix d'un média : médiathèque, images d'origine du site, ou envoi d'un nouveau fichier.
export function MediaPicker({ open, onClose, onSelect, accept = "image" }) {
  const [list, reload] = useMedias();
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const input = useRef(null);

  useEffect(() => {
    if (open) reload();
  }, [open, reload]);

  async function onFiles(files) {
    if (!files.length) return;
    setBusy(true);
    try {
      const created = await uploadFiles(files);
      await reload();
      if (created.length === 1) {
        onSelect(created[0]);
        onClose();
      }
      toast(`${created.length} fichier(s) ajouté(s) à la médiathèque.`);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  const items = (list ?? []).filter((m) => accept === "any" || m.type === accept || (accept === "media" && m.type !== "pdf"));
  const acceptAttr = accept === "image" ? "image/*" : accept === "media" ? "image/*,video/mp4,video/webm" : "image/*,video/mp4,video/webm,application/pdf";

  return (
    <Modal open={open} onClose={onClose} title="Choisir un média" wide>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-sm">Cliquez sur un fichier pour le sélectionner, ou envoyez-en un nouveau.</p>
        <Button icon="upload" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? "Envoi…" : "Envoyer un fichier"}
        </Button>
        <input ref={input} type="file" multiple accept={acceptAttr} className="hidden" onChange={(e) => onFiles([...e.target.files])} />
      </div>

      {list === null ? (
        <Spinner />
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-crimson mb-3">Médiathèque</h3>
            {items.length === 0 ? (
              <Empty icon="photo" title="Aucun fichier pour le moment">
                Envoyez vos photos pour les réutiliser partout sur le site.
              </Empty>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {items.map((m) => (
                  <Thumb key={m.id} url={m.url} type={m.type} label={m.nom_original} onClick={() => (onSelect(m), onClose())} />
                ))}
              </div>
            )}
          </div>
          {accept !== "any" && (
            <div>
              <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-crimson mb-3">Images d'origine du site</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {BUILTIN.map((b) => (
                  <Thumb key={b.url} url={b.url} type="image" label={b.label} onClick={() => (onSelect({ url: b.url, type: "image" }), onClose())} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function Thumb({ url, type, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left rounded-xl overflow-hidden ring-1 ring-line hover:ring-2 hover:ring-gold transition"
    >
      <span className="block aspect-square bg-mist relative">
        {type === "image" ? (
          <img src={img(url)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        ) : type === "video" ? (
          <video src={url} muted className="absolute inset-0 size-full object-cover" />
        ) : (
          <Icon name="doc" className="absolute inset-0 m-auto size-10 text-gold" />
        )}
      </span>
      <span className="block px-2.5 py-2 text-xs truncate group-hover:text-gold">{label}</span>
    </button>
  );
}

// Champ image : aperçu + choisir dans la médiathèque + retirer.
export function ImageField({ value, onChange, aspect = "aspect-video" }) {
  const [open, setOpen] = useState(false);
  const src = img(value);
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`relative w-full sm:w-56 ${aspect} shrink-0 rounded-xl overflow-hidden bg-mist ring-1 ring-line hover:ring-gold transition group`}
      >
        {src ? (
          <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-body/60 text-xs">
            <Icon name="photo" className="size-7" /> Aucune image
          </span>
        )}
        <span className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-display text-sm font-bold">
          Changer
        </span>
      </button>
      <div className="flex-1 w-full space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" icon="photo" onClick={() => setOpen(true)}>
            Choisir une image
          </Button>
          {value && (
            <Button size="sm" variant="danger" icon="close" onClick={() => onChange("")}>
              Retirer
            </Button>
          )}
        </div>
        <input
          className={inputClass}
          value={value?.startsWith("asset:") ? "" : value ?? ""}
          placeholder={value?.startsWith("asset:") ? `Image d'origine : ${value.slice(6)}` : "ou collez l'adresse d'une image (https://…)"}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} onSelect={(m) => onChange(m.url)} />
    </div>
  );
}
