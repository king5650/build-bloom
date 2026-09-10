import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, Trash2, MessageCircle, Smartphone, Loader2 } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { useI18n } from "@/i18n/i18n";
import { useCart } from "@/cart/cart";
import { formatXAF } from "@/data/products";
import { whatsappLink } from "@/data/site";
import { createOrder, getOrderPaymentStatus, initiateOrderPayment } from "@/lib/api";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Panier & paiement Mobile Money — A.S Africa" },
      {
        name: "description",
        content:
          "Review your A.S Africa equipment order and pay with MTN or Orange Mobile Money, or send the order to us on WhatsApp to negotiate.",
      },
      { property: "og:title", content: "Cart & Mobile Money checkout — A.S Africa" },
      {
        property: "og:description",
        content: "Pay your equipment order with MTN or Orange Money, or negotiate on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

type Phase = "idle" | "pending" | "failed";

function CartPage() {
  const { t } = useI18n();
  const { detailed, total, count, setQty, remove, clear } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [ussd, setUssd] = useState<string | null>(null);
  const [whatsappPending, setWhatsappPending] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  async function negotiateOnWhatsApp() {
    const cleaned = phone.replace(/[\s+]/g, "");
    if (!name.trim() || !/^(237)?6\d{8}$/.test(cleaned)) {
      toast.error(
        t({
          fr: "Entrez votre nom et un numéro valide avant de continuer.",
          en: "Enter your name and a valid phone number before continuing.",
        }),
      );
      return;
    }

    setWhatsappPending(true);
  const whatsappWindow = window.open("about:blank", "_blank");
    try {
      const order = await createOrder({
        guest_name: name.trim(),
        guest_phone: cleaned.startsWith("237") ? cleaned : `237${cleaned}`,
        channel: "mobile_money",
        items: detailed.map((l) => ({ product_id: l.product.id, quantity: l.qty })),
      });
      const message = [
        "Bonjour A.S Africa, je souhaite confirmer cette commande via WhatsApp :",
        `Commande : ${order.order_number}`,
        "",
        ...detailed.map(
          (l) => `- ${l.qty} x ${l.product.name_fr} (${formatXAF(l.lineTotal)})`,
        ),
        `Total : ${formatXAF(Number(order.total))}`,
        "",
        "Merci de confirmer le prix final et la livraison.",
      ].join("\n");
      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappLink(message);
      } else {
        window.location.href = whatsappLink(message);
      }
    } catch {
      whatsappWindow?.close();
      toast.error(
        t({
          fr: "La commande n'a pas pu etre enregistree. Reessayez.",
          en: "The order could not be recorded. Please try again.",
        }),
      );
    } finally {
      setWhatsappPending(false);
    }
  }

  async function pay() {
    const cleaned = phone.replace(/[\s+]/g, "");
    if (!name.trim() || !/^(237)?6\d{8}$/.test(cleaned)) {
      toast.error(
        t({ fr: "Numéro Mobile Money invalide (6XXXXXXXX)", en: "Invalid Mobile Money number (6XXXXXXXX)" }),
      );
      return;
    }
    setPhase("pending");
    setUssd(null);
    try {
      const order = await createOrder({
        guest_name: name.trim(),
        guest_phone: cleaned.startsWith("237") ? cleaned : `237${cleaned}`,
        channel: "whatsapp",
        items: detailed.map((l) => ({ product_id: l.product.id, quantity: l.qty })),
      });
      const payment = await initiateOrderPayment(order.order_number);
      setUssd(payment.ussd_code);
      toast.info(
        t({ fr: "Validez la demande sur votre téléphone.", en: "Approve the request on your phone." }),
      );

      let elapsed = 0;
      timer.current = setInterval(async () => {
        elapsed += 5;
        const current = await getOrderPaymentStatus(order.order_number);
        if (current.status === "paid") {
          if (timer.current) clearInterval(timer.current);
          clear();
          void navigate({ to: "/order/$reference", params: { reference: order.order_number } });
          return;
        }
        if (current.status === "cancelled" || elapsed >= 180) {
          if (timer.current) clearInterval(timer.current);
          setPhase("failed");
        }
      }, 5000);
    } catch {
      setPhase("failed");
      toast.error(
        t({
          fr: "Le paiement n'a pas pu être lancé. Essayez WhatsApp.",
          en: "The payment could not be started. Try WhatsApp.",
        }),
      );
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal className="max-w-2xl">
        <p className="label-mono text-accent">{t({ fr: "Panier", en: "Cart" })}</p>
        <h1 className="display-tight mt-3 text-5xl">
          {t({ fr: "Votre commande", en: "Your order" })}
        </h1>
      </Reveal>

      {count === 0 ? (
        <div className="mt-12 border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">
            {t({ fr: "Votre panier est vide.", en: "Your cart is empty." })}
          </p>
          <Link to="/products" className="label-mono mt-6 inline-block bg-accent px-5 py-3.5 text-accent-foreground">
            {t({ fr: "Voir la boutique", en: "Browse the store" })}
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="border border-border">
            <AnimatePresence initial={false}>
              {detailed.map((l) => (
                <motion.div
                  key={l.product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-4 border-b border-border p-4 last:border-0"
                >
                  {l.product.photo ? (
                    <img src={l.product.photo} alt="" className="h-14 w-14 shrink-0 object-cover" />
                  ) : (
                    <div className="h-14 w-14 shrink-0 bg-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="display-tight text-lg">{t({ fr: l.product.name_fr, en: l.product.name_en })}</p>
                    <p className="label-mono text-muted-foreground">
                      {formatXAF(Number(l.product.price))}
                    </p>
                  </div>
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQty(String(l.product.id), l.qty - 1)}
                      aria-label={t({ fr: "Retirer un", en: "Decrease" })}
                      className="px-2 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="label-mono w-8 text-center">{l.qty}</span>
                    <button
                      onClick={() => setQty(String(l.product.id), l.qty + 1)}
                      aria-label={t({ fr: "Ajouter un", en: "Increase" })}
                      className="px-2 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="display-tight w-28 shrink-0 text-right text-lg">
                    {formatXAF(l.lineTotal)}
                  </p>
                  <button
                    onClick={() => remove(String(l.product.id))}
                    aria-label={t({ fr: "Supprimer", en: "Remove" })}
                    className="text-muted-foreground hover:text-accent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="h-fit border border-border bg-card p-6">
            <div className="flex items-baseline justify-between">
              <span className="label-mono text-muted-foreground">
                {t({ fr: "Total", en: "Total" })}
              </span>
              <span className="display-tight text-3xl text-accent">{formatXAF(total)}</span>
            </div>
            <p className="label-mono mt-1 text-foreground/50">
              {t({ fr: "Livraison Yaoundé à convenir", en: "Yaoundé delivery to be agreed" })}
            </p>

            <div className="mt-6 border-t border-border pt-6">
              <p className="label-mono flex items-center gap-2 text-foreground">
                <Smartphone className="h-4 w-4 text-accent" />
                {t({ fr: "Payer par Mobile Money", en: "Pay with Mobile Money" })}
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t({ fr: "Votre nom", en: "Your name" })}
                disabled={phase === "pending"}
                className="mt-3 w-full border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent disabled:opacity-60"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="6XX XXX XXX"
                disabled={phase === "pending"}
                className="mt-3 w-full border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent disabled:opacity-60"
              />
              <button
                onClick={pay}
                disabled={phase === "pending"}
                className="label-mono mt-3 flex w-full items-center justify-center gap-2 bg-accent px-4 py-3.5 text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
              >
                {phase === "pending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t({ fr: "En attente de validation…", en: "Waiting for approval…" })}
                  </>
                ) : (
                  t({ fr: `Payer ${formatXAF(total)}`, en: `Pay ${formatXAF(total)}` })
                )}
              </button>
              {ussd ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t({ fr: "Si rien n'arrive, composez", en: "If nothing arrives, dial" })}{" "}
                  <span className="label-mono text-foreground">{ussd}</span>
                </p>
              ) : null}
              {phase === "failed" ? (
                <p className="mt-3 text-sm text-accent">
                  {t({
                    fr: "Paiement non confirmé. Réessayez ou passez par WhatsApp.",
                    en: "Payment not confirmed. Try again or use WhatsApp.",
                  })}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-muted-foreground">
                {t({
                  fr: "MTN MoMo et Orange Money, en francs CFA.",
                  en: "MTN MoMo and Orange Money, in CFA francs.",
                })}
              </p>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <button
                onClick={negotiateOnWhatsApp}
                disabled={whatsappPending}
                className="label-mono flex w-full items-center justify-center gap-2 bg-primary px-4 py-3.5 text-primary-foreground disabled:opacity-70"
              >
                <MessageCircle className="h-4 w-4" />
                {whatsappPending
                  ? t({ fr: "Enregistrement…", en: "Recording…" })
                  : t({ fr: "Négocier sur WhatsApp", en: "Negotiate on WhatsApp" })}
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                {t({
                  fr: "Nous recevons votre liste et confirmons prix et livraison.",
                  en: "We receive your list and confirm price and delivery.",
                })}
              </p>
            </div>

            <button
              onClick={clear}
              className="label-mono mt-6 text-muted-foreground hover:text-accent"
            >
              {t({ fr: "Vider le panier", en: "Clear cart" })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}