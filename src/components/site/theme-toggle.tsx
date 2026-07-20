"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({
  className = "",
  solid = false,
}: {
  className?: string;
  /** When over a solid navbar the icon follows the theme so it stays visible
   * (dark icon on the white light-mode bar); otherwise it's white over media. */
  solid?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: theme is only known on the client.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const colorCls = solid
    ? "border-foreground/15 bg-foreground/10 text-foreground hover:bg-foreground/20"
    : "border-white/20 bg-white/10 text-white hover:bg-white/20";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        !mounted
          ? "Toggle theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      suppressHydrationWarning
      className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition ${colorCls} ${className}`}
    >
      {mounted && !isDark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
