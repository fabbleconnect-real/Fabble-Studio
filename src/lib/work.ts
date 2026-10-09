// Portfolio content for the Work section. Files live in /public/media/reels.
// Each reel has: reel-N.mp4 (full quality, sound), reel-N-preview.mp4 (8s muted loop), reel-N-poster.jpg.
export const reels = [
  { id: 1, title: "Before and after", kind: "Talking head", duration: "0:51" },
  { id: 2, title: "Creator promo", kind: "Social edit", duration: "0:32" },
  { id: 3, title: "Studio session", kind: "Podcast cut", duration: "0:33" },
  { id: 4, title: "Story with motion", kind: "Motion graphics", duration: "0:38" },
  { id: 5, title: "Local business ad", kind: "Ad creative", duration: "1:25" },
] as const;

export type Reel = (typeof reels)[number];

export const reelSrc = (id: number) => ({
  full: `/media/reels/reel-${id}.mp4`,
  preview: `/media/reels/reel-${id}-preview.mp4`,
  poster: `/media/reels/reel-${id}-poster.jpg`,
});

// Website projects. `image` is a full-page screenshot (1440px wide works best) in /public/media/sites.
// It scrolls inside the browser frame on hover. Without one, a styled mock is shown.
export type SiteProject = {
  name: string;
  category: string;
  year: string;
  url?: string;
  image?: string;
  summary: string;
  tags: string[];
  accent: string; // r,g,b
};

export const sites: SiteProject[] = [
  {
    name: "Geo Builders",
    category: "Construction company website",
    year: "2026",
    // TODO: add `url` once the live link is known
    image: "/media/sites/geo-builders.webp",
    summary: "A site for a Southern Ontario builder: services, before-and-after project stories, a five-step process and a quote request on every page.",
    tags: ["Design", "Development", "Construction"],
    accent: "255,106,44",
  },
  {
    name: "Neel",
    category: "Online store",
    year: "2026",
    // TODO: add `url` once the store is live
    image: "/media/sites/neel.webp",
    summary: "A cotton tee store with shop-by-fit browsing, search and filters, colour swatches, and UPI, card or netbanking checkout.",
    tags: ["E-commerce", "Design", "Development"],
    accent: "79,93,255",
  },
];
