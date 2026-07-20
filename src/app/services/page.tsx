import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Eyebrow } from "@/components/site/eyebrow";
import {
  Reveal,
  Stagger,
  StaggerItem,
  HeroIn,
} from "@/components/site/motion-primitives";
import { getPublishedServices, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services — Abreco Energies",
  description:
    "Personalized solar, heat pump, air conditioning, and battery solutions for renewable energy.",
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getPublishedServices(),
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
            <Eyebrow tone="onMedia">Our Services</Eyebrow>
          </HeroIn>
          <HeroIn delay={0.1}>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Personalized solutions for renewable energy
            </h1>
          </HeroIn>
          <HeroIn delay={0.22}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
              From solar and batteries to heat pumps and cooling, we deliver
              clean-energy systems tailored to your home or business — rebates
              and installation handled.
            </p>
          </HeroIn>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s._id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.image}
                        alt={s.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="hero-fallback flex h-full w-full items-center justify-center text-5xl">
                        ☀️
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    {s.eyebrow && (
                      <span className="text-xs font-semibold uppercase tracking-widest text-brand">
                        {s.eyebrow}
                      </span>
                    )}
                    <h3 className="mt-2 text-xl font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/60">
                      {s.description}
                    </p>
                    <Link
                      href={`/services/${s.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition group-hover:gap-3"
                    >
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-y border-border bg-brand/10 py-16">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-balance text-3xl font-semibold text-foreground">
            Not sure which solution fits?
          </h2>
          <p className="text-foreground/60">
            Book a free consultation — we&apos;ll assess your needs and handle
            the rebates.
          </p>
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
