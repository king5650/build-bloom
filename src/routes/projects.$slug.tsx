import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { useI18n } from "@/i18n/i18n";
import { CATEGORIES, PROJECTS } from "@/data/site";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { slug: project.slug, title: project.title.en, summary: project.summary.en };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project unavailable — A.S Africa" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `${loaderData.title} — A.S Africa` },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: `${loaderData.title} — A.S Africa` },
        { property: "og:description", content: loaderData.summary },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { t } = useI18n();
  const project = PROJECTS.find((p) => p.slug === slug)!;
  const category = CATEGORIES.find((c) => c.id === project.category)!;

  const facts = [
    { label: { fr: "Type", en: "Type" }, value: t(category.label) },
    { label: { fr: "Lieu", en: "Location" }, value: t(project.location) },
    { label: { fr: "Durée", en: "Duration" }, value: t(project.duration) },
    { label: { fr: "Surface", en: "Surface" }, value: project.surface },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <Link to="/projects" className="label-mono text-muted-foreground hover:text-foreground">
        ← {t({ fr: "Toutes les réalisations", en: "All projects" })}
      </Link>

      <Reveal className="mt-6">
        <p className="label-mono text-accent">
          {t(category.label)} · {project.year}
        </p>
        <h1 className="display-tight mt-3 text-4xl sm:text-6xl">{t(project.title)}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{t(project.summary)}</p>
      </Reveal>

      <Reveal className="mt-10">
        <BeforeAfter before={project.before} after={project.after} alt={t(project.title)} />
      </Reveal>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <h2 className="display-tight rule-accent text-2xl">
            {t({ fr: "Le chantier", en: "The job" })}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t(project.description)}</p>

          <h3 className="display-tight mt-8 text-xl">
            {t({ fr: "Prestations réalisées", en: "Scope of work" })}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {project.scope.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="label-mono text-accent">0{i + 1}</span>
                {t(s)}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="border border-border bg-card">
            {facts.map((f) => (
              <div
                key={f.value}
                className="flex items-center justify-between border-b border-border px-5 py-4 last:border-0"
              >
                <dt className="label-mono text-muted-foreground">{t(f.label)}</dt>
                <dd className="text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
          <Link
            to="/booking"
            className="label-mono mt-4 block bg-accent px-5 py-3.5 text-center text-accent-foreground"
          >
            {t({ fr: "Un chantier similaire ?", en: "Need something similar?" })}
          </Link>
        </Reveal>
      </div>
    </div>
  );
}