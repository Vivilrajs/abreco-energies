import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroIn } from "@/components/site/motion-primitives";
import { getPostBySlug, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article - Abreco Energies" };
  return { title: `${post.title} - Abreco Energies`, description: post.excerpt };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPostBySlug(slug),
    getSettings(),
  ]);

  if (!post) notFound();

  const paragraphs = post.body.split("\n").filter((l) => l.trim());

  return (
    <main className="site-font bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="hero-fallback h-full w-full animate-brand-drift" />
          )}
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="mx-auto max-w-3xl px-6 pb-16 pt-40">
          <HeroIn>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              <ArrowLeft size={16} /> All articles
            </Link>
          </HeroIn>
          <HeroIn delay={0.1}>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              {post.title}
            </h1>
          </HeroIn>
          <HeroIn delay={0.2}>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <User size={15} /> {post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar size={15} /> {fmtDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={15} /> {post.readTime}
              </span>
            </div>
          </HeroIn>
        </div>
      </section>

      {/* Body */}
      <article className="mx-auto max-w-3xl px-6 py-16">
        {post.excerpt && (
          <p className="text-xl leading-relaxed text-foreground/80">
            {post.excerpt}
          </p>
        )}
        <div className="mt-8 space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed text-foreground/70">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-14 border-t border-foreground/10 pt-8">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            Book a free consultation
          </Link>
        </div>
      </article>

      <SiteFooter settings={settings} />
    </main>
  );
}
