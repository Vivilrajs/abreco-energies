import Link from "next/link";
import { Star, Quote, Calendar, Clock, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion-primitives";
import { FaqAccordion } from "@/components/site/faq-accordion";
import type {
  ServiceDTO,
  TestimonialDTO,
  ProjectDTO,
  FaqDTO,
  BlogPostDTO,
  SettingsDTO,
} from "@/lib/data";

/* ---------- shared header + "Learn More" ---------- */

function SectionHead({
  eyebrow,
  title,
  subtitle,
  moreHref,
  hasMore,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  moreHref?: string;
  hasMore?: boolean;
  center?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 ${
        center ? "mx-auto max-w-2xl text-center" : ""
      }`}
    >
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="text-lg text-foreground/60">{subtitle}</p>
        </Reveal>
      )}
      {hasMore && moreHref && (
        <Reveal delay={0.15}>
          <Link
            href={moreHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:gap-3"
          >
            Learn more <ArrowRight size={16} />
          </Link>
        </Reveal>
      )}
    </div>
  );
}

function MoreButton({ href, label }: { href: string; label: string }) {
  return (
    <Reveal className="mt-12 flex justify-center">
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full border border-brand/40 px-7 py-3.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
      >
        {label} <ArrowRight size={16} />
      </Link>
    </Reveal>
  );
}

/* ---------- About ---------- */

export function AboutSection({ settings }: { settings: SettingsDTO }) {
  return (
    <section id="about" className="bg-background py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.imageUrl || "/assets/about/about-1.png"}
              alt="Abreco Energies"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
        <div className="flex flex-col gap-5">
          <Reveal>
            <Eyebrow>About Us</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your partner in clean, affordable energy
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-foreground/60">
              {settings.heroBody}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/about"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-strong"
            >
              Learn more about us <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */

export function ServicesPreview({ services }: { services: ServiceDTO[] }) {
  const shown = services.slice(0, 3);
  if (shown.length === 0) return null;

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Our Services"
          title="Renewable energy solutions we deliver"
          subtitle="Solar, batteries, heat pumps and cooling - designed, installed, and rebate-handled."
        />
        <Stagger className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
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
        <MoreButton href="/services" label="View all services" />
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

export function TestimonialsPreview({
  testimonials,
}: {
  testimonials: TestimonialDTO[];
}) {
  const shown = testimonials.slice(0, 3);
  if (shown.length === 0) return null;

  return (
    <section className="bg-foreground/[0.02] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Testimonials"
          title="Loved by homeowners & businesses"
        />
        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((t) => (
            <StaggerItem key={t._id}>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-7">
                <Quote className="text-brand" size={28} />
                <p className="mt-4 flex-1 leading-relaxed text-foreground/70">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < t.rating ? "fill-current" : "text-foreground/20"
                      }
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
            </StaggerItem>
          ))}
        </Stagger>
        <MoreButton href="/testimonials" label="Read all reviews" />
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */

export function ProjectsPreview({ projects }: { projects: ProjectDTO[] }) {
  const shown = projects.slice(0, 6);
  const hasMore = projects.length > 6;
  if (shown.length === 0) return null;

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Our Work"
          title="Portfolio of solar success"
          subtitle="Real installations across homes and businesses in Australia."
        />
        <Stagger className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {shown.map((p) => (
            <StaggerItem key={p._id}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-border">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.title || "Project"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="hero-fallback h-full w-full" />
                )}
                {(p.title || p.category) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                    {p.category && (
                      <div className="text-xs font-medium uppercase tracking-wider text-white/70">
                        {p.category}
                      </div>
                    )}
                    {p.title && (
                      <div className="mt-1 font-semibold text-white">
                        {p.title}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        {hasMore && <MoreButton href="/projects" label="View all projects" />}
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function FaqPreview({ faqs }: { faqs: FaqDTO[] }) {
  const shown = faqs.slice(0, 6);
  const hasMore = faqs.length > 6;
  if (shown.length === 0) return null;

  return (
    <section className="bg-foreground/[0.02] py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHead
          eyebrow="FAQ"
          title="Frequently asked questions"
          moreHref="/faq"
          hasMore={hasMore}
        />
        <Reveal className="mt-12">
          <FaqAccordion faqs={shown} />
        </Reveal>
        {hasMore && <MoreButton href="/faq" label="See all FAQs" />}
      </div>
    </section>
  );
}

/* ---------- Blog ---------- */

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BlogPreview({ posts }: { posts: BlogPostDTO[] }) {
  const shown = posts.slice(0, 3);
  const hasMore = posts.length > 3;
  if (shown.length === 0) return null;

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHead
          eyebrow="Latest Blog Post"
          title="Read our latest solar insights"
          moreHref="/blog"
          hasMore={hasMore}
        />
        <Stagger className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
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
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        {hasMore && <MoreButton href="/blog" label="Read all articles" />}
      </div>
    </section>
  );
}
