import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { useI18n } from "@/i18n/i18n";
import { CONTACT, whatsappLink } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — A.S Africa, Yaoundé" },
      {
        name: "description",
        content:
          "Call, WhatsApp or email A.S Africa in Yaoundé for painting, renovation and building decoration work.",
      },
      { property: "og:title", content: "Contact A.S Africa — Yaoundé" },
      {
        property: "og:description",
        content: "WhatsApp, phone, email and location for our renovation crew in Yaoundé.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(4).max(120),
  message: z.string().trim().min(5).max(1000),
});

function ContactPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const field =
    "mt-2 w-full border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(
        t({ fr: "Merci de remplir tous les champs.", en: "Please fill in all the fields." }),
      );
      return;
    }
    const d = parsed.data;
    window.open(
      whatsappLink(`${d.name} (${d.contact})\n${d.message}`),
      "_blank",
      "noreferrer",
    );
    toast.success(t({ fr: "Message prêt sur WhatsApp.", en: "Message ready on WhatsApp." }));
  }

  const cards = [
    {
      icon: MessageCircle,
      label: { fr: "WhatsApp (le plus rapide)", en: "WhatsApp (fastest)" },
      value: CONTACT.phoneDisplay,
      href: whatsappLink("Bonjour A.S Africa,"),
    },
    {
      icon: Phone,
      label: { fr: "Téléphone", en: "Phone" },
      value: CONTACT.phoneDisplay,
      href: `tel:${CONTACT.phoneRaw}`,
    },
    {
      icon: Mail,
      label: { fr: "Email", en: "Email" },
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    { icon: MapPin, label: { fr: "Zone d'intervention", en: "Service area" }, value: t(CONTACT.city) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="label-mono text-accent">{t({ fr: "Contact", en: "Contact" })}</p>
        <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
          {t({ fr: "Parlons de votre bâtiment", en: "Let's talk about your building" })}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t({
            fr: "WhatsApp est le canal le plus rapide : envoyez-nous deux photos et nous vous répondons avec une première estimation.",
            en: "WhatsApp is the fastest channel: send us two photos and we reply with a first estimate.",
          })}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {cards.map((c) => {
              const Icon = c.icon;
              const inner = (
                <>
                  <Icon className="h-5 w-5 text-accent" />
                  <p className="label-mono mt-3 text-muted-foreground">{t(c.label)}</p>
                  <p className="mt-1 text-sm font-medium break-words">{c.value}</p>
                </>
              );
              return c.href ? (
                <a
                  key={c.value + t(c.label)}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="bg-background p-6 transition-colors hover:bg-card"
                >
                  {inner}
                </a>
              ) : (
                <div key={c.value + t(c.label)} className="bg-background p-6">
                  {inner}
                </div>
              );
            })}
          </div>

          <div className="blueprint-grid mt-px flex h-56 items-center justify-center border border-border">
            <p className="label-mono text-muted-foreground">
              {t({ fr: "Yaoundé & environs", en: "Yaoundé & surroundings" })}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="border border-border bg-card p-6 sm:p-8">
            <h2 className="display-tight text-2xl">
              {t({ fr: "Écrivez-nous", en: "Send us a message" })}
            </h2>
            <label className="mt-5 block">
              <span className="label-mono">{t({ fr: "Nom", en: "Name" })}</span>
              <input
                className={field}
                maxLength={80}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="mt-4 block">
              <span className="label-mono">
                {t({ fr: "Téléphone ou email", en: "Phone or email" })}
              </span>
              <input
                className={field}
                maxLength={120}
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
            </label>
            <label className="mt-4 block">
              <span className="label-mono">{t({ fr: "Message", en: "Message" })}</span>
              <textarea
                rows={6}
                maxLength={1000}
                className={field}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              className="label-mono mt-6 w-full bg-accent px-6 py-3.5 text-accent-foreground"
            >
              {t({ fr: "Envoyer via WhatsApp", en: "Send via WhatsApp" })}
            </motion.button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}