import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, type CaseStudy } from "@/lib/caseStudies";
import { readGallery } from "@/lib/galleryFs";
import GalleryLightbox from "@/components/GalleryLightbox";
import LogoDisplay from "@/components/LogoDisplay";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.title} — creativekat studio`,
    description: cs.description,
    openGraph: {
      title: cs.title,
      description: cs.description,
    },
  };
}

export default async function BrandCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  // Auto-discover any files dropped into /public/{assetFolder ?? slug-creative}/gallery/
  // Manual `cs.gallery` (if set) takes precedence.
  const galleryFiles =
    cs.gallery && cs.gallery.length > 0
      ? cs.gallery
      : readGallery(slug, cs.assetFolder);

  // Next case study (wraps to the first when on the last one).
  const idx = caseStudies.findIndex((c) => c.slug === slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <article>
      {/* Back link + next-brand */}
      <div className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 text-sm">
          <Link
            href="/#brands"
            className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Back to brands
          </Link>
          {next && next.slug !== cs.slug && (
            <Link
              href={`/brands/${next.slug}`}
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <span className="hidden sm:inline">Next:</span>
              <span className="text-[var(--foreground)]">{next.title}</span>
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="brand-glow pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 opacity-60"
        />
        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="flex flex-wrap items-center gap-2">
            {cs.status && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-widest text-[var(--foreground)] backdrop-blur">
                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                {cs.status}
              </span>
            )}
            {cs.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)] backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {cs.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--muted)] sm:text-xl">
            {cs.description}
          </p>

          {/* CTAs */}
          {cs.liveUrl && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={cs.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(79,70,229,0.6)] transition hover:brightness-110"
              >
                {cs.liveUrlLabel ?? "Visit Social Media"} ↗
              </a>
              {cs.liveUrlNote && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                  <span className="inline-block size-1.5 rounded-full bg-amber-500" />
                  {cs.liveUrlNote}
                </span>
              )}
            </div>
          )}

          {/* Meta strip — same pattern as About's principles strip */}
          <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            <li className="bg-[var(--background)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                Role
              </p>
              <p className="mt-2 text-sm leading-relaxed">{cs.meta.role}</p>
            </li>
            <li className="bg-[var(--background)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                Timeline
              </p>
              <p className="mt-2 text-sm leading-relaxed">{cs.meta.timeline}</p>
            </li>
            <li className="bg-[var(--background)] p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                Stack
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                {cs.meta.stack.join(" · ")}
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Hero asset (conditional) */}
      {cs.heroImage && (
        <section className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <AssetSlot
              src={cs.heroImage}
              alt={`${cs.title} — featured`}
              aspect="aspect-[16/10]"
              label="Hero asset · 16:10"
              priority
            />
          </div>
        </section>
      )}

      {/* Summary */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                — Summary
              </p>
            </div>
            <div className="md:col-span-8">
              <p className="text-xl leading-relaxed text-[var(--foreground)] sm:text-2xl">
                {cs.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand system (conditional — only when defined) */}
      {cs.brandSystem && (
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                — Brand system
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                The <span className="brand-gradient">rule set</span>.
              </h2>
              <p className="mt-4 text-[var(--muted)]">
                {cs.brandSystem.description}
              </p>
            </div>

            <div className="md:col-span-8 space-y-10">
              {/* Logo */}
              <LogoDisplay
                logoLight={cs.logoLight}
                logoDark={cs.logoDark}
                altLight={`${cs.title} — logo on dark`}
                altDark={`${cs.title} — logo on light`}
                scale={cs.logoScale}
              />

              {/* Typography */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                  Typography
                </p>
                <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)]">
                  {cs.brandSystem.typography.map((t) => (
                    <li
                      key={t.name}
                      className="bg-[var(--background)] p-5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                          {t.role}
                        </p>
                        <p className="font-mono text-[11px] text-[var(--muted)]">
                          {t.name}
                        </p>
                      </div>
                      <p
                        className="mt-3 text-2xl leading-tight sm:text-3xl"
                        style={{ fontFamily: t.fontFamily }}
                      >
                        ABCDEFGHIJKLMNOPQRSTUVWXYZ
                      </p>
                      <p
                        className="mt-1 text-xl text-[var(--muted)]"
                        style={{ fontFamily: t.fontFamily }}
                      >
                        abcdefghijklmnopqrstuvwxyz · 0123456789
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Color swatches */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                  Palette
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {cs.brandSystem.colors.map((c) => (
                    <li key={c.hex}>
                      <div
                        className="aspect-square rounded-xl border border-[var(--border)]"
                        style={{ backgroundColor: c.hex }}
                        aria-label={`${c.name} ${c.hex}`}
                      />
                      <div className="mt-2">
                        <p className="text-sm">{c.name}</p>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                          {c.hex}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Body sections */}
      {cs.sections.map((s, i) => (
        <BodySection key={i} section={s} slug={cs.slug} index={i} />
      ))}

      {/* Gallery */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              — Gallery
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="brand-gradient">In situ</span>.
            </h2>
          </div>

          {/* Gallery auto-populates from /public/{slug}-creative/gallery/ */}
          <GalleryLightbox
            items={(galleryFiles.length > 0
              ? galleryFiles
              : Array.from({ length: 6 }, () => undefined)
            ).map((src, i) => ({
              src,
              alt: `${cs.title} — gallery ${i + 1}`,
              label: `Gallery · ${String(i + 1).padStart(2, "0")}`,
            }))}
          />
        </div>
      </section>

      {/* Footer CTA */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
                — Next
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                See more from the{" "}
                <span className="brand-gradient">studio</span>.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#brands"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)]/40 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:border-violet-500/60"
              >
                ← Back to brands
              </Link>
              <Link
                href="/#contact"
                className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(79,70,229,0.6)] transition hover:brightness-110"
              >
                Start an inquiry →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function BodySection({
  section,
  slug,
  index,
}: {
  section: CaseStudy["sections"][number];
  slug: string;
  index: number;
}) {
  return (
    <section className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
              — Section {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {section.heading}
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6">
            {section.paragraphs?.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-lg leading-relaxed text-[var(--foreground)] sm:text-xl"
                    : "text-base leading-relaxed text-[var(--muted)]"
                }
              >
                {p}
              </p>
            ))}

            {/* Feature grid — 1/2/4 cols */}
            {section.features && section.features.length > 0 && (
              <ul
                className={`mt-2 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 ${
                  section.features.length >= 4 ? "lg:grid-cols-4" : ""
                }`}
              >
                {section.features.map((f) => (
                  <li
                    key={f.label}
                    className="flex flex-col gap-3 bg-[var(--background)] p-5"
                  >
                    {f.image && (
                      <AssetSlot
                        src={f.image}
                        alt={f.label}
                        aspect="aspect-[16/10]"
                        label={f.label}
                      />
                    )}
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                        {f.label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed">{f.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Section media row */}
            {section.media && section.media.length > 0 && (
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {section.media.map((src, i) => (
                  <li key={i}>
                    <AssetSlot
                      src={src}
                      alt={`${section.heading} — ${i + 1}`}
                      aspect="aspect-[4/5]"
                      label={`${section.heading} · ${String(i + 1).padStart(2, "0")}`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AssetSlot({
  src,
  alt,
  aspect,
  label,
  fit = "cover",
  priority = false,
  bg = "surface",
  pad,
}: {
  src?: string;
  alt: string;
  aspect: string;
  label: string;
  fit?: "cover" | "contain";
  priority?: boolean;
  bg?: "surface" | "light" | "dark";
  pad?: "sm" | "md" | "lg";
}) {
  const isVideo = !!src && /\.(mp4|webm|mov|m4v)$/i.test(src);
  const bgClass =
    bg === "light"
      ? "bg-white"
      : bg === "dark"
        ? "bg-neutral-950"
        : "bg-[var(--surface)]";
  const padClass =
    pad === "lg" ? "p-12 sm:p-16" : pad === "md" ? "p-8" : pad === "sm" ? "p-4" : "";
  const wrapper = `relative ${aspect} w-full overflow-hidden rounded-2xl border border-[var(--border)] ${bgClass} ${padClass}`;

  if (!src) {
    return (
      <div className={wrapper}>
        <span className="absolute inset-0 grid place-items-center font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          {label}
        </span>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className={wrapper}>
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        />
      </div>
    );
  }

  return (
    <div className={wrapper}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 720px, 100vw"
        className={fit === "contain" ? "object-contain" : "object-cover"}
      />
    </div>
  );
}
