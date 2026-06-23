import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NowBar from "@/components/NowBar";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "creativekat studio",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="creativekat.studio — home" className="block">
            <Image
              src="/creativekat-studio-light.png"
              alt="creativekat.studio"
              width={778}
              height={130}
              priority
              className="h-7 w-auto dark:hidden"
            />
            <Image
              src="/creativekat-studio-dark.png"
              alt="creativekat.studio"
              width={778}
              height={130}
              priority
              className="hidden h-7 w-auto dark:block"
            />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <NowBar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} creativekat studio</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="https://annmantele.dev"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Founder&apos;s Portfolio ↗
            </a>
            <a
              href="mailto:hello@creativekat.studio"
              className="hover:underline"
            >
              hello@creativekat.studio
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
