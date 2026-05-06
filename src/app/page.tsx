import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import InquiryForm from "@/components/InquiryForm";

const capabilities = [
  { k: "01", label: "Product design" },
  { k: "02", label: "Web engineering" },
  { k: "03", label: "Brand systems" },
  { k: "04", label: "Tiny tools" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {/* backdrop layers */}
        <div aria-hidden className="absolute inset-0 grid-bg opacity-70" />
        <div
          aria-hidden
          className="brand-glow pointer-events-none absolute -top-40 left-1/2 h-[700px] w-[900px] -translate-x-1/2 opacity-80"
        />
        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)] backdrop-blur">
            <span className="inline-block size-1.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600" />Studio · est. 2026
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Small,{" "}
            <span className="brand-gradient">careful</span>
            <br />
            digital products.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
            creativekat is the studio behind a growing collection of tools and
            experiments — built with the kind of attention you usually only get
            on personal projects.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(79,70,229,0.6)] transition hover:brightness-110"
            >
              See products<span className="transition-transform group-hover:translate-x-0.5">&nbsp;→</span>
            </Link>
            <Link
              href="#contact"
              className="rounded-full border border-[var(--border)] bg-[var(--surface)]/40 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:border-violet-500/60"
            >
              Start an inquiry
            </Link>
          </div>

          {/* capabilities strip */}
          <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
            {capabilities.map((c) => (
              <li
                key={c.k}
                className="bg-[var(--background)] px-4 py-5 transition hover:bg-[var(--surface)]"
              >
                <p className="font-mono text-[11px] tracking-widest text-[var(--muted)]">
                  {c.k}
                </p>
                <p className="mt-2 text-sm font-medium">{c.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        className="relative border-b border-[var(--border)]"
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                — Products
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                What we&apos;re <span className="brand-gradient">shipping</span>
              </h2>
            </div>
            <p className="hidden text-sm text-[var(--muted)] sm:block">
              {products.length} live · more on the way
            </p>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2">
            {products.map((p, i) => (
              <li
                key={p.slug}
                className="card-accent group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition"
              >
                {p.image && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${p.name}`}
                    className="relative block aspect-[16/10] overflow-hidden border-b border-[var(--border)] bg-[var(--background)]"
                  >
                    <Image
                      src={p.image}
                      alt={p.imageAlt ?? p.name}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-black/30"
                    />
                  </a>
                )}
                <div className="relative p-6">
                {/* subtle corner gradient */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-violet-600/20 to-blue-600/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                    <span
                      className={`inline-block size-1.5 rounded-full ${
                        p.status === "Live"
                          ? "bg-emerald-500"
                          : p.status === "Beta"
                            ? "bg-amber-500"
                            : "bg-neutral-400"
                      }`}
                    />
                    {p.status}
                  </span>
                  <span className="font-mono text-xs text-[var(--muted)]">
                    {String(i + 1).padStart(2, "0")} / {p.year}
                  </span>
                </div>
                <h3 className="mt-8 text-3xl font-semibold tracking-tight">
                  {p.name}
                </h3>
                <p className="mt-2 text-[var(--muted)]">{p.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  {p.description}
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium underline decoration-dotted underline-offset-4 transition hover:decoration-solid"
                  >
                    {p.urlLabel} ↗
                  </a>
                  {p.tags && (
                    <ul className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                </div>
              </li>
            ))}

            {/* "more on the way" placeholder card */}
            <li className="relative flex flex-col items-start justify-between rounded-2xl border border-dashed border-[var(--border)] p-6 text-[var(--muted)]">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest">
                  In progress
                </p>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                  Something new is brewing.
                </h3>
                <p className="mt-2 text-sm">
                  Want a heads-up when it ships? Drop a note below.
                </p>
              </div>
              <Link
                href="#contact"
                className="mt-8 text-sm font-medium underline decoration-dotted underline-offset-4 hover:decoration-solid"
              >
                Get notified →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative overflow-hidden">
        <div
          aria-hidden
          className="brand-glow pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[700px] opacity-60"
        />
        <div className="relative mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              — Inquire
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Have a <span className="brand-gradient">project</span> in mind?
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Collaborations, licensing, or questions about any of the
              products — send a note and we&apos;ll reply from{" "}
              <a
                href="mailto:hello@creativekat.studio"
                className="underline decoration-dotted underline-offset-4"
              >
                hello@creativekat.studio
              </a>.
            </p>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="text-[var(--muted)]">Email</dt>
                <dd>
                  <a
                    href="mailto:hello@creativekat.studio"
                    className="hover:underline"
                  >
                    hello@creativekat.studio
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <InquiryForm />
        </div>
      </section>
    </div>
  );
}
