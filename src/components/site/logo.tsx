"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

/** Brand lockup - light logo for light theme (public/logo-light.png), white/glow
 * variant for dark theme (public/logo-dark.png). Both transparent. */
const LOGOS = {
  light: { src: "/logo-light-v2.png", width: 1570, height: 1002 },
  dark: { src: "/logo-dark.png", width: 1536, height: 1024 },
};

export function Logo({
  className = "",
  height = 48,
}: {
  className?: string;
  height?: number;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const variant = mounted && resolvedTheme === "dark" ? LOGOS.dark : LOGOS.light;

  return (
    <Image
      src={variant.src}
      alt="Abreco Energies"
      width={Math.round((height * variant.width) / variant.height)}
      height={height}
      priority
      suppressHydrationWarning
      className={`w-auto ${className}`}
      style={{ height, width: "auto" }}
    />
  );
}
