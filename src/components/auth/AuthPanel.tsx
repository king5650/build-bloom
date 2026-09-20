import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  MessageCircle,
  Phone,
  UserRound,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import logo from "@/assets/logo white.png";
import projectOne from "@/assets/project-1-after.jpg";
import projectTwo from "@/assets/project-2-after.jpg";
import projectThree from "@/assets/project-3-after.jpg";
import { useCart } from "@/cart/cart";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/i18n";
import { whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

const PHOTOS = [projectOne, projectTwo, projectThree];

function cleanPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^237/, "").slice(0, 9);
  return digits;
}

function formattedPhone(value: string) {
  const digits = cleanPhone(value);
  return `+237${digits ? ` ${digits.match(/.{1,3}/g)?.join(" ") ?? digits}` : ""}`;
}

function destinationFromRedirect(redirect?: string) {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) return "/";
  return redirect;
}

function strengthFor(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function AuthPanel({ mode, redirect }: { mode: Mode; redirect?: string | undefined }) {
  const { t, lang, setLang } = useI18n();
  const { count } = useCart();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const firstInput = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  const phoneValid = cleanPhone(phone).length === 9 && cleanPhone(phone).startsWith("6");
  const strength = useMemo(() => strengthFor(password), [password]);
  const destination = destinationFromRedirect(redirect);

  function fail(message: string) {
    setError(message);
    setShake((value) => value + 1);
    window.requestAnimationFrame(() => firstInput.current?.focus());
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (mode === "signup") {
      if (fullName.trim().length < 2 || !phoneValid) {
        fail(t({ fr: "Vérifiez votre nom et votre numéro camerounais.", en: "Check your name and Cameroon phone number." }));
        return;
      }
      if (!email.trim()) {
        fail(t({ fr: "Ajoutez un e-mail pour vous connecter et récupérer votre mot de passe.", en: "Add an email to sign in and recover your password." }));
        return;
      }
      if (strength < 2 || password !== confirmPassword || !accepted) {
        fail(t({ fr: "Vérifiez le mot de passe, sa confirmation et les conditions.", en: "Check the password, confirmation, and terms." }));
        return;
      }
    } else if (!identifier.trim() || !password) {
      fail(t({ fr: "Entrez votre e-mail ou téléphone et votre mot de passe.", en: "Enter your email or phone and password." }));
      return;
    }

    setPending(true);
    try {
      if (mode === "signup") {
        const normalizedPhone = `+237${cleanPhone(phone)}`;
        const { data, error: signupError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: { full_name: fullName.trim(), phone: normalizedPhone, preferred_language: lang },
          },
        });
        if (signupError) throw signupError;
        if (data.session && data.user) {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            phone: normalizedPhone,
            email: email.trim().toLowerCase(),
            preferred_language: lang,
          });
          if (profileError) throw profileError;
          setSuccess(true);
          window.setTimeout(() => void navigate({ to: destination }), reduceMotion ? 0 : 650);
        } else {
          setSuccess(true);
        }
      } else {
        const value = identifier.trim();
        const credentials = value.includes("@")
          ? { email: value.toLowerCase(), password }
          : { phone: `+237${cleanPhone(value)}`, password };
        const { data, error: loginError } = await supabase.auth.signInWithPassword(credentials);
        if (loginError) throw loginError;
        const metadata = data.user.user_metadata;
        if (metadata?.["full_name"] && metadata?.["phone"]) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: String(metadata["full_name"]),
            phone: String(metadata["phone"]),
            email: data.user.email ?? null,
            preferred_language: metadata["preferred_language"] === "en" ? "en" : "fr",
          });
        }
        setSuccess(true);
        window.setTimeout(() => void navigate({ to: destination }), reduceMotion ? 0 : 650);
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Authentication failed";
      fail(message);
    } finally {
      setPending(false);
    }
  }

  const fieldClass = "h-12 rounded-none border-border bg-card pl-11 pr-11 focus-visible:border-accent focus-visible:ring-accent/25";

  return (
    <div className="min-h-dvh bg-background p-0 lg:grid lg:grid-cols-[minmax(360px,0.85fr)_minmax(520px,1.15fr)]">
      <BrandPanel reduceMotion={Boolean(reduceMotion)} />
      <motion.main
        initial={reduceMotion ? false : { opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-[calc(100dvh-112px)] items-center bg-background px-5 py-10 sm:px-10 lg:min-h-dvh lg:px-16 lg:py-14"
      >
        <motion.div
          key={shake}
          animate={shake && !reduceMotion ? { x: [0, -7, 6, -4, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-lg"
        >
          <div className="mb-9 flex items-start justify-between gap-5">
            <div>
              <p className="label-mono text-accent">{t({ fr: "Espace client", en: "Customer access" })}</p>
              <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
                {mode === "signup" ? t({ fr: "Créer votre compte", en: "Create your account" }) : t({ fr: "Bon retour", en: "Welcome back" })}
              </h1>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                {mode === "signup"
                  ? t({ fr: "Suivez vos commandes et passez plus vite à la caisse.", en: "Track orders and check out faster." })
                  : t({ fr: "Retrouvez vos commandes et vos demandes en un seul endroit.", en: "Keep your orders and requests in one place." })}
              </p>
            </div>
            <div className="flex shrink-0 border border-border" aria-label={t({ fr: "Langue", en: "Language" })}>
              {(["fr", "en"] as const).map((item) => (
                <Button key={item} type="button" variant="ghost" size="sm" onClick={() => setLang(item)} className={cn("label-mono h-9 rounded-none px-2.5", lang === item && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")}>
                  {item.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {mode === "login" && count > 0 ? (
            <div className="mb-5 border-l-2 border-accent bg-card px-4 py-3 text-sm">
              {t({ fr: `Votre panier de ${count} article${count > 1 ? "s" : ""} vous attend.`, en: `Your cart with ${count} item${count > 1 ? "s" : ""} is waiting for you.` })}
            </div>
          ) : null}

          <AnimatePresence>
            {error ? (
              <motion.div initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0 }} role="alert" aria-live="assertive" className="mb-5 flex gap-3 border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <form onSubmit={submit} noValidate className="space-y-5">
            {mode === "signup" ? (
              <>
                <Field label={t({ fr: "Nom complet", en: "Full name" })} icon={<UserRound />}>
                  <Input ref={firstInput} value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" placeholder="Marie Ngo" className={fieldClass} aria-describedby={error ? "auth-error" : undefined} />
                </Field>
                <Field label={t({ fr: "Numéro de téléphone", en: "Phone number" })} icon={<Phone />} trailing={phoneValid ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 450, damping: 18 }} className="text-emerald-700"><Check /></motion.span> : null}>
                  <Input value={formattedPhone(phone)} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" className={fieldClass} />
                </Field>
                <Field label={t({ fr: "E-mail", en: "Email" })} icon={<Mail />}>
                  <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="nom@exemple.com" className={fieldClass} />
                </Field>
              </>
            ) : (
              <Field label={t({ fr: "E-mail ou téléphone", en: "Email or phone" })} icon={<UserRound />}>
                <Input ref={firstInput} value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" placeholder="nom@exemple.com / +237 6XX XXX XXX" className={fieldClass} />
              </Field>
            )}

            <Field label={t({ fr: "Mot de passe", en: "Password" })} icon={<LockKeyhole />} trailing={<Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword((value) => !value)} className="h-10 w-10 rounded-none" aria-label={showPassword ? t({ fr: "Masquer le mot de passe", en: "Hide password" }) : t({ fr: "Afficher le mot de passe", en: "Show password" })}>{showPassword ? <EyeOff /> : <Eye />}</Button>}>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="••••••••" className={fieldClass} />
            </Field>

            {mode === "signup" ? (
              <>
                <div className="-mt-2" aria-live="polite">
                  <div className="h-1 overflow-hidden bg-muted">
                    <motion.div animate={{ width: `${(strength / 3) * 100}%` }} className={cn("h-full", strength === 1 && "bg-destructive", strength === 2 && "bg-accent", strength === 3 && "bg-emerald-700")} />
                  </div>
                  <p className="label-mono mt-2 text-muted-foreground">
                    {strength < 2 ? t({ fr: "Faible", en: "Weak" }) : strength === 2 ? t({ fr: "Bon", en: "Good" }) : t({ fr: "Fort", en: "Strong" })}
                  </p>
                </div>
                <AnimatePresence initial={false}>
                  {password ? (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-1">
                      <Field label={t({ fr: "Confirmer le mot de passe", en: "Confirm password" })} icon={<LockKeyhole />}>
                        <Input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type={showPassword ? "text" : "password"} autoComplete="new-password" className={cn(fieldClass, confirmPassword && confirmPassword !== password && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20")} />
                      </Field>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <div className="flex items-start gap-3">
                  <Checkbox id="terms" checked={accepted} onCheckedChange={(value) => setAccepted(value === true)} className="mt-0.5 h-5 w-5 rounded-none data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground" />
                  <label htmlFor="terms" className="text-xs leading-5 text-muted-foreground">
                    {t({ fr: "J’accepte les conditions d’utilisation et la politique de confidentialité.", en: "I agree to the terms and privacy policy." })}
                  </label>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" checked={remember} onCheckedChange={(value) => setRemember(value === true)} className="h-5 w-5 rounded-none" />
                  <label htmlFor="remember">{t({ fr: "Se souvenir de moi", en: "Remember me" })}</label>
                </div>
                <Link to="/forgot-password" className="font-medium text-accent hover:underline">{t({ fr: "Mot de passe oublié ?", en: "Forgot password?" })}</Link>
              </div>
            )}

            <Button type="submit" disabled={pending || success} className="label-mono h-12 w-full rounded-none bg-accent text-accent-foreground shadow-none transition-[transform,box-shadow] hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg active:scale-[0.98]">
              {pending ? <Loader2 className="animate-spin" /> : success ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check /></motion.span> : null}
              {success
                ? mode === "signup" ? t({ fr: "Vérifiez votre e-mail", en: "Check your email" }) : t({ fr: "Connexion réussie", en: "Signed in" })
                : mode === "signup" ? t({ fr: "Créer le compte", en: "Create account" }) : t({ fr: "Se connecter", en: "Log in" })}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-border" /><span className="label-mono text-muted-foreground">{t({ fr: "ou", en: "or" })}</span><span className="h-px flex-1 bg-border" /></div>
          <Button asChild variant="outline" className="label-mono h-12 w-full rounded-none border-foreground/30 bg-transparent text-[10px] tracking-normal hover:bg-primary hover:text-primary-foreground sm:text-xs">
            <a href={whatsappLink(t({ fr: "Bonjour A.S Africa, je souhaite continuer ma commande en tant qu’invité.", en: "Hello A.S Africa, I would like to continue my order as a guest." }))} target="_blank" rel="noreferrer"><MessageCircle />{t({ fr: "Continuer comme invité via WhatsApp", en: "Continue as guest via WhatsApp" })}</a>
          </Button>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            {mode === "signup" ? t({ fr: "Vous avez déjà un compte ?", en: "Already have an account?" }) : t({ fr: "Nouveau ici ?", en: "New here?" })}{" "}
            <Link to={mode === "signup" ? "/login" : "/signup"} search={redirect ? { redirect } : {}} className="font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4">
              {mode === "signup" ? t({ fr: "Se connecter", en: "Log in" }) : t({ fr: "Créer un compte", en: "Create an account" })}
            </Link>
          </p>
          <p className="mx-auto mt-5 max-w-sm text-center text-xs leading-5 text-muted-foreground">
            {t({ fr: "Vos coordonnées servent uniquement à gérer vos commandes, paiements et demandes A.S Africa.", en: "Your details are used only to manage your A.S Africa orders, payments, and requests." })}
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}

function Field({ label, icon, trailing, children }: { label: string; icon: React.ReactNode; trailing?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-mono text-muted-foreground">{label}</span>
      <span className="relative mt-2 block [&>svg]:absolute [&>svg]:left-3.5 [&>svg]:top-3.5 [&>svg]:z-10 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-muted-foreground">
        {icon}{children}{trailing ? <span className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center [&_svg]:h-5 [&_svg]:w-5">{trailing}</span> : null}
      </span>
    </label>
  );
}

function BrandPanel({ reduceMotion }: { reduceMotion: boolean }) {
  const { t } = useI18n();
  return (
    <aside className="relative isolate flex min-h-28 overflow-hidden bg-primary px-5 py-5 text-primary-foreground sm:px-10 lg:min-h-dvh lg:flex-col lg:justify-between lg:px-12 lg:py-12">
      <div className="absolute inset-0 hidden lg:block">
        {PHOTOS.map((photo, index) => (
          <motion.img key={photo} src={photo} alt="" initial={{ opacity: index === 0 ? 1 : 0, scale: 1 }} animate={reduceMotion ? { opacity: index === 0 ? 1 : 0 } : { opacity: [0, 1, 1, 0], scale: [1, 1.05, 1.05, 1.05] }} transition={{ duration: 21, delay: index * 7, repeat: Infinity, ease: "linear", times: [0, 0.06, 0.28, 0.34] }} className="absolute inset-0 h-full w-full object-cover" />
        ))}
        <div className="absolute inset-0 bg-primary/75" />
      </div>
      <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 17, delay: 0.05 }} className="relative flex items-center gap-4 lg:block">
        <img src={logo} alt="A.S Africa" className="h-12 w-12 rounded-full object-cover ring-1 ring-primary-foreground/40 lg:h-16 lg:w-16" />
        <div className="lg:mt-5">
          <p className="display-tight text-2xl lg:text-4xl">A.S Africa</p>
          <motion.p initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="label-mono mt-1 text-primary-foreground/65">
            {t({ fr: "Bâti avec précision", en: "Built with precision" })}
          </motion.p>
        </div>
      </motion.div>
      <div className="relative hidden lg:block">
        <div className="mb-8 h-px w-12 bg-accent" />
        <p className="display-tight max-w-md text-5xl leading-[0.94]">{t({ fr: "Nous redonnons vie aux bâtiments.", en: "We bring buildings back to life." })}</p>
        <p className="label-mono mt-8 text-primary-foreground/65">{t({ fr: "Des projets livrés partout à Yaoundé", en: "Projects delivered across Yaoundé" })}</p>
      </div>
    </aside>
  );
}