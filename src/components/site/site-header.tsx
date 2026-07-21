"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

const SOLAR = [
  { label: "Residential Solar", href: "/solutions/residential-solar" },
  { label: "Commercial Solar", href: "/solutions/commercial-solar" },
  { label: "Solar Battery", href: "/solutions/solar-battery" },
];

const PAGES = [
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

// Mobile order: Home, Heat Pumps, Air Conditioning, [Solar & Batteries] (4th), Services, Supply, Projects, Blog, [Pages], Contact
const NAV_BEFORE_SOLAR = [
  { label: "Home", href: "/" },
  { label: "Heat Pumps", href: "/solutions/heat-pumps" },
  { label: "Air Conditioning", href: "/solutions/air-conditioning" },
];
const NAV_AFTER_SOLAR = [
  { label: "Services", href: "/services" },
  { label: "Supply", href: "/supply" },
];
const NAV_LAST = [{ label: "Contact", href: "/contact" }];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [solarOpen, setSolarOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;
  // Solid navbar adapts to theme (white in light, dark in dark); transparent
  // navbar sits over the dark hero, so its text stays white.
  const linkCls = solid
    ? "text-sm text-foreground/70 transition hover:text-foreground"
    : "text-sm text-white/70 transition hover:text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        solid
          ? "border-b border-black/10 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#05141f]/90"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Logo height={64} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link href="/solutions/heat-pumps" className={linkCls}>
            Heat Pumps
          </Link>
          <Link href="/solutions/air-conditioning" className={linkCls}>
            Air Conditioning
          </Link>
          <Link href="/services" className={linkCls}>
            Services
          </Link>

          {/* Solar dropdown */}
          <div className="group relative">
            <button className={`flex items-center gap-1 ${linkCls}`}>
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

          <Link href="/supply" className={linkCls}>
            Supply
          </Link>

          {/* Pages dropdown */}
          <div className="group relative">
            <button className={`flex items-center gap-1 ${linkCls}`}>
              Pages <ChevronDown size={14} />
            </button>
            <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-white/10 bg-brand-blue-strong/95 p-2 backdrop-blur-xl">
                {PAGES.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="block rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/contact" className={linkCls}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle solid={solid} />
          <Link
            href="/contact"
            className="hidden rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-strong sm:block"
          >
            Get in touch
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden ${solid ? "text-foreground" : "text-white"}`}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-[#05141f]/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {NAV_BEFORE_SOLAR.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/5"
              >
                {n.label}
              </Link>
            ))}

            {/* Solar & Batteries collapsible - 4th item */}
            <button
              onClick={() => setSolarOpen((v) => !v)}
              aria-expanded={solarOpen}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/5"
            >
              Solar &amp; Batteries
              <ChevronDown
                size={16}
                className={`transition-transform ${solarOpen ? "rotate-180" : ""}`}
              />
            </button>
            {solarOpen && (
              <div className="ml-3 flex flex-col gap-1 border-l border-white/10 pl-3">
                {SOLAR.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}

            {NAV_AFTER_SOLAR.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/5"
              >
                {n.label}
              </Link>
            ))}

            {/* Pages collapsible */}
            <button
              onClick={() => setPagesOpen((v) => !v)}
              aria-expanded={pagesOpen}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/5"
            >
              Pages
              <ChevronDown
                size={16}
                className={`transition-transform ${pagesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {pagesOpen && (
              <div className="ml-3 flex flex-col gap-1 border-l border-white/10 pl-3">
                {PAGES.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            )}

            {NAV_LAST.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/5"
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
