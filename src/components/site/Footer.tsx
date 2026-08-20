import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { useI18n } from "@/i18n/i18n";
import { CONTACT, whatsappLink } from "@/data/site";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="display-tight text-2xl">
            A.S <span className="text-accent">Africa</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            {t({
              fr: "Peinture, rénovation et décoration de bâtiment. Nous redonnons vie aux bâtiments, avec méthode.",
              en: "Painting, renovation and building decoration. We bring buildings back to life, with method.",
            })}
          </p>
        </div>

        <div>
          <p className="label-mono text-accent">{t({ fr: "Navigation", en: "Navigation" })}</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/projects">{t({ fr: "Réalisations", en: "Projects" })}</Link>
            <Link to="/catalog">{t({ fr: "Catalogue", en: "Catalog" })}</Link>
            <Link to="/products">{t({ fr: "Boutique", en: "Store" })}</Link>
            <Link to="/equipment">{t({ fr: "Équipement", en: "Equipment" })}</Link>
            <Link to="/team">{t({ fr: "Équipe", en: "Team" })}</Link>
            <Link to="/booking">{t({ fr: "Rendez-vous", en: "Booking" })}</Link>
            <Link to="/order-status">{t({ fr: "Suivi de commande", en: "Order tracking" })}</Link>
          </div>
        </div>

        <div>
          <p className="label-mono text-accent">{t({ fr: "Contact", en: "Contact" })}</p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" /> {CONTACT.phoneDisplay}
            </a>
            <a
              href={whatsappLink("Bonjour A.S Africa,")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4 text-accent" /> WhatsApp
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" /> {CONTACT.email}
            </a>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" /> {t(CONTACT.city)}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <p className="label-mono mx-auto max-w-6xl px-5 py-5 text-primary-foreground/50">
          © {new Date().getFullYear()} A.S Africa —{" "}
          {t({ fr: "Tous droits réservés", en: "All rights reserved" })}
        </p>
      </div>
    </footer>
  );
}