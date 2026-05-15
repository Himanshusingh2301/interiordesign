/**
 * Single source of truth for everything site-specific **except** the public
 * hostname — that comes from `PUBLIC_SITE_URL` (see `src/lib/site-url.ts`).
 *
 * To spin up a new site from this template:
 *   1. Set `PUBLIC_SITE_URL` in `.env` or Vercel (see `.env.example`).
 *   2. Set `SITE_URL_FALLBACK` below (used when env is unset, e.g. clone CI).
 *   3. Update business fields in this file.
 *   4. Replace JSON under `src/content/`.
 *   5. Replace logos in `Navbar.astro` and `SiteFooter.astro` if needed.
 *   6. Add Google Search Console HTML file to `public/` when ready.
 *   7. Run `npm run build` — robots.txt and sitemap.xml regenerate automatically.
 */

/** Used when `PUBLIC_SITE_URL` is not set (local dev without `.env`, etc.). */
export const SITE_URL_FALLBACK = "https://atlantaleakdetection02.vercel.app";

export const siteConfig = {
  /**
   * When false: every HTML page emits `noindex, nofollow`, JSON-LD is omitted,
   * robots.txt blocks all crawlers, and sitemap is empty. Override per deploy
   * with `PUBLIC_ALLOW_INDEXING`.
   */
  allowIndexing: true,

  /** Default <html lang> attribute for every page. */
  lang: "en",

  /** Business identity — flows into JSON-LD LocalBusiness/Service schemas. */
  business: {
    name: "Atlanta Leak Detection Pros",
    shortName: "Atlanta Leak Detection",
    /** Two-letter address country code used by schema.org PostalAddress. */
    addressCountry: "US",
    /** City the business is based in. */
    addressLocality: "Atlanta",
    /** Two-letter US state code or full region name. */
    addressRegion: "GA",
    /** Optional — leave blank if you only want city/region. */
    streetAddress: "",
    postalCode: "",
    /** Regions/cities served. Powers Service.areaServed JSON-LD. */
    areaServed: ["Atlanta, GA", "Metro Atlanta"],
    /** Schema.org openingHours format: "Mo-Sa 08:00-18:00". */
    openingHours: ["Mo-Sa 08:00-18:00"],
    /** "$", "$$", "$$$", "$$$$". */
    priceRange: "$$",
  },
} as const;
