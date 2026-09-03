import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { Reveal } from "@/components/site/Reveal";
import { useI18n } from "@/i18n/i18n";
import { STATS, TEAM } from "@/data/site";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "L'équipe — A.S Africa" },
      {
        name: "description",
        content:
          "Meet the A.S Africa crew: site management, methods and digital rigour, and the painting foreman behind the finishes.",
      },
      { property: "og:title", content: "The team — A.S Africa" },
      {
        property: "og:description",
        content: "The people who survey, plan and deliver your renovation.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="label-mono text-accent">{t({ fr: "Équipe", en: "Team" })}</p>
        <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
          {t({ fr: "Les mains et la méthode", en: "The hands and the method" })}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t({
            fr: "Une petite structure, volontairement. Vous parlez directement à ceux qui tiennent la brosse et le planning.",
            en: "A small outfit, on purpose. You speak directly to the people holding the brush and the schedule.",
          })}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {TEAM.map((m, i) => (
          <motion.article
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -5 }}
            className="border border-border bg-card p-7"
          >
            <div className="flex h-20 w-20 items-center justify-center bg-primary">
              <span className="display-tight text-2xl text-primary-foreground">{m.initials}</span>
            </div>
            <h2 className="display-tight mt-5 text-2xl">{m.name}</h2>
            <p className="label-mono mt-1.5 text-accent">{t(m.role)}</p>
            <p className="mt-3 text-sm text-muted-foreground">{t(m.bio)}</p>
          </motion.article>
        ))}
      </div>

      <Reveal className="mt-14">
        <div className="grid gap-px bg-border sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.value} className="bg-background p-7">
              <p className="display-tight text-4xl text-accent">{s.value}</p>
              <p className="label-mono mt-2 text-muted-foreground">{t(s.label)}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <Link
          to="/contact"
          className="label-mono inline-block bg-accent px-6 py-3.5 text-accent-foreground"
        >
          {t({ fr: "Nous écrire", en: "Get in touch" })}
        </Link>
      </Reveal>
    </div>
  );
}