import Link from "next/link";
import { ArrowRight, ShieldCheck, BadgeDollarSign, Wrench } from "lucide-react";
import type { SettingsDTO } from "@/lib/data";
import { Eyebrow } from "@/components/site/eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion-primitives";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Licensed & insured",
    body: "Fully accredited installation of heat pumps, air conditioners, and solar systems.",
  },
  {
    icon: BadgeDollarSign,
    title: "Rebates handled",
    body: "As an accredited provider, we access federal & state incentives and pass the savings on.",
  },
  {
    icon: Wrench,
    title: "Hassle-free install",
    body: "A streamlined process for maximum savings and long-term comfort with minimal effort.",
  },
];

export function WhySection({ settings }: { settings?: SettingsDTO }) {
  const imageUrl = settings?.imageUrl;
  return (
    <section id="why" className="relative bg-background py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-2 lg:items-center">
        {/* Image + experience badge */}
        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-foreground/10">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Abreco Energies installation"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="hero-fallback h-full w-full animate-brand-drift" />
            )}
          </div>
          {/* Experience badge — overlaps the image bottom-left */}
          <div className="absolute -bottom-6 left-6 flex items-center gap-4 rounded-2xl border border-foreground/10 bg-card px-6 py-4 shadow-xl">
            <div className="text-5xl font-semibold text-brand">14</div>
            <div className="text-sm font-medium leading-tight text-foreground/70">
              Years of
              <br />
              Experience
            </div>
          </div>
        </Reveal>

        {/* Copy + stats */}
        <div>
          <Reveal>
            <Eyebrow>Why choose us</Eyebrow>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Smart technology, real savings
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/60">
              With years of experience in energy-efficient heating, cooling, and
              solar, Abreco Energies understands how smart technology benefits
              both your home or business and the environment — fast, expert
              consultations followed by professional installation.
            </p>
          </Reveal>

          {/* Stat trio */}
          <Stagger className="mt-8 grid grid-cols-3 gap-4">
            <Stat value="10k+" label="Installs completed" />
            <Stat value="99%" label="Customer satisfaction" accent />
            <Stat value="100%" label="Accredited & insured" />
          </Stagger>

          {/* Feature list */}
          <Stagger className="mt-8 space-y-3">
            {POINTS.map((p) => (
              <StaggerItem key={p.title}>
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue">
                    <p.icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="mt-0.5 text-sm text-foreground/55">{p.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal>
            <Link
              href="/supply"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-strong"
            >
              Discover more <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <StaggerItem>
      <div className="rounded-2xl border border-foreground/10 bg-foreground/5 px-4 py-5 text-center">
        <div
          className={`text-3xl font-semibold ${accent ? "text-brand" : "text-foreground"}`}
        >
          {value}
        </div>
        <div className="mt-1 text-xs leading-tight text-foreground/50">
          {label}
        </div>
      </div>
    </StaggerItem>
  );
}
