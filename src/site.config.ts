/**
 * Single source of truth for everything site-specific.
 *
 * To spin up a new site from this template:
 *   1. Update the values in this file.
 *   2. Replace the JSON files under src/content/.
 *   3. Replace any logos / icons inside Navbar.astro and SiteFooter.astro.
 *   4. Drop the new Google Search Console verification file into public/.
 *   5. Run `npm run build` — robots.txt and sitemap.xml regenerate automatically.
 *
 * Anything that doesn't change between sites belongs in src/sections/ or
 * src/layouts/, not here.
 */
export const siteConfig = {
  /** Canonical URL of the production site. No trailing slash. */
  url: "https://atlantaleakdetection.vercel.app",

  /**
   * When false: every HTML page emits `noindex, nofollow`, JSON-LD is omitted,
   * robots.txt blocks all crawlers, and sitemap is empty. Flip to true when
   * the site is ready for Google. Override per deploy with `PUBLIC_ALLOW_INDEXING`.
   */
  allowIndexing: false,

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

/** Convenience: canonical URL with trailing slash for href construction. */
export const siteOrigin = `${siteConfig.url}/`;

/** Stable @id used to cross-reference LocalBusiness across pages. */
export const businessJsonLdId = `${siteConfig.url}/#business`;
