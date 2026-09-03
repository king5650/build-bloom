import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { MessageCircle } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { useI18n } from "@/i18n/i18n";
import { CATEGORIES, CONTACT, whatsappLink } from "@/data/site";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Demande de rendez-vous — A.S Africa" },
      {
        name: "description",
        content:
          "Request a site visit or a quote from A.S Africa: choose your service, date and we confirm by WhatsApp within 48h.",
      },
      { property: "og:title", content: "Book a site visit — A.S Africa" },
      {
        property: "og:description",
        content: "Tell us about your building; we confirm your appointment by WhatsApp.",
      },
    ],
  }),
  component: BookingPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(25),
  email: z.string().trim().max(120).email().or(z.literal("")),
  service: z.string().min(1),
  date: z.string().min(1),
  slot: z.string().min(1),
  address: z.string().trim().max(160),
  details: z.string().trim().max(1000),
});

const SLOTS = ["08:00 – 10:00", "10:00 – 12:00", "13:00 – 15:00", "15:00 – 17:00"];

function BookingPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "painting" as string,
    date: "",
    slot: "08:00 – 10:00",
    address: "",
    details: "",
  });

  const field =
    "mt-2 w-full border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(
        t({
          fr: "Vérifiez le nom, le téléphone et la date.",
          en: "Please check name, phone and date.",
        }),
      );
      return;
    }
    const d = parsed.data;
    const serviceLabel = CATEGORIES.find((c) => c.id === d.service);
    const message = [
      t({ fr: "Demande de rendez-vous A.S Africa", en: "A.S Africa appointment request" }),
      `${t({ fr: "Nom", en: "Name" })}: ${d.name}`,
      `${t({ fr: "Téléphone", en: "Phone" })}: ${d.phone}`,
      d.email ? `Email: ${d.email}` : "",
      `${t({ fr: "Service", en: "Service" })}: ${serviceLabel ? t(serviceLabel.label) : d.service}`,
      `${t({ fr: "Date souhaitée", en: "Preferred date" })}: ${d.date} (${d.slot})`,
      d.address ? `${t({ fr: "Adresse", en: "Address" })}: ${d.address}` : "",
      d.details ? `${t({ fr: "Détails", en: "Details" })}: ${d.details}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappLink(message), "_blank", "noreferrer");
    toast.success(
      t({
        fr: "Demande prête — envoyez-la sur WhatsApp, nous confirmons sous 48h.",
        en: "Request ready — send it on WhatsApp, we confirm within 48h.",
      }),
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="label-mono text-accent">{t({ fr: "Rendez-vous", en: "Booking" })}</p>
        <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
          {t({ fr: "Demander une visite", en: "Request a site visit" })}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t({
            fr: "Choisissez le service et un créneau souhaité. Nous confirmons par WhatsApp ou par téléphone sous 48 heures, avec un devis chiffré après la visite.",
            en: "Choose a service and a preferred slot. We confirm by WhatsApp or phone within 48 hours, with a priced quote after the visit.",
          })}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <form onSubmit={submit} className="border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="label-mono">{t({ fr: "Nom complet *", en: "Full name *" })}</span>
                <input
                  className={field}
                  maxLength={80}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label-mono">{t({ fr: "Téléphone *", en: "Phone *" })}</span>
                <input
                  className={field}
                  maxLength={25}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label-mono">Email</span>
                <input
                  className={field}
                  maxLength={120}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label-mono">{t({ fr: "Service *", en: "Service *" })}</span>
                <select
                  className={field}
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {t(c.label)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="label-mono">
                  {t({ fr: "Date souhaitée *", en: "Preferred date *" })}
                </span>
                <input
                  type="date"
                  className={field}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label-mono">{t({ fr: "Créneau", en: "Time slot" })}</span>
                <select
                  className={field}
                  value={form.slot}
                  onChange={(e) => setForm({ ...form, slot: e.target.value })}
                >
                  {SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="label-mono">
                  {t({ fr: "Adresse du chantier", en: "Site address" })}
                </span>
                <input
                  className={field}
                  maxLength={160}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="label-mono">
                  {t({ fr: "Décrivez les travaux", en: "Describe the work" })}
                </span>
                <textarea
                  rows={5}
                  maxLength={1000}
                  className={field}
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                />
              </label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className="label-mono mt-7 flex items-center gap-2 bg-accent px-6 py-3.5 text-accent-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              {t({ fr: "Envoyer la demande", en: "Send the request" })}
            </motion.button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-primary p-6 text-primary-foreground sm:p-8">
            <p className="label-mono text-accent">{t({ fr: "Comment ça marche", en: "How it works" })}</p>
            <ol className="mt-5 space-y-5 text-sm">
              {[
                {
                  fr: "Vous envoyez la demande (WhatsApp s'ouvre pré-rempli).",
                  en: "You send the request (WhatsApp opens pre-filled).",
                },
                {
                  fr: "Nous confirmons le créneau sous 48h.",
                  en: "We confirm the slot within 48h.",
                },
                { fr: "Visite et relevé sur place, gratuits.", en: "Free on-site visit and survey." },
                { fr: "Devis détaillé et planning de chantier.", en: "Detailed quote and site schedule." },
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="label-mono text-accent">0{i + 1}</span>
                  <span className="text-primary-foreground/80">{t(step)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-primary-foreground/60">
              {t({ fr: "Ou appelez directement", en: "Or call us directly" })}
            </p>
            <a href={`tel:${CONTACT.phoneRaw}`} className="display-tight mt-1 block text-2xl">
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}