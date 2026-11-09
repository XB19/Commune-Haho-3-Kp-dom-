import { useRef, useState } from "react";
import Icon from "./components/Icon.jsx";
import { api } from "./lib/api.js";
import { uploadFiles, useMedias } from "./media.jsx";
import { Button, Card, Empty, IconButton, PageTitle, Spinner, formatSize, timeAgo, useToast } from "./ui.jsx";

export default function Medias() {
  const toast = useToast();
  const [list, reload] = useMedias();
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [type, setType] = useState("tous");
  const input = useRef(null);

  async function send(files) {
    if (!files.length) return;
    setBusy(true);
    try {
      const created = await uploadFiles(files);
      toast(`${created.length} fichier(s) ajouté(s).`);
      reload();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function remove(m) {
    if (!window.confirm(`Supprimer « ${m.nom_original} » ? S'il est utilisé sur le site, il n'y apparaîtra plus.`)) return;
    try {
      await api(`/api/admin/medias/${m.id}`, { method: "DELETE" });
      toast("Fichier supprimé.");
      reload();
    } catch (e) {
      toast(e.message, "error");
    }
  }

  async function copy(m) {
    try {
      await navigator.clipboard.writeText(location.origin + m.url);
      toast("Adresse copiée.");
    } catch {
      toast("Copie impossible dans ce navigateur.", "error");
    }
  }

  const visibles = (list ?? []).filter((m) => type === "tous" || m.type === type);

  return (
    <>
      <PageTitle
        eyebrow="Fichiers"
        title="Médiathèque"
        description="Photos, vidéos et documents PDF utilisés sur le site. Taille maximale : 50 Mo par fichier."
        actions={
          <Button icon="upload" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? "Envoi…" : "Envoyer des fichiers"}
          </Button>
        }
      />
      <input
        ref={input}
        type="file"
        multiple
        accept="image/*,video/mp4,video/webm,application/pdf"
        className="hidden"
        onChange={(e) => (send([...e.target.files]), (e.target.value = ""))}
      />

      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => (e.preventDefault(), setDrag(true))}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => (e.preventDefault(), setDrag(false), send([...e.dataTransfer.files]))}
        className={`w-full mb-6 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          drag ? "border-gold bg-gold/5" : "border-line bg-white hover:border-gold-light"
        }`}
      >
        <span className="mx-auto size-14 rounded-full bg-gold/10 text-gold flex items-center justify-center">
          <Icon name="upload" className="size-7" />
        </span>
        <p className="mt-4 font-display font-bold text-ink">Glissez vos fichiers ici</p>
        <p className="text-sm mt-1">ou cliquez pour les choisir · JPG, PNG, WebP, GIF, MP4, WebM, PDF</p>
      </button>

      <Card padded={false}>
        <div className="flex gap-1 bg-mist rounded-lg p-1 m-4 w-fit">
          {[
            ["tous", "Tous"],
            ["image", "Images"],
            ["video", "Vidéos"],
            ["pdf", "Documents"],
          ].map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setType(k)}
              className={`font-display text-xs font-bold px-3.5 py-2 rounded-md transition-colors ${
                type === k ? "bg-white text-gold shadow-sm" : "text-body hover:text-ink"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        {list === null ? (
          <Spinner />
        ) : visibles.length === 0 ? (
          <Empty icon="photo" title="Aucun fichier" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-0">
            {visibles.map((m) => (
              <figure key={m.id} className="group rounded-xl overflow-hidden ring-1 ring-line bg-white">
                <a href={m.url} target="_blank" rel="noreferrer" className="block relative aspect-[4/3] bg-mist">
                  {m.type === "image" ? (
                    <img src={m.url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                  ) : m.type === "video" ? (
                    <>
                      <video src={m.url} muted className="absolute inset-0 size-full object-cover" />
                      <Icon name="video" className="absolute top-2 left-2 size-6 text-white drop-shadow" />
                    </>
                  ) : (
                    <Icon name="doc" className="absolute inset-0 m-auto size-12 text-gold" />
                  )}
                </a>
                <figcaption className="flex items-center gap-1 pl-3 pr-1 py-2">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-display font-semibold text-ink" title={m.nom_original}>
                      {m.nom_original}
                    </span>
                    <span className="block text-[11px] text-body">
                      {formatSize(m.taille)} · {timeAgo(m.created_at)}
                    </span>
                  </span>
                  <IconButton icon="copy" label="Copier l'adresse" onClick={() => copy(m)} />
                  <IconButton icon="trash" label="Supprimer" onClick={() => remove(m)} />
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
