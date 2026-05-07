// Server-only — reads the public/{slug}-creative/gallery folder at build time.
// Only call from React Server Components / route handlers.

import { readdirSync } from "node:fs";
import path from "node:path";

const IMG = /\.(png|jpe?g|gif|webp|avif|mp4|webm|mov|m4v)$/i;

export function readGallery(slug: string): string[] {
  const dir = path.join(
    process.cwd(),
    "public",
    `${slug}-creative`,
    "gallery",
  );
  try {
    return readdirSync(dir)
      .filter((f) => IMG.test(f) && !f.startsWith("."))
      .sort()
      .map((f) => `/${slug}-creative/gallery/${f}`);
  } catch {
    return [];
  }
}
