import Link from "next/link";
import type { SolutionDTO } from "@/lib/data";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion-primitives";

export function SolutionsSection({ solutions }: { solutions: SolutionDTO[] }) {
  return (
    <section id="solutions" className="relative bg-neutral-950 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-brand">
            What we offer
          </span>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Our renewable energy solutions
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Premium systems, trusted brands, and government rebates handled for
            you — from first quote to final install.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <StaggerItem
              key={s._id}
              className={i === 0 ? "lg:col-span-2" : ""}
            >
            <Link
              href={`/solutions/${s.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 transition duration-300 hover:-translate-y-1 hover:border-brand/40"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/20 blur-3xl transition group-hover:bg-brand/30" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                  {s.icon}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-md text-white/60">{s.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand">
                  Learn more
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
