import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { SolutionDTO } from "@/lib/data";
import {
  Reveal,
  Stagger,
  StaggerItem,
  HeroIn,
  HoverLift,
} from "@/components/site/motion-primitives";

function InstallBlock({
  section,
  flip,
}: {
  section: SolutionDTO["commercial"];
  flip?: boolean;
}) {
  if (!section?.title) return null;
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
      <Reveal className={flip ? "lg:order-2" : ""} y={30}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
          {section.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={section.image}
              alt={section.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="hero-fallback flex h-full w-full animate-brand-drift items-center justify-center text-6xl">
              🔧
            </div>
          )}
        </div>
      </Reveal>
      <Reveal className={flip ? "lg:order-1" : ""} delay={0.12} y={30}>
        <h3 className="text-3xl font-semibold text-white">{section.title}</h3>
        <p className="mt-4 leading-relaxed text-white/60">{section.body}</p>
        {section.scenarios.length > 0 && (
          <ul className="mt-6 space-y-3">
            {section.scenarios.map((s) => (
              <li key={s} className="flex items-start gap-3 text-white/80">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check size={14} />
                </span>
                {s}
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-strong"
        >
          Contact Us <ArrowRight size={16} />
        </Link>
      </Reveal>
    </div>
  );
}

export function ProductDetail({ product }: { product: SolutionDTO }) {
  const hasInstalls = product.commercial?.title || product.residential?.title;

  return (
    <div className="bg-neutral-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {product.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.heroImage}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="hero-fallback h-full w-full animate-brand-drift" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-neutral-950" />
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-20 pt-40 text-center">
          <HeroIn>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-4xl">
              {product.icon}
            </div>
          </HeroIn>
          <HeroIn delay={0.08}>
            <span className="mt-6 block text-sm font-medium uppercase tracking-widest text-brand">
              {product.title}
            </span>
          </HeroIn>
          <HeroIn delay={0.16}>
            <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              {product.tagline || product.title}
            </h1>
          </HeroIn>
          {product.intro && (
            <HeroIn delay={0.26}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
                {product.intro}
              </p>
            </HeroIn>
          )}
          <HeroIn delay={0.36}>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-2xl transition hover:bg-brand-strong hover:scale-[1.03] active:scale-95"
            >
              {product.ctaLabel || "Get Now!"}
            </Link>
          </HeroIn>
        </div>
      </section>

      {/* Benefits */}
      {product.benefits.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {product.headline || "Key benefits"}
              </h2>
            </Reveal>
            <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {product.benefits.map((b, i) => (
                <StaggerItem key={i}>
                  <HoverLift className="h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl">
                      {b.icon}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-white/70">
                      {b.text}
                    </p>
                  </HoverLift>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Install sections */}
      {hasInstalls && (
        <section className="space-y-24 pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <InstallBlock section={product.commercial} />
          </div>
          <div className="mx-auto max-w-7xl px-6">
            <InstallBlock section={product.residential} flip />
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="border-y border-white/10 bg-gradient-to-r from-brand/20 to-transparent py-16">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-balance text-3xl font-semibold text-white">
            Ready to save with {product.title}?
          </h2>
          <p className="text-white/60">
            Book a free consultation — we handle the rebates and installation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 font-semibold text-white transition hover:bg-brand-strong hover:scale-[1.03] active:scale-95"
          >
            {product.ctaLabel || "Get Now!"} <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
