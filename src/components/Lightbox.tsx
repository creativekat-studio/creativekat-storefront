"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

const VIDEO_RE = /\.(mp4|webm|mov|m4v)$/i;

export type LightboxItem = { src: string; alt: string };

type Props = {
  items: LightboxItem[];
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
};

export default function Lightbox({ items, openIndex, setOpenIndex }: Props) {
  const close = useCallback(() => setOpenIndex(null), [setOpenIndex]);

  const next = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((openIndex + 1) % items.length);
  }, [openIndex, items.length, setOpenIndex]);

  const prev = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((openIndex - 1 + items.length) % items.length);
  }, [openIndex, items.length, setOpenIndex]);

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

  if (openIndex === null) return null;
  const active = items[openIndex];
  if (!active) return null;
  const isVideo = VIDEO_RE.test(active.src);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={active.alt}
      onClick={close}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur transition hover:bg-black/60"
      >
        <CloseIcon />
      </button>

      <div className="absolute left-4 top-4 font-mono text-[11px] uppercase tracking-widest text-white/70">
        {String(openIndex + 1).padStart(2, "0")} /{" "}
        {String(items.length).padStart(2, "0")}
      </div>

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

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[88vh] max-w-[92vw] overflow-hidden rounded-2xl"
      >
        {isVideo ? (
          <video
            src={active.src}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="max-h-[88vh] max-w-[92vw]"
          />
        ) : (
          <Image
            src={active.src}
            alt={active.alt}
            width={2400}
            height={2400}
            sizes="92vw"
            className="h-auto max-h-[88vh] w-auto max-w-[92vw] object-contain"
          />
        )}
      </div>

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
      {dir === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}
