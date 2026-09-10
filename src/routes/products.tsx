import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Package, ShoppingCart } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { getProducts } from "@/lib/api";
import type { Product as ApiProduct } from "@/lib/types";
import { useI18n } from "@/i18n/i18n";
import { useCart } from "@/cart/cart";
import { formatXAF } from "@/data/products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Boutique — équipement de chantier & décoration | A.S Africa" },
      {
        name: "description",
        content:
          "Buy construction and decoration equipment from A.S Africa in Yaoundé: airless sprayers, scaffolding, trowel kits, mouldings. Pay by MTN or Orange Money.",
      },
      { property: "og:title", content: "A.S Africa store — construction & decoration equipment" },
      {
        property: "og:description",
        content: "Professional plant, tools and decoration kits, delivered in Yaoundé.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useI18n();
  const { add, count } = useCart();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)))
    .filter(Boolean)
    .sort();

  const items = products.filter((p) => selectedCategory === "all" || p.category === selectedCategory);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="label-mono text-accent">{t({ fr: "Boutique", en: "Store" })}</p>
        <h1 className="display-tight mt-3 text-5xl sm:text-6xl">
          {t({ fr: "Équipement à la vente", en: "Equipment for sale" })}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t({
            fr: "Matériel de construction et de décoration que nous utilisons nous-mêmes. Paiement Mobile Money (MTN / Orange) ou négociation directe sur WhatsApp.",
            en: "Construction and decoration equipment we use ourselves. Pay with Mobile Money (MTN / Orange) or negotiate directly on WhatsApp.",
          })}
        </p>
      </Reveal>

      <div className="mt-10 flex flex-wrap items-center gap-2">
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
        {count > 0 ? (
          <Link
            to="/cart"
            className="label-mono ml-auto flex items-center gap-2 bg-primary px-4 py-2 text-primary-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            {t({ fr: "Voir le panier", en: "View cart" })} ({count})
          </Link>
        ) : null}
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((apiProduct, i) => (
              <motion.article
                layout
                key={`api-${apiProduct.id}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="flex flex-col border border-border bg-card"
              >
                {apiProduct.photo ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={apiProduct.photo}
                      alt={apiProduct.name_en}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 items-end bg-muted p-4">
                    <Package className="h-6 w-6 text-background mix-blend-difference" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="label-mono text-muted-foreground">{apiProduct.category}</p>
                  <h2 className="display-tight mt-1.5 text-xl">
                    {t({ fr: apiProduct.name_fr, en: apiProduct.name_en })}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t({ fr: apiProduct.description_fr, en: apiProduct.description_en })}
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="display-tight text-2xl text-accent">{formatXAF(Number(apiProduct.price))}</span>
                  </div>
                  <p className="label-mono mt-1 text-foreground/50">
                    {apiProduct.stock_quantity} {t({ fr: "en stock", en: "in stock" })}
                  </p>
                  <button
                    onClick={() => {
                      add(String(apiProduct.id));
                      toast.success(t({ fr: "Ajouté au panier", en: "Added to cart" }));
                    }}
                    className="label-mono mt-5 flex items-center justify-center gap-2 bg-primary px-4 py-3 text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t({ fr: "Ajouter", en: "Add to cart" })}
                  </button>
                </div>
              </motion.article>
        ))}
      </motion.div>
    </div>
  );
}