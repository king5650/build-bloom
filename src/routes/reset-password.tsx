import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Nouveau mot de passe — A.S Africa" },
    { name: "description", content: "Choisissez un nouveau mot de passe sécurisé pour votre compte A.S Africa." },
    { property: "og:title", content: "Nouveau mot de passe — A.S Africa" },
    { property: "og:description", content: "Choose a new secure password for your A.S Africa account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { t } = useI18n();
  const [validRecovery, setValidRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const recoveryHash = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    setValidRecovery(recoveryHash);
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") setValidRecovery(true); });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (password.length < 8 || password !== confirm) { setError(t({ fr: "Utilisez au moins 8 caractères et confirmez exactement le mot de passe.", en: "Use at least 8 characters and confirm the password exactly." })); return; }
    setPending(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false); if (updateError) setError(updateError.message); else setDone(true);
  }

  return <div className="flex min-h-[75dvh] items-center justify-center px-5 py-16"><div className="w-full max-w-md"><p className="label-mono text-accent">{t({ fr: "Sécurité", en: "Security" })}</p><h1 className="display-tight mt-3 text-5xl">{t({ fr: "Nouveau mot de passe", en: "New password" })}</h1>
    {done ? <div className="mt-8"><div className="flex gap-3 border border-emerald-700/30 bg-emerald-700/10 p-4 text-sm"><Check className="h-5 w-5 text-emerald-700" />{t({ fr: "Votre mot de passe a été mis à jour.", en: "Your password has been updated." })}</div><Button asChild className="label-mono mt-4 h-12 w-full rounded-none bg-accent text-accent-foreground"><Link to="/login">{t({ fr: "Se connecter", en: "Log in" })}</Link></Button></div> : validRecovery ? <form onSubmit={submit} className="mt-8 space-y-5"><label className="block"><span className="label-mono text-muted-foreground">{t({ fr: "Nouveau mot de passe", en: "New password" })}</span><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 rounded-none bg-card" /></label><label className="block"><span className="label-mono text-muted-foreground">{t({ fr: "Confirmer", en: "Confirm" })}</span><Input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-2 h-12 rounded-none bg-card" /></label>{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}<Button disabled={pending} className="label-mono h-12 w-full rounded-none bg-accent text-accent-foreground hover:bg-accent">{pending ? <Loader2 className="animate-spin" /> : null}{t({ fr: "Enregistrer", en: "Save password" })}</Button></form> : <div className="mt-8 border border-destructive/30 bg-destructive/10 p-4 text-sm">{t({ fr: "Ce lien de récupération est invalide ou expiré.", en: "This recovery link is invalid or expired." })}</div>}
  </div></div>;
}