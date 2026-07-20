import type { Metadata } from "next";
import { Check, Package, Truck, FileCheck, Users } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { LeadForm } from "@/components/site/lead-form";
import { getSettings } from "@/lib/data";
import {
  Reveal,
  Stagger,
  StaggerItem,
  HeroIn,
  HoverLift,
} from "@/components/site/motion-primitives";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wholesale Supply — Abreco Energies",
  description:
    "Wholesale supply of heat pumps, air conditioners, solar, and batteries for accredited providers and installers.",
};

const PRODUCTS = [
  "Heat Pump Hot Water Systems",
  "Reverse Cycle Air Conditioners",
  "LED Lighting Solutions",
  "Solar PV Systems & Inverters",
  "Smart Energy Controls",
  "Weather Sealing & Insulation Products",
];

const REASONS = [
  {
    icon: Package,
    title: "Competitive wholesale pricing",
    body: "Bulk-order pricing for accredited providers and installers.",
  },
  {
    icon: Truck,
    title: "Reliable stock & fast delivery",
    body: "Dependable stock availability with fast delivery across Australia.",
  },
  {
    icon: FileCheck,
    title: "Rebate-compliant products",
    body: "Government rebate-compliant products with full documentation support.",
  },
  {
    icon: Users,
    title: "Dedicated partner support",
    body: "A support team to help with project needs and rebates.",
  },
];

export default async function SupplyPage() {
  const settings = await getSettings();

  return (
    <main className="site-font bg-background">
      <SiteHeader />

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
            <span className="text-sm font-medium uppercase tracking-widest text-brand">
              Wholesale supply
            </span>
          </HeroIn>
          <HeroIn delay={0.1}>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Supply for accredited providers &amp; installers
            </h1>
          </HeroIn>
          <HeroIn delay={0.22}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
              We supply a wide range of high-quality products to companies,
              Accredited Providers, and installers across Australia — making
              energy efficiency accessible, affordable, and hassle-free.
            </p>
          </HeroIn>
        </div>
      </section>

      {/* What we supply */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="text-3xl font-semibold text-foreground">
              What we supply
            </h2>
            <p className="mt-2 text-foreground/50">
              VEU-approved and high-efficiency products, including:
            </p>
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <StaggerItem key={p}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5 text-foreground/80">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                    <Check size={16} />
                  </span>
                  {p}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why partner */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="text-3xl font-semibold text-foreground">
              Why partner with us
            </h2>
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map((r) => (
              <StaggerItem key={r.title}>
                <HoverLift className="h-full rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <r.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/55">{r.body}</p>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Trade account form */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="text-balance text-3xl font-semibold text-foreground sm:text-4xl">
              Partner with us
            </h2>
            <p className="mt-4 max-w-md text-foreground/60">
              If you&apos;re an installer, supplier, or Accredited Provider
              looking for reliable access to premium energy-saving products,
              Abreco Energies is your trusted supply partner. Open a trade
              account or request a product list.
            </p>
          </Reveal>
          {/* Dark spotlight card — LeadForm is styled for dark surfaces. */}
          <Reveal delay={0.12} className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-2xl sm:p-8">
            <h3 className="text-lg font-semibold text-white">
              Request a product list
            </h3>
            <div className="mt-6">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
