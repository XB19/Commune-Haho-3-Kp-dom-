import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "./components/Icon.jsx";
import { api } from "./lib/api.js";
import { Badge, Button, Card, Empty, PageTitle, Spinner, formatDateTime, timeAgo, useToast } from "./ui.jsx";

const isEmail = (s) => /^\S+@\S+\.\S+$/.test(s);
const notify = () => window.dispatchEvent(new Event("haho3:messages"));

export default function Messages() {
  const toast = useToast();
  const [params] = useSearchParams();
  const [list, setList] = useState(null);
  const [box, setBox] = useState("inbox");
  const [selected, setSelected] = useState(() => Number(params.get("id")) || null);

  const reload = useCallback(
    () =>
      api("/api/admin/messages")
        .then(setList)
        .catch((e) => (toast(e.message, "error"), setList([]))),
    [toast]
  );
  useEffect(() => {
    reload();
  }, [reload]);

  const visibles = useMemo(() => (list ?? []).filter((m) => (box === "archive" ? m.archive : !m.archive)), [list, box]);
  const current = list?.find((m) => m.id === selected) ?? null;

  const patch = useCallback(
    async (m, data, message) => {
      try {
        const updated = await api(`/api/admin/messages/${m.id}`, { method: "PATCH", body: data });
        setList((l) => l.map((x) => (x.id === m.id ? updated : x)));
        notify();
        if (message) toast(message);
      } catch (e) {
        toast(e.message, "error");
      }
    },
    [toast]
  );

  // Ouvrir un message le marque comme lu (une seule fois : « Marquer non lu » reste respecté).
  const open = useCallback(
    (m) => {
      setSelected(m.id);
      if (!m.lu) patch(m, { lu: true });
    },
    [patch]
  );
  const [initialDone, setInitialDone] = useState(false);
  useEffect(() => {
    if (initialDone || !list) return;
    setInitialDone(true);
    const m = list.find((x) => x.id === selected);
    if (m) open(m);
  }, [list, selected, open, initialDone]);

  async function remove(m) {
    if (!window.confirm("Supprimer définitivement ce message ?")) return;
    try {
      await api(`/api/admin/messages/${m.id}`, { method: "DELETE" });
      setList((l) => l.filter((x) => x.id !== m.id));
      setSelected(null);
      notify();
      toast("Message supprimé.");
    } catch (e) {
      toast(e.message, "error");
    }
  }

  const unread = (list ?? []).filter((m) => !m.lu && !m.archive).length;

  return (
    <>
      <PageTitle
        eyebrow="Citoyens"
        title="Messages"
        description="Les messages envoyés depuis le formulaire de la page Contact."
        actions={
          <Button variant="ghost" icon="refresh" onClick={reload}>
            Actualiser
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        <Card padded={false}>
          <div className="flex gap-1 bg-mist rounded-lg p-1 m-4">
            {[
              ["inbox", `Reçus${unread ? ` (${unread})` : ""}`],
              ["archive", "Archivés"],
            ].map(([k, l]) => (
              <button
                key={k}
                type="button"
                onClick={() => (setBox(k), setSelected(null))}
                className={`flex-1 font-display text-xs font-bold px-3 py-2 rounded-md transition-colors ${
                  box === k ? "bg-white text-gold shadow-sm" : "text-body hover:text-ink"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {list === null ? (
            <Spinner />
          ) : visibles.length === 0 ? (
            <Empty icon="inbox" title={box === "archive" ? "Aucun message archivé" : "Boîte de réception vide"} />
          ) : (
            <ul className="divide-y divide-line border-t border-line max-h-[65vh] overflow-y-auto">
              {visibles.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => open(m)}
                    className={`w-full text-left px-4 py-3.5 flex gap-3 transition-colors ${
                      selected === m.id ? "bg-gold/10" : "hover:bg-mist"
                    }`}
                  >
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${m.lu ? "bg-transparent" : "bg-crimson"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex justify-between gap-2">
                        <span className={`truncate text-sm ${m.lu ? "text-char" : "font-display font-bold text-ink"}`}>{m.nom}</span>
                        <span className="text-[11px] shrink-0">{timeAgo(m.created_at)}</span>
                      </span>
                      <span className={`block truncate text-sm ${m.lu ? "" : "text-ink"}`}>{m.objet}</span>
                      <span className="block truncate text-xs text-body/80">{m.message}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card padded={false} className="min-h-80">
          {!current ? (
            <Empty icon="mail" title="Sélectionnez un message">
              Son contenu s'affichera ici.
            </Empty>
          ) : (
            <article className="animate-page-in">
              <header className="p-6 border-b border-line">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {current.archive ? <Badge tone="gray">Archivé</Badge> : <Badge tone="gold">Reçu</Badge>}
                  <span className="text-xs">{formatDateTime(current.created_at)}</span>
                </div>
                <h2 className="text-xl font-bold text-ink">{current.objet}</h2>
                <p className="mt-2 text-sm">
                  De <b className="font-display text-ink">{current.nom}</b> ·{" "}
                  {isEmail(current.contact) ? (
                    <a className="text-gold hover:text-crimson" href={`mailto:${current.contact}`}>
                      {current.contact}
                    </a>
                  ) : (
                    <a className="text-gold hover:text-crimson" href={`tel:${current.contact.replace(/[^\d+]/g, "")}`}>
                      {current.contact}
                    </a>
                  )}
                </p>
              </header>
              <p className="p-6 whitespace-pre-line leading-relaxed text-char">{current.message}</p>
              <footer className="flex flex-wrap gap-2 p-6 pt-0">
                {isEmail(current.contact) ? (
                  <a
                    href={`mailto:${current.contact}?subject=${encodeURIComponent("Re : " + current.objet)}`}
                    className="inline-flex items-center gap-2 font-display text-sm font-bold bg-gold text-white px-5 py-2.5 rounded-lg hover:bg-gold-dark transition-colors"
                  >
                    <Icon name="mail" className="size-4" /> Répondre par e-mail
                  </a>
                ) : (
                  <a
                    href={`tel:${current.contact.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-2 font-display text-sm font-bold bg-gold text-white px-5 py-2.5 rounded-lg hover:bg-gold-dark transition-colors"
                  >
                    <Icon name="phone" className="size-4" /> Appeler
                  </a>
                )}
                <Button variant="ghost" icon="mail" onClick={() => patch(current, { lu: !current.lu })}>
                  Marquer {current.lu ? "non lu" : "lu"}
                </Button>
                <Button
                  variant="ghost"
                  icon="inbox"
                  onClick={() => {
                    patch(current, { archive: !current.archive }, current.archive ? "Message restauré." : "Message archivé.");
                    setSelected(null);
                  }}
                >
                  {current.archive ? "Restaurer" : "Archiver"}
                </Button>
                <Button variant="danger" icon="trash" onClick={() => remove(current)}>
                  Supprimer
                </Button>
              </footer>
            </article>
          )}
        </Card>
      </div>
    </>
  );
}
