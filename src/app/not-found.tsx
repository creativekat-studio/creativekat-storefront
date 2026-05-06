import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="brand-glow pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 opacity-70"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-start px-6 py-24 sm:py-32">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
          — 404 / not found
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
          This page is on the{" "}
          <span className="brand-gradient">cutting-room floor</span>.
        </h1>
        <p className="mt-6 max-w-xl text-[var(--muted)]">
          Either it was never made, or it didn&apos;t make the final cut. The
          rest of the studio is just a click away.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(79,70,229,0.6)] transition hover:brightness-110"
          >
            Back to the studio →
          </Link>
          <Link
            href="/#contact"
            className="rounded-full border border-[var(--border)] bg-[var(--surface)]/40 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:border-violet-500/60"
          >
            Tell us what you were looking for
          </Link>
        </div>
      </div>
    </section>
  );
}
