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
  // When true, ProductCard links inward to /brands/{caseStudySlug ?? slug}
  // instead of the external `url`.
  caseStudy?: boolean;
  caseStudySlug?: string;
};

// Apps & SaaS — software the studio builds and ships.
export const products: Product[] = [
  {
    slug: "disenio-studio",
    name: "disenio.studio",
    tagline: "A design toolkit with a feel.",
    description:
      "A copy-paste component library you can re-skin in seconds. Pick a feel, choose an accent, share the URL — the whole site re-tunes around it.",
    url: "https://disenio.studio",
    urlLabel: "disenio.studio",
    status: "Beta",
    year: "2026",
    tags: ["design", "components"],
    image: "/disenio-studio/disenio-studio-hero.png",
    imageAlt: "disenio.studio — a design toolkit with a feel",
  },
  {
    slug: "nobentcorners-store",
    name: "nobentcorners.store",
    tagline: "TODO: one-line tagline.",
    description:
      "TODO: short paragraph describing what nobentcorners.store does and who it's for.",
    url: "https://nobentcorners.store",
    urlLabel: "nobentcorners.store",
    status: "Beta",
    year: "2026",
    tags: ["TODO"],
  },
];

// Creative brands — online stores and identities the studio runs.
export const brands: Product[] = [
  {
    slug: "what-the-fuzz",
    name: "What The Fuzz?",
    tagline: "Handmade fuzzy-wire floral arrangements.",
    description:
      "A handmade floral brand offering long-lasting alternatives to traditional flowers — concept, social storytelling, and made-to-order operations.",
    url: "/brands/what-the-fuzz",
    urlLabel: "View case study",
    status: "Beta",
    year: "2026",
    tags: ["brand", "shop"],
    caseStudy: true,
    caseStudySlug: "what-the-fuzz",
    image: "/what-the-fuzz-creative/thumbnail.png",
    imageAlt: "What The Fuzz? — handmade fuzzy-wire floral arrangements",
  },
  {
    slug: "nobentcorners-collectibles",
    name: "No Bent Corners Collectibles",
    tagline: "TCG collectibles brand — buy, sell, trade.",
    description:
      "A trading card collectibles brand focused on quality, authenticity, and mint-condition standards.",
    url: "/brands/no-bent-corners",
    urlLabel: "View case study",
    status: "Beta",
    year: "2026",
    tags: ["brand", "shop"],
    caseStudy: true,
    caseStudySlug: "no-bent-corners",
    image: "/no-bent-corners-creative/thumbnail.png",
    imageAlt: "No Bent Corners Collectibles — TCG brand",
  },
];
