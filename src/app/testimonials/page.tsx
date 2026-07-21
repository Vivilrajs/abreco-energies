import type { Metadata } from "next";
import { Star, Quote } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Eyebrow } from "@/components/site/eyebrow";
import {
  HeroIn,
  Stagger,
  StaggerItem,
} from "@/components/site/motion-primitives";
import { getPublishedTestimonials, getSettings } from "@/lib/data";
import type { TestimonialDTO } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Testimonials - Abreco Energies",
  description:
    "What our customers say about their heat pump, air conditioning, and solar installations.",
};

export default async function TestimonialsPage() {
  const [testimonials, settings] = await Promise.all([
    getPublishedTestimonials(),
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
            <Eyebrow tone="onMedia">Testimonials</Eyebrow>
          </HeroIn>
          <HeroIn delay={0.1}>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Loved by homeowners &amp; businesses
            </h1>
          </HeroIn>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          {testimonials.length === 0 ? (
            <p className="text-center text-foreground/50">
              Customer reviews coming soon.
            </p>
          ) : (
            <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <StaggerItem key={t._id}>
                  <Card t={t} />
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

function Card({ t }: { t: TestimonialDTO }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-foreground/10 bg-foreground/5 p-7">
      <Quote className="text-brand" size={28} />
      <p className="mt-4 flex-1 leading-relaxed text-foreground/70">
        “{t.quote}”
      </p>
      <div className="mt-6 flex items-center gap-1 text-brand">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={15}
            className={i < t.rating ? "fill-current" : "text-foreground/20"}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand-blue/15 text-sm font-semibold text-brand-blue">
          {t.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={t.avatar}
              alt={t.name}
              className="h-full w-full object-cover"
            />
          ) : (
            t.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <div className="font-semibold text-foreground">{t.name}</div>
          {t.role && (
            <div className="text-sm text-foreground/50">{t.role}</div>
          )}
        </div>
      </div>
    </div>
  );
}
