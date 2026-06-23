import type { Metadata } from "next";
import Link from "next/link";
import ProjectBriefForm from "@/components/ProjectBriefForm";

export const metadata: Metadata = {
  title: "Start a project — creativekat studio",
  description:
    "Tell us about your project — logo, brand system, website, or shop. We'll reply with next steps and a tailored discovery doc within a few days.",
  openGraph: {
    title: "Start a project — creativekat studio",
    description:
      "Tell us about your project — logo, brand system, website, or shop.",
  },
};

export default function StartPage() {
  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="brand-glow pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 opacity-60"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
            — Start a project
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Tell us about your{" "}
            <span className="brand-gradient">project</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--muted)] sm:text-xl">
            About 10 minutes. Short answers are fine. Skip anything you&apos;re
            not sure about — we&apos;ll cover it on a call.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Just have a quick question?{" "}
            <Link
              href="/#contact"
              className="underline decoration-dotted underline-offset-4 hover:text-[var(--foreground)]"
            >
              Send a quick note instead →
            </Link>
          </p>
        </div>
      </section>

      {/* Form */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <ProjectBriefForm />
        </div>
      </section>
    </article>
  );
}
