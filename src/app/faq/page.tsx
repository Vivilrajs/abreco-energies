import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Eyebrow } from "@/components/site/eyebrow";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { HeroIn, Reveal } from "@/components/site/motion-primitives";
import { getPublishedFaqs, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ - Abreco Energies",
  description:
    "Answers to common questions about heat pumps, air conditioning, solar, rebates, and installation.",
};

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([
    getPublishedFaqs(),
    getSettings(),
  ]);

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
        <div className="mx-auto max-w-3xl px-6 pb-20 pt-40 text-center">
          <HeroIn>
            <Eyebrow tone="onMedia">FAQ</Eyebrow>
          </HeroIn>
          <HeroIn delay={0.1}>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Frequently asked questions
            </h1>
          </HeroIn>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          {faqs.length === 0 ? (
            <p className="text-center text-foreground/50">
              Questions &amp; answers coming soon.
            </p>
          ) : (
            <Reveal>
              <FaqAccordion faqs={faqs} />
            </Reveal>
          )}

          <Reveal className="mt-12 text-center">
            <p className="text-foreground/60">Still have a question?</p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-strong"
            >
              Talk to our team
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
