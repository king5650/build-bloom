import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Clock, X } from "lucide-react";

import { useI18n } from "@/i18n/i18n";
import { formatXAF } from "@/data/products";
import { whatsappLink } from "@/data/site";
import { getOrder } from "@/lib/api";

export const Route = createFileRoute("/order/$reference")({
  loader: ({ params }) => getOrder(params.reference),
  head: ({ params }) => ({
    meta: [
      { title: `Commande ${params.reference} — A.S Africa` },
      {
        name: "description",
        content:
          "Order confirmation for your A.S Africa equipment purchase, with reference, items and payment status.",
      },
      { property: "og:title", content: `Order ${params.reference} — A.S Africa` },
      { property: "og:description", content: "Your A.S Africa order confirmation and payment status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  errorComponent: () => <OrderShell missing />,
  notFoundComponent: () => <OrderShell missing />,
  component: OrderPage,
});

function OrderShell({ missing }: { missing?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="display-tight text-4xl">
        {missing ? "Commande introuvable / Order not found" : "…"}
      </h1>
      <Link
        to="/order-status"
        className="label-mono mt-8 inline-block bg-primary px-5 py-3.5 text-primary-foreground"
      >
        Suivre une commande / Track an order
      </Link>
    </div>
  );
}

function OrderPage() {
  const { t } = useI18n();
  const result = Route.useLoaderData();

  const order = result;

  const paid = order.status === "paid";
  const failed = order.status === "cancelled";

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-14 w-14 items-center justify-center bg-accent"
      >
        {paid ? (
          <Check className="h-7 w-7 text-accent-foreground" />
        ) : failed ? (
          <X className="h-7 w-7 text-accent-foreground" />
        ) : (
          <Clock className="h-7 w-7 text-accent-foreground" />
        )}
      </motion.div>

      <p className="label-mono mt-6 text-accent">{t({ fr: "Confirmation", en: "Confirmation" })}</p>
      <h1 className="display-tight mt-2 text-5xl">
        {paid
          ? t({ fr: "Paiement reçu", en: "Payment received" })
          : failed
            ? t({ fr: "Paiement non abouti", en: "Payment not completed" })
            : t({ fr: "Paiement en attente", en: "Payment pending" })}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {paid
          ? t({
              fr: "Merci. Nous vous appelons pour organiser la livraison à Yaoundé.",
              en: "Thank you. We will call you to arrange delivery in Yaoundé.",
            })
          : t({
              fr: "Conservez cette référence : elle permet de retrouver votre commande à tout moment.",
              en: "Keep this reference: it lets you find your order at any time.",
            })}
      </p>

      <div className="mt-10 border border-border bg-card">
        <div className="flex items-baseline justify-between border-b border-border p-5">
          <span className="label-mono text-muted-foreground">
            {t({ fr: "Référence", en: "Reference" })}
          </span>
          <span className="display-tight text-2xl">{order.order_number}</span>
        </div>
        {order.items.map((line) => (
          <div key={line.product} className="flex items-center justify-between border-b border-border p-5">
            <span className="text-sm">
              {line.quantity} × {line.product_name}
            </span>
            <span className="label-mono">{formatXAF(Number(line.line_total))}</span>
          </div>
        ))}
        <div className="flex items-baseline justify-between p-5">
          <span className="label-mono text-muted-foreground">{t({ fr: "Total", en: "Total" })}</span>
          <span className="display-tight text-3xl text-accent">{formatXAF(Number(order.total))}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/products" className="label-mono bg-primary px-5 py-3.5 text-primary-foreground">
          {t({ fr: "Retour à la boutique", en: "Back to the store" })}
        </Link>
        <Link to="/order-status" className="label-mono border border-border px-5 py-3.5">
          {t({ fr: "Suivre ma commande", en: "Track my order" })}
        </Link>
        <a
          href={whatsappLink(`Bonjour A.S Africa, ma commande ${order.order_number}.`)}
          target="_blank"
          rel="noreferrer"
          className="label-mono border border-border px-5 py-3.5"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
