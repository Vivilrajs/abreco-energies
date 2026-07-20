import { Phone, Mail, MapPin } from "lucide-react";
import type { SettingsDTO } from "@/lib/data";
import { Logo } from "./logo";

export function SiteFooter({ settings }: { settings: SettingsDTO }) {
  return (
    <footer
      id="contact"
      className="relative bg-[#05141f] py-20 text-white"
    >
      {/* brand accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-brand-red to-brand-blue" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Logo height={40} />
            <p className="mt-5 max-w-md text-white/50">
              Your partner in renewable energy solutions. Cleaner, smarter, more
              affordable power for your home or business.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ContactItem
              icon={<Phone size={18} />}
              label="Call us"
              value={settings.phone}
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
            />
            <ContactItem
              icon={<Mail size={18} />}
              label="Email"
              value={settings.email}
              href={`mailto:${settings.email}`}
            />
            <ContactItem
              icon={<MapPin size={18} />}
              label="Visit"
              value={settings.address}
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Abreco Energies. All rights reserved.</span>
          <span>Accredited · VIC · NSW · QLD · SA</span>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({
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
    <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-brand/60">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-white">
        {icon}
      </div>
      <div className="mt-3 text-xs uppercase tracking-wider text-white/40">
        {label}
      </div>
      <div className="mt-1 break-words font-medium text-white">{value}</div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
