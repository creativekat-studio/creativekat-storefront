// Server-only — reads /public/{folder}/gallery at build time.
// Only call from React Server Components / route handlers.

import { readdirSync } from "node:fs";
import path from "node:path";

const IMG = /\.(png|jpe?g|gif|webp|avif|mp4|webm|mov|m4v)$/i;

/**
 * Resolves the asset folder for a slug. Defaults to "{slug}-creative".
 * Pass `folder` to override (e.g. "no-bent-corners-store").
 */
export function readGallery(slug: string, folder?: string): string[] {
  const dirName = folder ?? `${slug}-creative`;
  const dir = path.join(process.cwd(), "public", dirName, "gallery");
  try {
    return readdirSync(dir)
      .filter((f) => IMG.test(f) && !f.startsWith("."))
      .sort()
      .map((f) => `/${dirName}/gallery/${f}`);
  } catch {
    return [];
  }
}
