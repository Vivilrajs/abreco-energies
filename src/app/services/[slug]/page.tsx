import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal, HeroIn } from "@/components/site/motion-primitives";
import { getServiceBySlug, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Not found - Abreco Energies" };
  return {
    title: `${service.title} - Abreco Energies`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug),
    getSettings(),
  ]);

  if (!service) notFound();

  return (
    <main className="site-font bg-background">
      <SiteHeader />

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {service.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.image}
              alt={service.title}
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
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-40">
          <HeroIn>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              <ArrowLeft size={16} /> All services
            </Link>
          </HeroIn>
          {service.eyebrow && (
            <HeroIn delay={0.08}>
              <span className="mt-6 block text-sm font-semibold uppercase tracking-widest text-brand">
                {service.eyebrow}
              </span>
            </HeroIn>
          )}
          <HeroIn delay={0.16}>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              {service.title}
            </h1>
          </HeroIn>
          <HeroIn delay={0.26}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              {service.description}
            </p>
          </HeroIn>
        </div>
      </section>

      {service.body && (
        <section className="py-20">
          <Reveal className="mx-auto max-w-3xl px-6">
            {service.body.split("\n").filter(Boolean).map((para, i) => (
              <p
                key={i}
                className="mb-5 text-lg leading-relaxed text-foreground/70"
              >
                {para}
              </p>
            ))}
          </Reveal>
        </section>
      )}

      <section className="border-y border-border bg-brand/10 py-16">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-balance text-3xl font-semibold text-foreground">
            Ready to get started with {service.title}?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-4 font-semibold text-white shadow-lg shadow-brand-red/25 transition hover:bg-brand-red-strong hover:scale-[1.03] active:scale-95"
          >
            Book your free consultation <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
