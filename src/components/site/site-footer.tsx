import { Leaf, Phone, Mail, MapPin } from "lucide-react";
import type { SettingsDTO } from "@/lib/data";

export function SiteFooter({ settings }: { settings: SettingsDTO }) {
  return (
    <footer
      id="contact"
      className="relative border-t border-foreground/10 bg-background py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
                <Leaf size={20} className="text-white" />
              </span>
              <span className="text-xl font-semibold">Abreco Energies</span>
            </div>
            <p className="mt-4 max-w-md text-foreground/50">
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

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 text-sm text-foreground/40 sm:flex-row">
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
    <div className="h-full rounded-2xl border border-foreground/10 bg-foreground/5 p-5 transition hover:border-brand-blue/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/15 text-brand-blue">
        {icon}
      </div>
      <div className="mt-3 text-xs uppercase tracking-wider text-foreground/40">
        {label}
      </div>
      <div className="mt-1 break-words font-medium text-foreground">
        {value}
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
