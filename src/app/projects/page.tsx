import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Eyebrow } from "@/components/site/eyebrow";
import {
  HeroIn,
  Stagger,
  StaggerItem,
} from "@/components/site/motion-primitives";
import { getPublishedProjects, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects - Abreco Energies",
  description:
    "A gallery of our heat pump, air conditioning, and solar installations across Australia.",
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getPublishedProjects(),
    getSettings(),
  ]);

  return (
    <main className="site-font bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {settings.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="hero-fallback h-full w-full animate-brand-drift" />
          )}
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-40 text-center">
          <HeroIn>
            <Eyebrow tone="onMedia">Our Projects</Eyebrow>
          </HeroIn>
          <HeroIn delay={0.1}>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Installations we&apos;re proud of
            </h1>
          </HeroIn>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          {projects.length === 0 ? (
            <p className="text-center text-foreground/50">
              Projects coming soon.
            </p>
          ) : (
            <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {projects.map((p) => (
                <StaggerItem
                  key={p._id}
                  className={p.order % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : ""}
                >
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card">
                    <div
                      className={
                        p.order % 5 === 0
                          ? "aspect-square sm:aspect-auto sm:h-full"
                          : "aspect-square"
                      }
                    >
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.title || "Project"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="hero-fallback flex h-full w-full animate-brand-drift items-center justify-center text-4xl">
                          ☀️
                        </div>
                      )}
                    </div>
                    {(p.title || p.category) && (
                      <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-black/65 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {p.category && (
                          <div className="text-xs font-medium uppercase tracking-wider text-brand">
                            {p.category}
                          </div>
                        )}
                        {p.title && (
                          <div className="mt-0.5 font-semibold text-white">
                            {p.title}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
