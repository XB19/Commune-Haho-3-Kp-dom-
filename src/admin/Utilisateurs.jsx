import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "./auth.jsx";
import { Badge, Button, Card, Field, IconButton, Modal, PageTitle, Spinner, Toggle, inputClass, timeAgo, useToast } from "./ui.jsx";

const EMPTY = { nom: "", email: "", role: "editeur", password: "", actif: true };

export default function Utilisateurs() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [list, setList] = useState(null);
  const [editing, setEditing] = useState(null);

  const reload = useCallback(
    () =>
      api("/api/admin/utilisateurs")
        .then(setList)
        .catch((e) => (toast(e.message, "error"), setList([]))),
    [toast]
  );
  useEffect(() => {
    reload();
  }, [reload]);

  async function remove(u) {
    if (!window.confirm(`Supprimer le compte de ${u.nom} ?`)) return;
    try {
      await api(`/api/admin/utilisateurs/${u.id}`, { method: "DELETE" });
      toast("Compte supprimé.");
      reload();
    } catch (e) {
      toast(e.message, "error");
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="Administration"
        title="Utilisateurs"
        description="Les administrateurs gèrent tout, y compris les comptes. Les éditeurs gèrent les contenus, actualités, médias et messages."
        actions={
          <Button icon="plus" onClick={() => setEditing(EMPTY)}>
            Nouveau compte
          </Button>
        }
      />
      <Card padded={false}>
        {list === null ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm text-left">
              <thead className="font-display text-xs uppercase tracking-wider text-body border-b border-line">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Nom</th>
                  <th className="px-6 py-3.5 font-bold">Rôle</th>
                  <th className="px-6 py-3.5 font-bold">Statut</th>
                  <th className="px-6 py-3.5 font-bold">Dernière connexion</th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((u) => (
                  <tr key={u.id} className="hover:bg-mist/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="size-9 shrink-0 rounded-full bg-gold/10 text-gold font-display font-bold flex items-center justify-center">
                          {u.nom.slice(0, 1).toUpperCase()}
                        </span>
                        <span>
                          <span className="block font-display font-semibold text-ink">
                            {u.nom} {u.id === me.id && <span className="text-xs text-body font-normal">(vous)</span>}
                          </span>
                          <span className="block text-xs">{u.email}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{u.role === "admin" ? <Badge tone="dark">Administrateur</Badge> : <Badge>Éditeur</Badge>}</td>
                    <td className="px-6 py-4">{u.actif ? <Badge tone="green">Actif</Badge> : <Badge tone="gray">Désactivé</Badge>}</td>
                    <td className="px-6 py-4 text-xs">{u.derniere_connexion ? timeAgo(u.derniere_connexion) : "Jamais"}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <IconButton icon="pencil" label="Modifier" onClick={() => setEditing({ ...u, password: "" })} />
                        {u.id !== me.id && <IconButton icon="trash" label="Supprimer" variant="danger" onClick={() => remove(u)} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {editing && <UserForm initial={editing} isMe={editing.id === me.id} onClose={() => setEditing(null)} onSaved={reload} />}
    </>
  );
}

function UserForm({ initial, isMe, onClose, onSaved }) {
  const toast = useToast();
  const [u, setU] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setU((x) => ({ ...x, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (u.id) await api(`/api/admin/utilisateurs/${u.id}`, { method: "PUT", body: u });
      else await api("/api/admin/utilisateurs", { method: "POST", body: u });
      toast(u.id ? "Compte mis à jour." : "Compte créé.");
      onSaved();
      onClose();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={u.id ? `Modifier ${initial.nom}` : "Nouveau compte"}>
      <form onSubmit={submit} className="space-y-5">
        <Field label="Nom complet">
          <input className={inputClass} required value={u.nom} onChange={(e) => set("nom")(e.target.value)} />
        </Field>
        <Field label="Adresse e-mail" hint={u.id ? "L'e-mail de connexion ne peut pas être modifié." : undefined}>
          <input className={inputClass} type="email" required disabled={!!u.id} value={u.email} onChange={(e) => set("email")(e.target.value)} />
        </Field>
        <Field label="Rôle">
          <select className={inputClass} value={u.role} disabled={isMe} onChange={(e) => set("role")(e.target.value)}>
            <option value="editeur">Éditeur : contenus, actualités, médias, messages</option>
            <option value="admin">Administrateur : tout, y compris les comptes</option>
          </select>
        </Field>
        <Field label={u.id ? "Nouveau mot de passe (facultatif)" : "Mot de passe"} hint="8 caractères minimum.">
          <input
            className={inputClass}
            type="password"
            autoComplete="new-password"
            minLength={8}
            required={!u.id}
            value={u.password}
            onChange={(e) => set("password")(e.target.value)}
          />
        </Field>
        {u.id && !isMe && <Toggle checked={u.actif} onChange={set("actif")} label="Compte actif" />}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" icon="check" disabled={busy}>
            {busy ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
