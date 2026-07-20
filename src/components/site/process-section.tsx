import { ClipboardList, PencilRuler, HardHat, Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/site/eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion-primitives";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Site assessment",
    body: "A free consultation to understand your energy use and goals, followed by an on-site inspection.",
  },
  {
    icon: PencilRuler,
    title: "Design & planning",
    body: "A tailored system design, sized to your property and budget, with all rebate paperwork handled for you.",
  },
  {
    icon: HardHat,
    title: "Professional install",
    body: "Licensed, accredited installers complete the job cleanly and safely — usually within a day.",
  },
  {
    icon: Sparkles,
    title: "Ongoing support",
    body: "We stay on hand for servicing, warranty claims, and any questions long after installation.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="relative bg-background py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Our process</Eyebrow>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            How we get you set up
          </h2>
          <p className="mt-4 text-lg text-foreground/60">
            From first call to final install, a straightforward four-step
            process with no surprises.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <StaggerItem key={s.title}>
              <div className="relative h-full rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
                <div className="text-5xl font-semibold text-foreground/10">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue">
                  <s.icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/55">
                  {s.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
