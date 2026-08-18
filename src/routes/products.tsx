import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Package, ShoppingCart } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { useI18n } from "@/i18n/i18n";
import { useCart } from "@/cart/cart";
import { PRODUCTS, PRODUCT_FAMILIES, formatXAF, type ProductFamily } from "@/data/products";

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
  const [family, setFamily] = useState<ProductFamily | "all">("all");
  const items = PRODUCTS.filter((p) => family === "all" || p.family === family);

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
        {[{ id: "all" as const, label: { fr: "Tout", en: "All" } }, ...PRODUCT_FAMILIES].map((f) => (
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
        {items.map((p, i) => (
          <motion.article
            layout
            key={p.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="flex flex-col border border-border bg-card"
          >
            <div
              className="flex h-32 items-end p-4"
              style={{ backgroundColor: p.hex }}
              aria-hidden="true"
            >
              <Package className="h-6 w-6 text-background mix-blend-difference" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="label-mono text-muted-foreground">
                {t(PRODUCT_FAMILIES.find((f) => f.id === p.family)!.label)}
              </p>
              <h2 className="display-tight mt-1.5 text-xl">{t(p.name)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t(p.spec)}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="display-tight text-2xl text-accent">{formatXAF(p.price)}</span>
                <span className="label-mono text-muted-foreground">{t(p.unit)}</span>
              </div>
              <p className="label-mono mt-1 text-foreground/50">
                {p.stock} {t({ fr: "en stock", en: "in stock" })}
              </p>
              <button
                onClick={() => {
                  add(p.id);
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