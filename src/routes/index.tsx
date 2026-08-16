import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, MessageCircle } from "lucide-react";

import heroImg from "@/assets/hero-painter.jpg";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { useI18n } from "@/i18n/i18n";
import { CATEGORIES, PROJECTS, SERVICES, STATS, whatsappLink } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A.S Africa — Peinture, rénovation & décoration, Yaoundé" },
      {
        name: "description",
        content:
          "A.S Africa brings buildings back to life in Yaoundé: painting, renovation, structural repair and decoration, delivered with engineering rigour.",
      },
      { property: "og:title", content: "A.S Africa — We bring buildings back to life" },
      {
        property: "og:description",
        content:
          "Painting, renovation and decoration in Yaoundé. Documented method, durable finishes, quotes in 48h.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <motion.img
          src={heroImg}
          alt={t({
            fr: "Peintre A.S Africa appliquant une finition sur une façade",
            en: "A.S Africa painter applying a finish to a facade",
          })}
          width={1600}
          height={1104}
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/25" />
        <div className="relative mx-auto max-w-6xl px-5 py-28 sm:py-36">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="label-mono text-accent"
          >
            {t({
              fr: "Peinture · Rénovation · Décoration — Yaoundé",
              en: "Painting · Renovation · Decoration — Yaoundé",
            })}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="display-tight mt-5 max-w-3xl text-[clamp(2.75rem,8vw,5.5rem)]"
          >
            {t({
              fr: "Nous redonnons vie aux bâtiments.",
              en: "We bring buildings back to life.",
            })}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-6 max-w-xl text-base text-primary-foreground/80 sm:text-lg"
          >
            {t({
              fr: "A.S Africa allie le savoir-faire de l'artisan et la rigueur de l'ingénieur : diagnostic, méthode écrite, finitions durables, rapport photo à la réception.",
              en: "A.S Africa combines craftsman's skill with engineer's rigour: diagnosis, written method, durable finishes, photo report at handover.",
            })}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              to="/booking"
              className="label-mono bg-accent px-6 py-4 text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              {t({ fr: "Demander un devis", en: "Request a quote" })}
            </Link>
            <a
              href={whatsappLink("Bonjour A.S Africa, j'ai un projet de rénovation.")}
              target="_blank"
              rel="noreferrer"
              className="label-mono flex items-center gap-2 border border-primary-foreground/40 px-6 py-4 transition-colors hover:bg-primary-foreground/10"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border px-0 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-background p-7"
            >
              <p className="display-tight text-4xl text-accent">{s.value}</p>
              <p className="label-mono mt-2 text-muted-foreground">{t(s.label)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          eyebrow={t({ fr: "Nos métiers", en: "What we do" })}
          title={t({ fr: "Du gros œuvre à la finition", en: "From fabric to finish" })}
          lead={t({
            fr: "Nous réparons le bâti avant de l'habiller. C'est la seule façon d'obtenir une finition qui tient dans le temps.",
            en: "We repair the fabric before dressing it. It is the only way to get a finish that lasts.",
          })}
        />
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group bg-background p-8"
            >
              <p className="label-mono text-accent">0{i + 1}</p>
              <h3 className="display-tight mt-3 text-2xl">{t(s.title)}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{t(s.body)}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="blueprint-grid border-y border-border py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            eyebrow={t({ fr: "Réalisations", en: "Recent work" })}
            title={t({ fr: "Avant / après", en: "Before / after" })}
            lead={t({
              fr: "Glissez la poignée pour voir l'état d'origine.",
              en: "Drag the handle to reveal the original state.",
            })}
          />
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {PROJECTS.slice(0, 2).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <BeforeAfter before={p.before} after={p.after} alt={t(p.title)} />
                <p className="label-mono mt-4 text-muted-foreground">
                  {t(CATEGORIES.find((c) => c.id === p.category)!.label)} · {t(p.location)}
                </p>
                <h3 className="display-tight mt-1.5 text-2xl">{t(p.title)}</h3>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="label-mono mt-3 inline-flex items-center gap-1.5 text-accent"
                >
                  {t({ fr: "Détails du chantier", en: "Project details" })}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
            <Link
              to="/projects"
              className="label-mono inline-block border border-foreground px-6 py-3.5 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t({ fr: "Toutes les réalisations", en: "All projects" })}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              to: "/catalog" as const,
              label: { fr: "Catalogue", en: "Catalog" },
              body: {
                fr: "Peintures, enduits, sols et façades : choisissez vos finitions.",
                en: "Paints, renders, floors and facades: choose your finishes.",
              },
            },
            {
              to: "/equipment" as const,
              label: { fr: "Équipement", en: "Equipment" },
              body: {
                fr: "Notre matériel, et ce qu'il permet de tenir en délai.",
                en: "Our plant, and the schedules it lets us hold.",
              },
            },
            {
              to: "/team" as const,
              label: { fr: "Équipe", en: "Team" },
              body: {
                fr: "Les personnes qui relèvent, planifient et exécutent.",
                en: "The people who survey, plan and execute.",
              },
            },
          ].map((c, i) => (
            <Reveal key={c.to} delay={i * 0.08}>
              <Link to={c.to} className="group block border border-border bg-card p-8">
                <h3 className="display-tight text-2xl transition-colors group-hover:text-accent">
                  {t(c.label)}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{t(c.body)}</p>
                <ArrowUpRight className="mt-6 h-5 w-5 text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-4">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 bg-primary p-10 text-primary-foreground sm:flex-row sm:items-center">
            <div>
              <h2 className="display-tight text-3xl sm:text-4xl">
                {t({ fr: "Un devis sous 48 heures", en: "A quote within 48 hours" })}
              </h2>
              <p className="mt-3 max-w-md text-sm text-primary-foreground/75">
                {t({
                  fr: "Visite et relevé gratuits à Yaoundé et alentours.",
                  en: "Free site visit and survey in Yaoundé and surroundings.",
                })}
              </p>
            </div>
            <Link
              to="/booking"
              className="label-mono bg-accent px-6 py-4 text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              {t({ fr: "Prendre rendez-vous", en: "Book an appointment" })}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
