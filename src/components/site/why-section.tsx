import { ShieldCheck, Zap, BadgeDollarSign, Wrench } from "lucide-react";

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
    icon: Zap,
    title: "High-quality systems",
    body: "Only trusted brands, giving you a wide range of options to suit your energy needs.",
  },
  {
    icon: Wrench,
    title: "Hassle-free install",
    body: "A streamlined process for maximum savings and long-term comfort with minimal effort.",
  },
];

export function WhySection() {
  return (
    <section id="why" className="relative bg-neutral-950 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-medium uppercase tracking-widest text-brand">
              Why choose us
            </span>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Smart technology, real savings
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/60">
              With years of experience in energy-efficient heating, cooling, and
              solar, Abraco Energies understands how smart technology benefits
              both your home or business and the environment. We provide fast,
              expert consultations, followed by professional installation.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
                <div className="text-3xl font-semibold text-white">100%</div>
                <div className="text-sm text-white/50">Accredited</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
                <div className="text-3xl font-semibold text-white">Free</div>
                <div className="text-sm text-white/50">Consultation</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {POINTS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <p.icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-white/55">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
