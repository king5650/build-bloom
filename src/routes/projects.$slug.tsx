import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { useI18n } from "@/i18n/i18n";
import { CATEGORIES, PROJECTS } from "@/data/site";
import { getProject } from "@/lib/api";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const localProject = PROJECTS.find((p) => p.slug === params.slug);
    if (localProject) {
      return { source: "local" as const, project: localProject };
    }

    try {
      const project = await getProject(params.slug);
      return { source: "api" as const, project };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project unavailable — A.S Africa" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        {
          title: `${loaderData.source === "local" ? loaderData.project.title.en : loaderData.project.title_en} — A.S Africa`,
        },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const { t } = useI18n();
  if (loaderData.source === "local") {
    return <LocalProjectDetail project={loaderData.project} />;
  }

  const project = loaderData.project;
  const title = { fr: project.title_fr, en: project.title_en };
  const category = CATEGORIES.find((c) => c.id === project.category);
  const before = project.images.find((image) => image.is_before_after)?.image;
  const after = project.images.filter((image) => image.is_before_after)[1]?.image;

  const facts = [
    { label: { fr: "Type", en: "Type" }, value: category ? t(category.label) : project.category },
    { label: { fr: "Lieu", en: "Location" }, value: project.location },
    { label: { fr: "Date", en: "Date" }, value: project.completed_date ?? "-" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <Link to="/projects" className="label-mono text-muted-foreground hover:text-foreground">
        ← {t({ fr: "Toutes les réalisations", en: "All projects" })}
      </Link>

      <Reveal className="mt-6">
        <p className="label-mono text-accent">
          {project.category} · {project.completed_date ?? ""}
        </p>
        <h1 className="display-tight mt-3 text-4xl sm:text-6xl">{t(title)}</h1>
      </Reveal>

      {before && after && (
        <Reveal className="mt-10">
          <BeforeAfter before={before} after={after} alt={t(title)} />
        </Reveal>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <h2 className="display-tight rule-accent text-2xl">
            {t({ fr: "Le chantier", en: "The job" })}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {t({ fr: project.description_fr, en: project.description_en })}
          </p>
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

function LocalProjectDetail({ project }: { project: (typeof PROJECTS)[number] }) {
  const { t } = useI18n();
  const category = CATEGORIES.find((c) => c.id === project.category)!;
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <Link to="/projects" className="label-mono text-muted-foreground hover:text-foreground">
        ← {t({ fr: "Toutes les réalisations", en: "All projects" })}
      </Link>
      <Reveal className="mt-6">
        <p className="label-mono text-accent">{t(category.label)} · {project.year}</p>
        <h1 className="display-tight mt-3 text-4xl sm:text-6xl">{t(project.title)}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{t(project.summary)}</p>
      </Reveal>
      <Reveal className="mt-10">
        <BeforeAfter before={project.before} after={project.after} alt={t(project.title)} />
      </Reveal>
    </div>
  );
}