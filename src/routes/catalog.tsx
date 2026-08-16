import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { useI18n } from "@/i18n/i18n";
import { CATALOG, CATALOG_FAMILIES, type CatalogItem } from "@/data/site";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Catalogue matériaux & finitions — A.S Africa" },
      {
        name: "description",
        content:
          "Paints, renders, floor and facade finishes you can choose for your project, with the specification behind each option.",
      },
      { property: "og:title", content: "Materials & finishes catalog — A.S Africa" },
      {
        property: "og:description",
        content: "Choose your paints, render effects, floors and facade systems.",
      },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { t } = useI18n();
  const [family, setFamily] = useState<CatalogItem["family"] | "all">("all");
  const items = CATALOG.filter((i) => family === "all" || i.family === family);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="label-mono text-accent">{t({ fr: "Catalogue", en: "Catalog" })}</p>
        <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
          {t({ fr: "Matériaux & finitions", en: "Materials & finishes" })}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t({
            fr: "Ce que vous choisissez pour votre chantier. Chaque option est chiffrée dans le devis ; nous apportons les échantillons physiques lors de la visite.",
            en: "What you choose for your job. Every option is priced in the quote; we bring physical samples to the site visit.",
          })}
        </p>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-2">
        {[{ id: "all" as const, label: { fr: "Tout", en: "All" } }, ...CATALOG_FAMILIES].map((f) => (
          <button
            key={f.id}
            onClick={() => setFamily(f.id)}
            className={`label-mono border px-3 py-2 transition-colors ${
              family === f.id
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {t(f.label)}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.article
            layout
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="border border-border bg-card"
          >
            <div className="h-32 w-full" style={{ backgroundColor: item.hex }} />
            <div className="p-5">
              <p className="label-mono text-muted-foreground">
                {t(CATALOG_FAMILIES.find((f) => f.id === item.family)!.label)}
              </p>
              <h2 className="display-tight mt-1.5 text-xl">{t(item.name)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t(item.spec)}</p>
              <p className="label-mono mt-3 text-foreground/50">{item.hex.toUpperCase()}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <Reveal className="mt-14">
        <div className="flex flex-col items-start justify-between gap-4 bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center">
          <p className="max-w-md text-sm text-primary-foreground/80">
            {t({
              fr: "Vous hésitez entre deux finitions ? Nous appliquons un échantillon sur votre mur avant de lancer le chantier.",
              en: "Torn between two finishes? We apply a sample patch on your wall before starting the job.",
            })}
          </p>
          <Link to="/booking" className="label-mono bg-accent px-5 py-3.5 text-accent-foreground">
            {t({ fr: "Demander des échantillons", en: "Request samples" })}
          </Link>
        </div>
      </Reveal>
    </div>
  );
}