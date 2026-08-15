import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";

import { useI18n, type Bi } from "@/i18n/i18n";
import { CONTACT, whatsappLink } from "@/data/site";

const NAV: { to: string; label: Bi }[] = [
  { to: "/projects", label: { fr: "Réalisations", en: "Projects" } },
  { to: "/catalog", label: { fr: "Catalogue", en: "Catalog" } },
  { to: "/equipment", label: { fr: "Équipement", en: "Equipment" } },
  { to: "/team", label: { fr: "Équipe", en: "Team" } },
  { to: "/contact", label: { fr: "Contact", en: "Contact" } },
];

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center bg-primary">
            <span className="display-tight text-sm text-primary-foreground">AS</span>
          </span>
          <span className="display-tight text-lg tracking-wide">
            A.S <span className="text-accent">Africa</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="label-mono text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "label-mono text-foreground" }}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <div className="flex items-center border border-border">
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-label={l === "fr" ? "Français" : "English"}
                className={`label-mono px-2 py-1.5 transition-colors ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Link
            to="/booking"
            className="label-mono hidden bg-accent px-4 py-2.5 text-accent-foreground transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            {t({ fr: "Devis", en: "Get a quote" })}
          </Link>
          <button
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t({ fr: "Menu", en: "Menu" })}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-card md:hidden"
          >
            <div className="flex flex-col px-5 py-3">
              {[...NAV, { to: "/booking", label: { fr: "Rendez-vous", en: "Booking" } }].map(
                (item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="label-mono border-b border-border py-3 last:border-0"
                  >
                    {t(item.label)}
                  </Link>
                ),
              )}
              <a
                href={whatsappLink("Bonjour A.S Africa,")}
                target="_blank"
                rel="noreferrer"
                className="label-mono mt-3 flex items-center gap-2 bg-accent px-4 py-3 text-accent-foreground"
              >
                <MessageCircle className="h-4 w-4" /> {CONTACT.phoneDisplay}
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}