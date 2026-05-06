export type LogEntry = {
  date: string; // ISO YYYY-MM-DD
  product: "creativekat" | "disenio.studio" | "studio";
  title: string;
  note?: string;
};

// Newest first. Add an entry whenever something ships, breaks, or changes.
export const buildLog: LogEntry[] = [
  {
    date: "2026-05-06",
    product: "creativekat",
    title: "Storefront online.",
    note: "First version — products list, inquiry form, build log.",
  },
  {
    date: "2026-05-04",
    product: "disenio.studio",
    title: "Accent tokens shipped.",
    note: "Pick a feel, share a URL, the whole site re-tunes around it.",
  },
  {
    date: "2026-04-28",
    product: "disenio.studio",
    title: "Broke the type scale, fixed it the next morning.",
    note: "A reminder to keep contrast tests in CI.",
  },
  {
    date: "2026-04-18",
    product: "studio",
    title: "creativekat namespace registered.",
    note: "Gave the experiments a home.",
  },
];
