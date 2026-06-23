"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/leads", label: "Inbox" },
  { href: "/admin/projects", label: "Projects" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-sm font-semibold tracking-tight">
            creativekat <span className="brand-gradient">admin</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-[var(--foreground)] text-[var(--background)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="hidden text-[var(--muted)] hover:text-[var(--foreground)] sm:inline"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
