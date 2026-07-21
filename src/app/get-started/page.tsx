import type { Metadata } from "next";
import { Check, Phone, Clock, BadgeDollarSign } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { LeadForm } from "@/components/site/lead-form";
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
  title: "Get Started - Book a Free Consultation | Abreco Energies",
  description:
    "Book your free, no-obligation energy consultation. We handle the rebates and installation from start to finish.",
};

const PERKS = [
  { icon: BadgeDollarSign, text: "Free, no-obligation quote - rebates handled for you" },
  { icon: Clock, text: "We respond within one business day" },
  { icon: Phone, text: "Expert consultation, tailored to your property" },
];

const STEPS = [
  "Tell us what you need using the form",
  "We assess your property and design a system",
  "Accredited installers complete the job - usually in a day",
];

export default async function GetStartedPage() {
  const settings = await getSettings();

  return (
    <main className="site-font bg-background">
      <SiteHeader />

      {/* CTA hero with form */}
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
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-24 pt-40 lg:grid-cols-2 lg:items-center">
          <div>
            <HeroIn>
              <Eyebrow tone="onMedia">Get started</Eyebrow>
            </HeroIn>
            <HeroIn delay={0.1}>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                Ready to cut your energy bills?
              </h1>
            </HeroIn>
            <HeroIn delay={0.2}>
              <p className="mt-5 max-w-md text-lg text-white/70">
                Book a free consultation today. No obligation, no pressure - just
                a clear plan and honest advice.
              </p>
            </HeroIn>
            <Stagger className="mt-8 space-y-3">
              {PERKS.map((p) => (
                <StaggerItem key={p.text}>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                      <p.icon size={17} />
                    </span>
                    {p.text}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Dark form card - LeadForm styled for dark surfaces */}
          <Reveal
            delay={0.15}
            className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-2xl sm:p-8"
          >
            <h2 className="text-xl font-semibold text-white">
              Book your free consultation
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Tell us what you need - we&apos;ll be in touch within one business
              day.
            </p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal className="text-center">
            <Eyebrow>Simple process</Eyebrow>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What happens next
            </h2>
          </Reveal>
          <Stagger className="mt-12 space-y-4">
            {STEPS.map((s, i) => (
              <StaggerItem key={s}>
                <div className="flex items-center gap-5 rounded-2xl border border-foreground/10 bg-foreground/5 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80">{s}</span>
                  <Check className="ml-auto text-brand" size={18} />
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
