import { SITE_URL_FALLBACK } from "../site.config";

/**
 * Production site origin with **no** trailing path (e.g. `https://example.com`).
 *
 * Single source of truth order:
 * 1. `PUBLIC_SITE_URL` — set in `.env` locally or Vercel Environment Variables
 * 2. `SITE_URL_FALLBACK` in `src/site.config.ts`
 *
 * Use this for sitemap, robots, JSON-LD `@id`, and anywhere the deployed hostname
 * must match Vercel without editing JSON files.
 */
export function resolveSiteUrl(): string {
  let raw = "";
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof import.meta.env.PUBLIC_SITE_URL === "string"
  ) {
    raw = import.meta.env.PUBLIC_SITE_URL.trim();
  }
  if (!raw && typeof process !== "undefined" && process.env.PUBLIC_SITE_URL) {
    raw = process.env.PUBLIC_SITE_URL.trim();
  }
  if (!raw) return SITE_URL_FALLBACK;

  try {
    const withProto = raw.includes("://") ? raw : `https://${raw}`;
    const u = new URL(withProto);
    return `${u.protocol}//${u.host}`;
  } catch {
    return raw.replace(/\/$/, "");
  }
}

/** Trailing slash, for `new URL("/path", origin)` fallbacks when `Astro.site` is null. */
export function siteOriginHref(): string {
  return `${resolveSiteUrl()}/`;
}

export function businessJsonLdIdHref(): string {
  return `${resolveSiteUrl()}/#business`;
}
