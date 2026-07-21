import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/motion-primitives";
import { getProjectBySlug, getPublishedProjects, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found - Abreco Energies" };
  return {
    title: `${project.title} - Abreco Energies`,
    description: project.description || `View the ${project.title} installation by Abreco Energies.`,
  };
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSettings(),
  ]);

  if (!project) notFound();

  return (
    <main className="site-font bg-background">
      <SiteHeader />

      {/* Hero image — full-bleed with overlay */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          ) : settings.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="hero-fallback h-full w-full animate-brand-drift" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-16 pt-40 sm:pb-24">
          {/* Back link */}
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
            >
              <ArrowLeft size={15} /> Back to Projects
            </Link>
          </Reveal>

          {/* Category badge */}
          {project.category && (
            <Reveal delay={0.05}>
              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur-sm">
                <Tag size={11} />
                {project.category}
              </span>
            </Reveal>
          )}

          {/* Title */}
          <Reveal delay={0.1}>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Content — description + full image */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">

          {/* Description */}
          {project.description && (
            <Reveal>
              <div className="prose prose-lg prose-foreground max-w-none text-foreground/70">
                <p className="text-lg leading-relaxed">{project.description}</p>
              </div>
            </Reveal>
          )}

          {/* Full project image */}
          {project.image && (
            <Reveal delay={0.1} className="mt-12">
              <div className="overflow-hidden rounded-3xl border border-border shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>
          )}

          {/* CTA */}
          <Reveal delay={0.15} className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="text-foreground/60">
              Interested in a similar installation for your home or business?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-strong hover:scale-[1.03] active:scale-95"
            >
              Book a free consultation
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
