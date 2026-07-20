"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  LayoutGrid,
  Settings,
  LogOut,
  Leaf,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Submissions", href: "/admin/submissions", icon: Inbox },
  { label: "Solutions", href: "/admin/solutions", icon: LayoutGrid },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // The login page renders without the shell chrome.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900">
      <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-neutral-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Leaf size={18} className="text-white" />
          </span>
          <span className="font-semibold">Abraco Admin</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((n) => {
            const active =
              n.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <n.icon size={18} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-neutral-200 p-4">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100"
          >
            <ExternalLink size={16} />
            View site
          </a>
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start gap-2 text-neutral-600 hover:text-red-600"
          >
            <LogOut size={16} />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
