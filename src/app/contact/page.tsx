import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { LeadForm } from "@/components/site/lead-form";
import { getSettings } from "@/lib/data";
import {
  Reveal,
  Stagger,
  StaggerItem,
  HeroIn,
} from "@/components/site/motion-primitives";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Abreco Energies",
  description:
    "Book a free consultation for heat pumps, air conditioning, and solar solutions.",
};

export default async function ContactPage() {
  const settings = await getSettings();

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

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-24 pt-40 lg:grid-cols-2">
          <div>
            <HeroIn>
              <span className="text-sm font-medium uppercase tracking-widest text-brand">
                Contact us
              </span>
            </HeroIn>
            <HeroIn delay={0.1}>
              <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Ready to upgrade and start saving?
              </h1>
            </HeroIn>
            <HeroIn delay={0.2}>
              <p className="mt-5 max-w-md text-lg text-white/60">
                Contact Abreco Energies today for a free consultation on
                energy-efficient heating, cooling, and solar. We handle the
                rebates and installation.
              </p>
            </HeroIn>

            <Stagger className="mt-10 space-y-4" delay={0.3}>
              <StaggerItem>
                <ContactRow
                  icon={<Phone size={18} />}
                  label="Call us"
                  value={settings.phone}
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                />
              </StaggerItem>
              <StaggerItem>
                <ContactRow
                  icon={<Mail size={18} />}
                  label="Email"
                  value={settings.email}
                  href={`mailto:${settings.email}`}
                />
              </StaggerItem>
              <StaggerItem>
                <ContactRow
                  icon={<MapPin size={18} />}
                  label="Address"
                  value={settings.address}
                />
              </StaggerItem>
            </Stagger>
          </div>

          <Reveal
            delay={0.15}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <h2 className="text-xl font-semibold text-white">
              Book your free consultation
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Tell us what you need — we&apos;ll be in touch within one business
              day.
            </p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-blue/40">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue">
        {icon}
      </span>
      <div>
        <div className="text-xs uppercase tracking-wider text-white/40">
          {label}
        </div>
        <div className="font-medium text-white">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
