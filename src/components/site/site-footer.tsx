import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import type { SettingsDTO } from "@/lib/data";
import { Logo } from "./logo";

/* ---------- Nav data (mirrors site-header) ---------- */

const NAV_QUICK = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Supply", href: "/supply" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const NAV_SOLUTIONS = [
  { label: "Heat Pumps", href: "/solutions/heat-pumps" },
  { label: "Air Conditioning", href: "/solutions/air-conditioning" },
  { label: "Residential Solar", href: "/solutions/residential-solar" },
  { label: "Commercial Solar", href: "/solutions/commercial-solar" },
  { label: "Solar Battery", href: "/solutions/solar-battery" },
];

const NAV_PAGES = [
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Get Started", href: "/get-started" },
];

/* ---------- Footer ---------- */

export function SiteFooter({ settings }: { settings: SettingsDTO }) {
  return (
    <footer
      id="contact"
      className="relative bg-[#05141f] py-20 text-white"
    >
      {/* brand accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-brand-red to-brand-blue" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Top grid: brand + nav columns + contact */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto_auto_auto_1fr]">
          {/* Brand blurb */}
          <div>
            <Logo height={40} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              Your partner in renewable energy solutions. Cleaner, smarter, more
              affordable power for your home or business.
            </p>
          </div>

          {/* Quick Links */}
          <FooterNavColumn title="Quick Links" links={NAV_QUICK} />

          {/* Solutions */}
          <FooterNavColumn title="Solutions" links={NAV_SOLUTIONS} />

          {/* Pages */}
          <FooterNavColumn title="Pages" links={NAV_PAGES} />

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Get In Touch
            </h3>
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="group flex items-center gap-3 text-sm text-white/60 transition hover:text-white"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-white group-hover:bg-brand/40 transition">
                <Phone size={14} />
              </span>
              {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="group flex items-center gap-3 text-sm text-white/60 transition hover:text-white"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-white group-hover:bg-brand/40 transition">
                <Mail size={14} />
              </span>
              {settings.email}
            </a>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-white">
                <MapPin size={14} />
              </span>
              {settings.address}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Abreco Energies. All rights reserved.</span>
          <span>Accredited · VIC · NSW · QLD · SA</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Helpers ---------- */

function FooterNavColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
