import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { getCatalog } from "@/lib/api";
import type { CatalogItem as CatalogItemType } from "@/lib/types";
import { useI18n } from "@/i18n/i18n";
import { CATALOG } from "@/data/site";

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
  const [apiItems, setApiItems] = useState<CatalogItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    getCatalog()
      .then(setApiItems)
      .catch(() => {
        /* fallback to hard-coded items */
      })
      .finally(() => setLoading(false));
  }, []);

  // Combine API items with hard-coded items
  const allItems = [...apiItems, ...CATALOG];

  // Extract unique categories from API items
  const categories = Array.from(new Set(apiItems.map((i) => i.category)))
    .filter(Boolean)
    .sort();

  // Filter items by selected category
  const items = allItems.filter(
    (i) => selectedCategory === "all" || i.category === selectedCategory || i.family === selectedCategory
  );

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
        <button
          onClick={() => setSelectedCategory("all")}
          className={`label-mono border px-3 py-2 transition-colors ${
            selectedCategory === "all"
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
        >
          {t({ fr: "Tout", en: "All" })}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`label-mono border px-3 py-2 transition-colors ${
              selectedCategory === category
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          // Render API items
          if ("description_fr" in item) {
            const apiItem = item as CatalogItemType;
            return (
              <motion.article
                layout
                key={`api-${apiItem.id}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="border border-border bg-card"
              >
                {apiItem.photo ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={apiItem.photo}
                      alt={apiItem.name_en}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-full bg-muted" />
                )}
                <div className="p-5">
                  <p className="label-mono text-muted-foreground">{apiItem.category}</p>
                  <h2 className="display-tight mt-1.5 text-xl">{t({ fr: apiItem.name_fr, en: apiItem.name_en })}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t({ fr: apiItem.description_fr, en: apiItem.description_en })}
                  </p>
                </div>
              </motion.article>
            );
          }

          // Render hard-coded items
          const hardcodedItem = item as (typeof CATALOG)[0];
          return (
            <motion.article
              layout
              key={hardcodedItem.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              className="border border-border bg-card"
            >
              <div className="h-32 w-full" style={{ backgroundColor: hardcodedItem.hex }} />
              <div className="p-5">
                <p className="label-mono text-muted-foreground">
                  {t({
                    fr: "Peintures murales",
                    en: "Wall paints",
                  })}
                </p>
                <h2 className="display-tight mt-1.5 text-xl">{t(hardcodedItem.name)}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{t(hardcodedItem.spec)}</p>
                <p className="label-mono mt-3 text-foreground/50">{hardcodedItem.hex.toUpperCase()}</p>
              </div>
            </motion.article>
          );
        })}
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