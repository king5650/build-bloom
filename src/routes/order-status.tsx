import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { useI18n } from "@/i18n/i18n";
import { formatXAF } from "@/data/products";
import { lookupOrder } from "@/lib/checkout.functions";

export const Route = createFileRoute("/order-status")({
  head: () => ({
    meta: [
      { title: "Suivi de commande — A.S Africa" },
      {
        name: "description",
        content:
          "Track an A.S Africa equipment order with your order reference and the phone number used at checkout.",
      },
      { property: "og:title", content: "Track your order — A.S Africa" },
      {
        property: "og:description",
        content: "Enter your order reference and phone number to see your payment status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderStatusPage,
});

type Order = { reference: string; status: string; total: number; createdAt: string; lines: { id: string; qty: number; name: string; price: number }[] };

function OrderStatusPage() {
  const { t } = useI18n();
  const lookup = useServerFn(lookupOrder);

  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleanedPhone = phone.replace(/[\s+]/g, "");
    if (!/^(237)?6\d{8}$/.test(cleanedPhone) || reference.trim().length < 4) {
      setError(
        t({
          fr: "Vérifiez la référence et le numéro (6XXXXXXXX).",
          en: "Check the reference and the phone number (6XXXXXXXX).",
        }),
      );
      return;
    }
    setLoading(true);
    setError(null);
    setOrder(null);
    const res = await lookup({ data: { reference: reference.trim(), phone: cleanedPhone } });
    setLoading(false);
    if (!res.ok) {
      setError(
        t({
          fr: "Aucune commande ne correspond à ces informations.",
          en: "No order matches these details.",
        }),
      );
      return;
    }
    setOrder(res.order);
  }

  const label = (status: string) =>
    status === "PAID"
      ? t({ fr: "Payée", en: "Paid" })
      : status === "FAILED" || status === "CANCELLED"
        ? t({ fr: "Échouée", en: "Failed" })
        : t({ fr: "En attente", en: "Pending" });

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Reveal>
        <p className="label-mono text-accent">{t({ fr: "Suivi", en: "Tracking" })}</p>
        <h1 className="display-tight mt-3 text-5xl">
          {t({ fr: "Suivre ma commande", en: "Track my order" })}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t({
            fr: "Entrez votre référence (ex. AS-2026-0001) et le numéro utilisé au paiement.",
            en: "Enter your reference (e.g. AS-2026-0001) and the phone number used at checkout.",
          })}
        </p>
      </Reveal>

      <form onSubmit={submit} className="mt-10 grid gap-4 border border-border bg-card p-6 sm:grid-cols-2">
        <div>
          <label htmlFor="reference" className="label-mono text-muted-foreground">
            {t({ fr: "Référence", en: "Reference" })}
          </label>
          <input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="AS-2026-0001"
            className="mt-2 w-full border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="phone" className="label-mono text-muted-foreground">
            {t({ fr: "Téléphone", en: "Phone" })}
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="6XX XXX XXX"
            className="mt-2 w-full border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="label-mono flex items-center justify-center gap-2 bg-accent px-5 py-3.5 text-accent-foreground disabled:opacity-70 sm:col-span-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {t({ fr: "Rechercher", en: "Search" })}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

      {order ? (
        <div className="mt-10 border border-border bg-card">
          <div className="flex items-baseline justify-between border-b border-border p-5">
            <span className="display-tight text-2xl">{order.reference}</span>
            <span className="label-mono text-accent">{label(order.status)}</span>
          </div>
          {order.lines.map((line) => (
            <div key={line.id} className="flex items-center justify-between border-b border-border p-5">
              <span className="text-sm">
                {line.qty} × {line.name}
              </span>
              <span className="label-mono">{formatXAF(line.price * line.qty)}</span>
            </div>
          ))}
          <div className="flex items-baseline justify-between p-5">
            <span className="label-mono text-muted-foreground">{t({ fr: "Total", en: "Total" })}</span>
            <span className="display-tight text-3xl text-accent">{formatXAF(order.total)}</span>
          </div>
          <div className="border-t border-border p-5">
            <Link
              to="/order/$reference"
              params={{ reference: order.reference }}
              className="label-mono text-accent"
            >
              {t({ fr: "Voir la confirmation", en: "View confirmation" })}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
