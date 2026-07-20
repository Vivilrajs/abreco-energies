"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, ChevronDown, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const SOLAR = [
  { label: "Residential Solar", href: "/solutions/residential-solar" },
  { label: "Commercial Solar", href: "/solutions/commercial-solar" },
  { label: "Solar Battery", href: "/solutions/solar-battery" },
];

const NAV = [
  { label: "Home", href: "/" },
  { label: "Heat Pumps", href: "/solutions/heat-pumps" },
  { label: "Air Conditioning", href: "/solutions/air-conditioning" },
  { label: "Supply", href: "/supply" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-brand-blue/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Leaf size={18} className="text-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Abreco Energies
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="/solutions/heat-pumps"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Heat Pumps
          </Link>
          <Link
            href="/solutions/air-conditioning"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Air Conditioning
          </Link>

          {/* Solar dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm text-white/70 transition hover:text-white">
              Solar & Batteries <ChevronDown size={14} />
            </button>
            <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-white/10 bg-brand-blue-strong/95 p-2 backdrop-blur-xl">
                {SOLAR.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/supply"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Supply
          </Link>
          <Link
            href="/contact"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-strong sm:block"
          >
            Get in touch
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 lg:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {[...NAV, ...SOLAR].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/5"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
