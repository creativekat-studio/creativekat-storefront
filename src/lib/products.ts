export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  urlLabel: string;
  status: "Live" | "Beta" | "Coming soon";
  year: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
};

export const products: Product[] = [
  {
    slug: "disenio-studio",
    name: "disenio.studio",
    tagline: "A design toolkit with a feel.",
    description:
      "A copy-paste component library you can re-skin in seconds. Pick a feel, choose an accent, share the URL — the whole site re-tunes around it.",
    url: "https://disenio.studio",
    urlLabel: "disenio.studio",
    status: "Live",
    year: "2026",
    tags: ["design", "components"],
    image: "/disenio-studio/disenio-studio-hero.png",
    imageAlt: "disenio.studio — a design toolkit with a feel",
  },
];
