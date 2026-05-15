import { siteConfig } from "../site.config";

/**
 * Whether search engines may index this deployment.
 *
 * Priority:
 * 1. `PUBLIC_ALLOW_INDEXING` env (Vercel / .env) — "true" | "false"
 * 2. `siteConfig.allowIndexing` in src/site.config.ts
 *
 * Use env on Vercel: set Production = true, Preview = false so preview URLs
 * never get indexed without editing code.
 */
export function isIndexingAllowed(): boolean {
  const raw = import.meta.env.PUBLIC_ALLOW_INDEXING;
  if (typeof raw === "string") {
    const v = raw.trim().toLowerCase();
    if (v === "false" || v === "0" || v === "no") return false;
    if (v === "true" || v === "1" || v === "yes") return true;
  }
  return siteConfig.allowIndexing;
}
