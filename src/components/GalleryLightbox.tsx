"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Item = { src?: string; alt: string; label: string };

const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i;

export default function GalleryLightbox({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);
  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i - 1 + items.length) % items.length,
    );
  }, [items.length]);

  // Keyboard + body scroll lock while open
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, next, prev]);

  const active = openIndex !== null ? items[openIndex] : null;
  const activeIsVideo = !!active?.src && VIDEO_RE.test(active.src);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((it, i) => (
          <li key={`${it.src ?? "placeholder"}-${i}`}>
            <Tile item={it} onOpen={() => it.src && setOpenIndex(i)} />
          </li>
        ))}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur transition hover:bg-black/60"
          >
            <CloseIcon />
          </button>

          {/* Counter */}
          <div className="absolute left-4 top-4 font-mono text-[11px] uppercase tracking-widest text-white/70">
            {String((openIndex ?? 0) + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </div>

          {/* Prev */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur transition hover:bg-black/60 sm:left-6"
            >
              <ArrowIcon dir="left" />
            </button>
          )}

          {/* Media */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[88vh] max-w-[92vw] overflow-hidden rounded-2xl"
          >
            {activeIsVideo && active.src ? (
              <video
                src={active.src}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="max-h-[88vh] max-w-[92vw]"
              />
            ) : active.src ? (
              <Image
                src={active.src}
                alt={active.alt}
                width={2400}
                height={2400}
                sizes="92vw"
                className="h-auto max-h-[88vh] w-auto max-w-[92vw] object-contain"
              />
            ) : null}
          </div>

          {/* Next */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur transition hover:bg-black/60 sm:right-6"
            >
              <ArrowIcon dir="right" />
            </button>
          )}
        </div>
      )}
    </>
  );
}

function Tile({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const isVideo = !!item.src && VIDEO_RE.test(item.src);
  const wrapper =
    "group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]";

  if (!item.src) {
    return (
      <div className={wrapper}>
        <span className="absolute inset-0 grid place-items-center font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          {item.label}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${item.alt}`}
      className={`${wrapper} cursor-zoom-in text-left`}
    >
      {isVideo ? (
        <video
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      )}
      {/* Zoom icon — tiny square, top-right */}
      <span
        aria-hidden
        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/30 bg-black/40 text-white/90 backdrop-blur transition group-hover:bg-black/70"
      >
        <ZoomIcon />
      </span>
    </button>
  );
}

function ZoomIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}
