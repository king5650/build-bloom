import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Wrench } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { useI18n } from "@/i18n/i18n";
import { EQUIPMENT } from "@/data/site";

export const Route = createFileRoute("/equipment")({
  head: () => ({
    meta: [
      { title: "Équipement & outillage — A.S Africa" },
      {
        name: "description",
        content:
          "Airless rigs, scaffolding, extraction sanders, render pumps and measuring gear owned and operated by our own crew.",
      },
      { property: "og:title", content: "Equipment & tools — A.S Africa" },
      {
        property: "og:description",
        content: "The plant and tools we own, and what they let us deliver on site.",
      },
    ],
  }),
  component: EquipmentPage,
});

function EquipmentPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="label-mono text-accent">{t({ fr: "Équipement", en: "Equipment" })}</p>
        <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
          {t({ fr: "Notre outillage", en: "Our plant & tools" })}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t({
            fr: "Nous possédons notre matériel : pas de location de dernière minute, pas de chantier à l'arrêt. C'est ce qui tient les délais.",
            en: "We own our equipment: no last-minute hire, no stalled site. That is what keeps schedules.",
          })}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {EQUIPMENT.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ backgroundColor: "var(--card)" }}
            className="bg-background p-7"
          >
            <Wrench className="h-5 w-5 text-accent" />
            <h2 className="display-tight mt-4 text-xl">{t(e.name)}</h2>
            <p className="label-mono mt-2 text-slate-brand">{t(e.spec)}</p>
            <p className="mt-3 text-sm text-muted-foreground">{t(e.detail)}</p>
          </motion.div>
        ))}
      </div>

      <Reveal className="mt-14">
        <div className="blueprint-grid border border-border p-8">
          <h2 className="display-tight rule-accent text-2xl">
            {t({ fr: "Sécurité & propreté de chantier", en: "Site safety & cleanliness" })}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {t({
              fr: "EPI complets pour chaque compagnon, protection systématique des sols et mobiliers, évacuation des déchets en fin de chantier, rapport photo à la réception.",
              en: "Full PPE for every craftsman, systematic protection of floors and furniture, waste removal at completion, photo report at handover.",
            })}
          </p>
          <Link
            to="/booking"
            className="label-mono mt-6 inline-block bg-primary px-5 py-3.5 text-primary-foreground"
          >
            {t({ fr: "Planifier une visite", en: "Schedule a visit" })}
          </Link>
        </div>
      </Reveal>
    </div>
  );
}