import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { useI18n } from "@/i18n/i18n";
import { getProjects } from "@/lib/api";
import type { ProjectListItem } from "@/lib/types";

// CATEGORIES stays as static config (it's UI copy, not content that changes) —
// only PROJECTS moves from data/site.ts to the live API.
import { CATEGORIES, type Category } from "@/data/site";

export const Route = createFileRoute("/projects/index_cld")({
  // loader runs on the server during SSR (and again on client navigation) —
  // this is TanStack Start's equivalent of what we'd do with a Server
  // Component's fetch() in Next.js. Data is ready before the component renders.
  loader: async () => {
    const projects = await getProjects();
    return { projects };
  },
  head: () => ({
    meta: [
      { title: "Réalisations — A.S Africa | Avant / après" },
      {
        name: "description",
        content:
          "Before and after our painting, renovation and structural repair projects in Yaoundé. Filter by type of work.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { t } = useI18n();
  const { projects } = Route.useLoaderData();
  const [filter, setFilter] = useState<Category | "all">("all");

  const list = projects.filter((p: ProjectListItem) => filter === "all" || p.category === filter);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="label-mono text-accent">{t({ fr: "Réalisations", en: "Projects" })}</p>
        <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
          {t({ fr: "Avant / après", en: "Before / after" })}
        </h1>
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
          {list.map((p: ProjectListItem) => (
            <motion.article
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {/* cover_image comes straight from Django/Cloudinary now, not a static import */}
              <img src={p.cover_image ?? ""} alt={t({ fr: p.title_fr, en: p.title_en })} className="w-full" />
              <div className="mt-5">
                <p className="label-mono text-muted-foreground">
                  {t(CATEGORIES.find((c) => c.id === p.category)?.label ?? { fr: p.category, en: p.category })} ·{" "}
                  {p.location}
                </p>
                {/* the API returns _fr / _en pairs directly — t() takes them as-is */}
                <h2 className="display-tight mt-2 text-2xl">{t({ fr: p.title_fr, en: p.title_en })}</h2>
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
