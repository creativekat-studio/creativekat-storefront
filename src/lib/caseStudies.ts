export type CaseStudyFeature = {
  label: string;
  body: string;
  image?: string;
};

export type CaseStudySection = {
  heading: string;
  paragraphs?: string[];
  media?: string[];
  /** When set, renders a feature grid below any paragraphs. */
  features?: CaseStudyFeature[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** Free-form status pill displayed in the hero (e.g. "Beta · Live"). */
  status?: string;
  liveUrl?: string;
  liveUrlNote?: string;
  /** Override label for the live-URL CTA (default: "Visit Social Media"). */
  liveUrlLabel?: string;
  /**
   * Override the public folder used for gallery auto-discovery and the
   * default brand system description hint. Defaults to "{slug}-creative".
   */
  assetFolder?: string;
  meta: {
    role: string;
    timeline: string;
    /** Stack items rendered as-is; placeholder strings allowed. */
    stack: string[];
  };
  summary: string;
  /** Brand system block is optional — omit for product/engineering case studies. */
  brandSystem?: {
    description: string;
    typography: { name: string; role: string; fontFamily: string }[];
    colors: { name: string; hex: string }[];
  };
  sections: CaseStudySection[];

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

  {
    slug: "no-bent-corners-storefront",
    title: "nobentcorners.store",
    description:
      "TCG vendor site — inventory, pricelists, and buy/sell/trade tagging — built so any vendor can run their own branded shop on the same platform.",
    tags: ["Commerce", "Inventory tool", "White-label"],
    status: "Beta · Live",
    liveUrl: "https://nobentcorners.store",
    liveUrlLabel: "Visit live",
    liveUrlNote: "refresh in progress",
    assetFolder: "no-bent-corners-store",
    meta: {
      role: "Founder • product • engineering",
      timeline: "2023 — Present (refresh in progress)",
      // Stack placeholders — replace with actual entries (Next.js / Stripe / Postgres / etc.)
      stack: ["Stack item 01", "Stack item 02", "Stack item 03"],
    },
    summary:
      "A live TCG vendor site engineered and operated for No Bent Corners Collectibles. Inventory management, pricelists, and a buy / sell / trade tagging system built from the ground up — and packaged so any vendor in the space can run their own branded shop on the same platform. Currently in beta; refresh in progress.",
    sections: [
      {
        heading: "The problem",
        paragraphs: [
          "TCG vendors juggle spreadsheets, multiple marketplaces, and ad-hoc DM negotiations — there's no single tool that handles inventory, condition grading, and buy/sell/trade flow under one roof, branded as their own shop.",
        ],
      },
      {
        heading: "What No Bent Corners does",
        features: [
          {
            label: "Inventory & pricelists",
            body: "Single source of truth for stock, condition, and price across listings.",
          },
          {
            label: "Buy / Sell / Trade tagging",
            body: "Every card carries a BST status, so the site supports the three-way flow vendors actually run, not just retail.",
          },
          {
            label: "Mint-condition standard",
            body: "Grading and authenticity built into the listing process so trust signals are automatic.",
          },
          {
            label: "White-label architecture",
            body: "Any vendor can spin up their own branded instance of the same engine.",
          },
        ],
      },
      {
        heading: "Highlights",
        paragraphs: [
          "Catalog, product detail, inventory admin, BST flow, and mobile views — drop screenshots into /public/no-bent-corners-store/gallery/ and they auto-populate the gallery below.",
        ],
      },
      {
        heading: "What's next",
        paragraphs: [
          "Refresh is in progress — refining the catalog UX, expanding inventory tools, and packaging the engine so additional vendors can launch their own branded shops on the same platform.",
        ],
      },
    ],
    heroImage: "/no-bent-corners-store/featured.mov",
  },

  {
    slug: "hobby-arena",
    title: "Hobby Arena",
    description:
      "Custom online store for a Philippine TCG retailer — storefront, pre-orders, customer accounts, and admin — live on hobbyarena.ph.",
    tags: ["Commerce", "Client work", "TCG"],
    status: "Live",
    liveUrl: "https://www.hobbyarena.ph",
    liveUrlLabel: "Visit live",
    assetFolder: "hobby-arena",
    meta: {
      role: "Design • engineering",
      timeline: "Jun – Jul 2026",
      stack: ["React", "Vercel", "Firebase", "Resend"],
    },
    summary:
      "A custom online store for Hobby Arena Marketing Corporation — sealed TCG products, pre-order flows with deposit scheduling, customer accounts, and an admin panel for catalog and order management. Designed and built end-to-end, then launched on hobbyarena.ph.",
    sections: [
      {
        heading: "The brief",
        paragraphs: [
          "Hobby Arena needed a store that matched how TCG retail actually runs in the Philippines: sealed product drops, pre-orders below SRP, account-based shopping, and an admin side that could keep catalog and orders moving without a patchwork of spreadsheets and DMs.",
        ],
      },
      {
        heading: "What shipped",
        features: [
          {
            label: "Storefront & catalog",
            body: "Dark, drop-led shopping experience with brand browsing, in-stock sealed products, and featured pre-order highlights.",
          },
          {
            label: "Pre-order flow",
            body: "Coming-soon drops with split payment cues (deposit now / balance later) so collectors can lock in sets before they sell out.",
          },
          {
            label: "Customer accounts",
            body: "Account access for browsing, ordering, and returning customers — built into the same storefront shell.",
          },
          {
            label: "Admin dashboard",
            body: "Live sales overview, orders, customers, inventory, classifications, CMS, and email tools — so ops stay in one place after launch.",
          },
        ],
      },
      {
        heading: "Launch",
        paragraphs: [
          "Shipped to production on hobbyarena.ph after phased delivery — foundation and preview first, then go-live with DNS, third-party services, and client sign-off.",
        ],
      },
    ],
    heroImage: "/hobby-arena/featured.mp4",
    thumbnail: "/hobby-arena/thumbnail.jpg",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
