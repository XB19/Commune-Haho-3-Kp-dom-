import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import { CATEGORIES, deleteActualite, fetchAllActualites, formatDate, saveActualite } from "../lib/actualites.js";
import { img } from "../lib/content.jsx";
import { ImageField, MediaPicker } from "./media.jsx";
import { Badge, Button, Card, Empty, Field, IconButton, Modal, PageTitle, Spinner, Toggle, inputClass, useToast } from "./ui.jsx";

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = {
  titre: "",
  resume: "",
  categorie: CATEGORIES[0],
  image_url: "",
  medias: [],
  date_publication: today(),
  publie: true,
  a_la_une: false,
};

export default function ActualitesAdmin() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [list, setList] = useState(null);
  const [q, setQ] = useState("");
  const [filtre, setFiltre] = useState("toutes");
  const [editing, setEditing] = useState(null);

  const reload = useCallback(
    () =>
      fetchAllActualites()
        .then(setList)
        .catch((e) => (toast(e.message, "error"), setList([]))),
    [toast]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (params.get("nouveau")) {
      setEditing({ ...EMPTY, date_publication: today() });
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const visibles = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (list ?? []).filter(
      (a) =>
        (filtre === "toutes" || (filtre === "publiees" ? a.publie : !a.publie)) &&
        (!term || a.titre.toLowerCase().includes(term) || a.categorie.toLowerCase().includes(term))
    );
  }, [list, q, filtre]);

  async function togglePublie(a) {
    try {
      await saveActualite({ ...a, publie: !a.publie });
      toast(a.publie ? "Actualité retirée du site." : "Actualité publiée.");
      reload();
    } catch (e) {
      toast(e.message, "error");
    }
  }

  async function remove(a) {
    if (!window.confirm(`Supprimer définitivement « ${a.titre} » ?`)) return;
    try {
      await deleteActualite(a.id);
      toast("Actualité supprimée.");
      reload();
    } catch (e) {
      toast(e.message, "error");
    }
  }

  const counts = {
    toutes: list?.length ?? 0,
    publiees: list?.filter((a) => a.publie).length ?? 0,
    brouillons: list?.filter((a) => !a.publie).length ?? 0,
  };

  return (
    <>
      <PageTitle
        eyebrow="Contenus"
        title="Actualités"
        description="Communiqués, événements et vie municipale. Les actualités publiées apparaissent sur l'accueil et la page Actualités."
        actions={
          <Button icon="plus" onClick={() => setEditing({ ...EMPTY, date_publication: today() })}>
            Nouvelle actualité
          </Button>
        }
      />

      <Card padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-line">
          <div className="flex gap-1 bg-mist rounded-lg p-1">
            {[
              ["toutes", "Toutes"],
              ["publiees", "Publiées"],
              ["brouillons", "Brouillons"],
            ].map(([k, l]) => (
              <button
                key={k}
                type="button"
                onClick={() => setFiltre(k)}
                className={`font-display text-xs font-bold px-3.5 py-2 rounded-md transition-colors ${
                  filtre === k ? "bg-white text-gold shadow-sm" : "text-body hover:text-ink"
                }`}
              >
                {l} <span className="opacity-60">({counts[k]})</span>
              </button>
            ))}
          </div>
          <input className={`${inputClass} sm:max-w-64`} placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {list === null ? (
          <Spinner />
        ) : visibles.length === 0 ? (
          <Empty icon="news" title={list.length ? "Aucun résultat" : "Aucune actualité pour le moment"}>
            {list.length ? "Modifiez la recherche ou le filtre." : "Cliquez sur « Nouvelle actualité » pour commencer."}
          </Empty>
        ) : (
          <ul className="divide-y divide-line">
            {visibles.map((a) => (
              <li key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-mist/50 transition-colors">
                <button
                  type="button"
                  onClick={() => setEditing(a)}
                  className="relative w-full sm:w-28 aspect-video sm:aspect-[4/3] shrink-0 rounded-lg overflow-hidden bg-mist"
                >
                  {a.image_url ? (
                    <img src={img(a.image_url)} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
                  ) : (
                    <Icon name="news" className="absolute inset-0 m-auto size-7 text-gold-light" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {a.publie ? <Badge tone="green">Publiée</Badge> : <Badge tone="gray">Brouillon</Badge>}
                    {a.a_la_une && (
                      <Badge tone="dark">
                        <Icon name="star" className="size-3 text-togo-yellow" /> À la une
                      </Badge>
                    )}
                    <Badge tone="red">{a.categorie}</Badge>
                  </div>
                  <button type="button" onClick={() => setEditing(a)} className="block text-left font-display font-bold text-ink hover:text-gold truncate max-w-full">
                    {a.titre}
                  </button>
                  <p className="text-xs mt-0.5">
                    {formatDate(a.date_publication)}
                    {a.auteur ? ` · par ${a.auteur}` : ""}
                    {a.medias.length ? ` · ${a.medias.length} média(s)` : ""}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <IconButton icon="pencil" label="Modifier" onClick={() => setEditing(a)} />
                  <IconButton icon={a.publie ? "eye" : "upload"} label={a.publie ? "Retirer du site" : "Publier"} onClick={() => togglePublie(a)} />
                  <IconButton icon="trash" label="Supprimer" variant="danger" onClick={() => remove(a)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Editor item={editing} onClose={() => setEditing(null)} onSaved={reload} />
    </>
  );
}

function Editor({ item, onClose, onSaved }) {
  const toast = useToast();
  const [a, setA] = useState(item);
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState(false);

  useEffect(() => setA(item), [item]);
  if (!item || !a) return null;

  const set = (k) => (v) => setA((x) => ({ ...x, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await saveActualite(a);
      toast(a.id ? "Actualité mise à jour." : a.publie ? "Actualité publiée." : "Brouillon enregistré.");
      onSaved();
      onClose();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={a.id ? "Modifier l'actualité" : "Nouvelle actualité"} wide>
      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-5">
          <Field label="Titre">
            <input className={inputClass} required maxLength={300} value={a.titre} onChange={(e) => set("titre")(e.target.value)} />
          </Field>
          <Field label="Texte de l'article" hint="Les retours à la ligne sont conservés à l'affichage.">
            <textarea className={inputClass} rows={12} value={a.resume} onChange={(e) => set("resume")(e.target.value)} />
          </Field>
          <div className="space-y-2">
            <span className="block font-display text-[13px] font-semibold text-ink">Galerie de l'article (photos et vidéos)</span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {a.medias.map((m, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-mist group">
                  {m.type === "video" ? (
                    <video src={img(m.url)} muted className="absolute inset-0 size-full object-cover" />
                  ) : (
                    <img src={img(m.url)} alt="" className="absolute inset-0 size-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => set("medias")(a.medias.filter((_, j) => j !== i))}
                    aria-label="Retirer"
                    className="absolute top-1.5 right-1.5 size-7 rounded-full bg-ink/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  >
                    <Icon name="close" className="size-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setPicker(true)}
                className="aspect-square rounded-lg border-2 border-dashed border-line hover:border-gold text-body hover:text-gold flex flex-col items-center justify-center gap-1 text-xs font-display font-semibold transition-colors"
              >
                <Icon name="plus" className="size-5" /> Ajouter
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl bg-mist p-5 space-y-4">
            <Toggle checked={a.publie} onChange={set("publie")} label="Publiée sur le site" />
            <Toggle checked={a.a_la_une} onChange={set("a_la_une")} label="Mettre à la une" />
          </div>
          <Field label="Catégorie">
            <select className={inputClass} value={a.categorie} onChange={(e) => set("categorie")(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Date de publication">
            <input
              type="date"
              className={inputClass}
              required
              value={String(a.date_publication).slice(0, 10)}
              onChange={(e) => set("date_publication")(e.target.value)}
            />
          </Field>
          <div className="space-y-1.5">
            <span className="block font-display text-[13px] font-semibold text-ink">Image principale</span>
            <ImageField value={a.image_url ?? ""} onChange={set("image_url")} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" icon="check" disabled={busy} className="flex-1">
              {busy ? "Enregistrement…" : "Enregistrer"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </div>
      </form>

      <MediaPicker
        open={picker}
        accept="media"
        onClose={() => setPicker(false)}
        onSelect={(m) => set("medias")([...a.medias, { url: m.url, type: m.type === "video" ? "video" : "image" }])}
      />
    </Modal>
  );
}
