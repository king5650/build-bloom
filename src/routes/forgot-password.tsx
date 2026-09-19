import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Check, Loader2, Mail } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/i18n";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [
    { title: "Réinitialiser le mot de passe — A.S Africa" },
    { name: "description", content: "Recevez un lien sécurisé pour réinitialiser votre mot de passe A.S Africa." },
    { property: "og:title", content: "Réinitialiser le mot de passe — A.S Africa" },
    { property: "og:description", content: "Request a secure A.S Africa password reset link." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true); setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setPending(false);
    if (resetError) setError(resetError.message); else setSent(true);
  }

  return <div className="flex min-h-[75dvh] items-center justify-center px-5 py-16"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
    <Link to="/login" className="label-mono mb-8 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />{t({ fr: "Retour à la connexion", en: "Back to login" })}</Link>
    <p className="label-mono text-accent">{t({ fr: "Récupération", en: "Recovery" })}</p><h1 className="display-tight mt-3 text-5xl">{t({ fr: "Mot de passe oublié ?", en: "Forgot password?" })}</h1>
    <p className="mt-4 text-sm text-muted-foreground">{t({ fr: "Saisissez l’e-mail de votre compte. Nous vous enverrons un lien sécurisé.", en: "Enter your account email and we’ll send you a secure link." })}</p>
    {sent ? <div className="mt-8 flex gap-3 border border-emerald-700/30 bg-emerald-700/10 p-4 text-sm"><Check className="h-5 w-5 text-emerald-700" />{t({ fr: "Consultez votre boîte mail pour continuer.", en: "Check your inbox to continue." })}</div> : <form onSubmit={submit} className="mt-8 space-y-4"><label className="block"><span className="label-mono text-muted-foreground">E-mail</span><span className="relative mt-2 block"><Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" /><Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-none bg-card pl-11" /></span></label>{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}<Button disabled={pending} className="label-mono h-12 w-full rounded-none bg-accent text-accent-foreground hover:bg-accent">{pending ? <Loader2 className="animate-spin" /> : null}{t({ fr: "Envoyer le lien", en: "Send reset link" })}</Button></form>}
  </motion.div></div>;
}