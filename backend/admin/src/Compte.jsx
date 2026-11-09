import { useState } from "react";
import { api } from "./lib/api.js";
import { useAuth } from "./auth.jsx";
import { Badge, Button, Card, Field, PageTitle, inputClass, useToast } from "./ui.jsx";

export default function Compte() {
  const { user } = useAuth();
  const toast = useToast();
  const [f, setF] = useState({ actuel: "", nouveau: "", confirmation: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (f.nouveau !== f.confirmation) return toast("Les deux nouveaux mots de passe ne correspondent pas.", "error");
    setBusy(true);
    try {
      await api("/api/auth/password", { method: "PUT", body: { actuel: f.actuel, nouveau: f.nouveau } });
      setF({ actuel: "", nouveau: "", confirmation: "" });
      toast("Mot de passe modifié.");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageTitle eyebrow="Administration" title="Mon compte" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
        <Card title="Profil">
          <div className="flex items-center gap-4">
            <span className="size-16 rounded-full bg-gold text-white font-display text-2xl font-bold flex items-center justify-center">
              {user.nom.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <p className="font-display text-lg font-bold text-ink">{user.nom}</p>
              <p className="text-sm">{user.email}</p>
              <div className="mt-2">{user.role === "admin" ? <Badge tone="dark">Administrateur</Badge> : <Badge>Éditeur</Badge>}</div>
            </div>
          </div>
        </Card>
        <Card title="Changer mon mot de passe">
          <form onSubmit={submit} className="space-y-5">
            <Field label="Mot de passe actuel">
              <input className={inputClass} type="password" autoComplete="current-password" required value={f.actuel} onChange={set("actuel")} />
            </Field>
            <Field label="Nouveau mot de passe" hint="8 caractères minimum. Mélangez lettres, chiffres et symboles.">
              <input className={inputClass} type="password" autoComplete="new-password" minLength={8} required value={f.nouveau} onChange={set("nouveau")} />
            </Field>
            <Field label="Confirmer le nouveau mot de passe">
              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={f.confirmation}
                onChange={set("confirmation")}
              />
            </Field>
            <Button type="submit" icon="check" disabled={busy}>
              {busy ? "Enregistrement…" : "Modifier le mot de passe"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
