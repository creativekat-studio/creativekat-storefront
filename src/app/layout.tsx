import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import NowBar from "@/components/NowBar";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "creativekat studio — small, careful digital products",
  description:
    "creativekat is the studio behind disenio.studio and other digital products.",
  metadataBase: new URL("https://creativekat.studio"),
  openGraph: {
    title: "creativekat studio",
    description:
      "Studio behind disenio.studio and other digital products.",
    url: "https://creativekat.studio",
    siteName: "creativekat studio",
  },
};

// Runs before paint to set the .dark class — avoids a flash of the wrong theme.
const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=s?s==='dark':m;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
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
                href="https://annmantele.com"
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
      </body>
    </html>
  );
}
