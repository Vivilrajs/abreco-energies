import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Eyebrow } from "@/components/site/eyebrow";
import {
  Stagger,
  StaggerItem,
  HeroIn,
} from "@/components/site/motion-primitives";
import { getPublishedPosts, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog - Abreco Energies",
  description: "Latest solar insights, guides, and renewable energy news.",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    getPublishedPosts(),
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
            <Eyebrow tone="onMedia">Latest Blog Post</Eyebrow>
          </HeroIn>
          <HeroIn delay={0.1}>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Read our latest solar insights
            </h1>
          </HeroIn>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <StaggerItem key={p._id}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-border bg-card">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="hero-fallback flex h-full w-full items-center justify-center text-5xl">
                        📰
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex items-center gap-5 text-sm text-foreground/50">
                    <span className="inline-flex items-center gap-2">
                      <Calendar size={15} /> {fmtDate(p.date)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock size={15} /> {p.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-snug text-foreground transition group-hover:text-brand">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/60">
                    {p.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand transition group-hover:gap-3">
                    Read article <ArrowRight size={16} />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
