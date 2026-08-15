import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { useI18n } from "@/i18n/i18n";
import { CATEGORIES, PROJECTS, type Category } from "@/data/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Réalisations — A.S Africa | Avant / après" },
      {
        name: "description",
        content:
          "Before and after our painting, renovation and structural repair projects in Yaoundé. Filter by type of work.",
      },
      { property: "og:title", content: "Projects — A.S Africa" },
      {
        property: "og:description",
        content: "Before/after galleries of renovation and painting work delivered in Yaoundé.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Category | "all">("all");
  const list = PROJECTS.filter((p) => filter === "all" || p.category === filter);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="label-mono text-accent">{t({ fr: "Réalisations", en: "Projects" })}</p>
        <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
          {t({ fr: "Avant / après", en: "Before / after" })}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t({
            fr: "Faites glisser chaque image pour voir l'état d'origine. Chaque chantier est documenté : relevé, méthode, durée.",
            en: "Drag each image to reveal the original state. Every job is documented: survey, method, duration.",
          })}
        </p>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-2">
        {[{ id: "all" as const, label: { fr: "Tout", en: "All" } }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`label-mono border px-3 py-2 transition-colors ${
              filter === c.id
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {t(c.label)}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.article
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <BeforeAfter before={p.before} after={p.after} alt={t(p.title)} />
              <div className="mt-5">
                <p className="label-mono text-muted-foreground">
                  {t(CATEGORIES.find((c) => c.id === p.category)!.label)} · {t(p.location)} · {p.year}
                </p>
                <h2 className="display-tight mt-2 text-2xl">{t(p.title)}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{t(p.summary)}</p>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="label-mono mt-4 inline-flex items-center gap-1.5 text-accent"
                >
                  {t({ fr: "Voir le chantier", en: "View the project" })}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}