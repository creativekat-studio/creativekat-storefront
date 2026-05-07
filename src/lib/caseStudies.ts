export type CaseStudy = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  liveUrlNote?: string;
  meta: {
    role: string;
    timeline: string;
    stack: string[];
  };
  summary: string;
  brandSystem: {
    description: string;
    typography: { name: string; role: string; fontFamily: string }[];
    colors: { name: string; hex: string }[];
  };
  sections: {
    heading: string;
    paragraphs: string[];
    media?: string[];
  }[];

  // All asset fields are optional — the page renders placeholder slots
  // when missing. Wire real assets by setting paths here, e.g.:
  // heroImage: "/what-the-fuzz-creative/thumbnail.png"
  heroImage?: string;
  thumbnail?: string;
  logoLight?: string;
  logoDark?: string;
  /** Scale multiplier for the logo display (e.g. 1.1 for 10% larger). */
  logoScale?: number;
  gallery?: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "what-the-fuzz",
    title: "What The Fuzz?",
    description:
      "Handmade floral brand — fuzzy wire arrangements, social storytelling, and made-to-order operations.",
    tags: ["Concept & brand"],
    liveUrl:
      "https://www.facebook.com/people/What-The-Fuzz-Florals-and-Craft/61586673336837/",
    meta: {
      role: "Brand • operations • marketing",
      timeline: "Founder / creative",
      stack: ["Product design", "Social campaigns", "Order workflows"],
    },
    summary:
      "A handmade floral brand specializing in fuzzy wire arrangements, created to offer long-lasting alternatives to traditional flowers. I managed the concept design, order management, and social media marketing — combining creativity with practical execution to deliver personalized, made-to-order pieces.",
    brandSystem: {
      description:
        "Soft, playful identity for a handmade fuzzy-wire floral brand — script wordmark + warm cream/magenta palette so every surface (packaging, social, order receipts) reads as one craft-shop voice.",
      typography: [
        {
          name: "American Typewriter Medium",
          role: "Wordmark / supporting",
          fontFamily: "'American Typewriter', 'Courier New', monospace",
        },
      ],
      colors: [
        { name: "Brand magenta", hex: "#a01b3d" },
        { name: "Cream", hex: "#f7eee8" },
        { name: "Soft pink", hex: "#f3a6c7" },
        { name: "Ink", hex: "#000000" },
      ],
    },
    sections: [
      {
        heading: "Social media campaigns",
        paragraphs: [
          "Focused on showcasing handcrafted arrangements, promoting customization options, and driving engagement through product storytelling and visually consistent branding.",
          "Story templates, drop announcements, and seasonal hero posts (Valentine's Day, Order Now, Bouquets, Order Today) all keep the same script wordmark, cream/magenta palette, and bouquet styling — so a single shoot can be cut into a week of content without losing brand tone.",
        ],
      },
    ],
    logoLight: "/what-the-fuzz-creative/logo-light.png",
    logoDark: "/what-the-fuzz-creative/logo-dark.png",
  },

  {
    slug: "no-bent-corners",
    title: "No Bent Corners Collectibles",
    description:
      "TCG collectibles brand — buying, selling, and trading with emphasis on quality and mint-condition standards.",
    tags: ["Concept & brand"],
    liveUrl:
      "https://www.facebook.com/people/No-Bent-Corners-Collectibles/61552187459448/",
    meta: {
      role: "Founder • brand",
      timeline: "Brand build",
      stack: ["Brand identity", "Packaging", "Social content"],
    },
    summary:
      "A trading card collectibles brand built and operated, focused on buying, selling, and trading TCG products with a strong emphasis on quality, authenticity, and mint-condition standards.",
    brandSystem: {
      description:
        "Visual system anchored in serious-collector cues — sharp wordmark, restrained palette, and disciplined typography that reads as trust the moment you see it.",
      typography: [
        {
          name: "Bai Jamjuree Extra Light",
          role: "Body / supporting",
          fontFamily: "'Bai Jamjuree', system-ui, sans-serif",
        },
        {
          name: "Bai Jamjuree Semi Bold",
          role: "Headlines / wordmark",
          fontFamily: "'Bai Jamjuree', system-ui, sans-serif",
        },
      ],
      colors: [
        { name: "Off-white", hex: "#fefefe" },
        { name: "Deep Navy", hex: "#010033" },
        { name: "Ink", hex: "#020204" },
        { name: "Black", hex: "#000000" },
      ],
    },
    sections: [
      {
        heading: "Brand & community",
        paragraphs: [
          "A TCG-focused collectibles operation with strict standards for authenticity and mint condition — presentation and packaging had to signal trust immediately.",
          "Social and promo content highlighted drops and availability while keeping the voice aligned with serious collectors, not generic retail noise.",
        ],
      },
      {
        heading: "Brand identity",
        paragraphs: [
          "Identity assets — logo lockups, packaging marks (Mystery Pack, Treasure Pack), and \"Buy / Sell / Trade\" merch graphics — built around a single visual rule set so every touchpoint reads as one brand.",
        ],
      },
      {
        heading: "Social media campaigns",
        paragraphs: [
          "Content and promotional visuals designed to highlight product availability and engage the collector community across platforms (Instagram, Facebook, Reels).",
          "Campaign posts mirror the in-app feed format collectors already scroll, so the brand sits inside the conversation instead of interrupting it.",
        ],
      },
    ],
    logoLight: "/no-bent-corners-creative/logo-light.png",
    logoDark: "/no-bent-corners-creative/logo-dark.png",
    logoScale: 1.1,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
