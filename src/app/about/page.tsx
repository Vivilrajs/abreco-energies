import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Leaf, Users, Award, Target } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Eyebrow } from "@/components/site/eyebrow";
import {
  HeroIn,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/site/motion-primitives";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Abreco Energies",
  description:
    "Abreco Energies is a leading supplier and installer of energy-efficient heat pumps, air conditioning, and solar solutions across Australia.",
};

const VALUES = [
  {
    icon: Target,
    title: "Our mission",
    body: "Make clean, efficient energy simple and affordable for every Australian home and business.",
  },
  {
    icon: Award,
    title: "Accredited quality",
    body: "Licensed, insured installers and trusted, high-efficiency brands on every job.",
  },
  {
    icon: Leaf,
    title: "Sustainability first",
    body: "Every install cuts running costs and carbon — good for your wallet and the planet.",
  },
  {
    icon: Users,
    title: "People-led service",
    body: "Fast, honest consultations and long-term support well after installation day.",
  },
];

export default async function AboutPage() {
  const settings = await getSettings();

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
            <Eyebrow tone="onMedia">About us</Eyebrow>
          </HeroIn>
          <HeroIn delay={0.1}>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Powering Australia&apos;s shift to clean energy
            </h1>
          </HeroIn>
        </div>
      </section>

      {/* Story split */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-foreground/10">
              {settings.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.imageUrl}
                  alt="Abreco Energies"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="hero-fallback h-full w-full animate-brand-drift" />
              )}
            </div>
            <div className="absolute -bottom-6 left-6 flex items-center gap-4 rounded-2xl border border-foreground/10 bg-card px-6 py-4 shadow-xl">
              <div className="text-5xl font-semibold text-brand">14</div>
              <div className="text-sm font-medium leading-tight text-foreground/70">
                Years of
                <br />
                Experience
              </div>
            </div>
          </Reveal>

          <Reveal>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              A partner you can trust
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/60">
              Abreco Energies is a leading supplier and installer of
              energy-efficient heat pumps, air conditioners, and solar systems.
              Wherever you are in Australia, we help you save energy and reduce
              costs — handling the rebates and installation from start to finish.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["10k+", "Installs"],
                ["99%", "Satisfaction"],
                ["100%", "Accredited"],
              ].map(([v, l], i) => (
                <div
                  key={l}
                  className="rounded-2xl border border-foreground/10 bg-foreground/5 px-4 py-5 text-center"
                >
                  <div
                    className={`text-3xl font-semibold ${i === 1 ? "text-brand" : "text-foreground"}`}
                  >
                    {v}
                  </div>
                  <div className="mt-1 text-xs text-foreground/50">{l}</div>
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-strong"
            >
              Get in touch <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>What drives us</Eyebrow>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Our values
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue">
                    <v.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/55">
                    {v.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
