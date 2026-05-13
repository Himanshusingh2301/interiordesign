/**
 * Build-time generator for public/sitemap.xml and public/robots.txt.
 *
 * Runs automatically before `astro build` (see `prebuild` in package.json).
 * Pulls the site URL from src/site.config.ts and enumerates routes by
 * scanning the filesystem — no manual sitemap edits needed when you add
 * new pages or service JSON files.
 */
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { siteConfig } from "../src/site.config.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const baseUrl = siteConfig.url.replace(/\/$/, "");

/** Static `.astro` pages under src/pages/, excluding dynamic + error routes. */
function listStaticPages(): string[] {
  return readdirSync(resolve(root, "src/pages"))
    .filter((f) => /\.astro$/.test(f))
    .filter((f) => !f.startsWith("[") && f !== "404.astro")
    .map((f) => f.replace(/\.astro$/, ""));
}

/** Slugs from src/content/services/*.json — one per dynamic service page. */
function listServiceSlugs(): string[] {
  try {
    return readdirSync(resolve(root, "src/content/services"))
      .filter((f) => /\.json$/.test(f))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

function buildUrlList(): string[] {
  const urls = new Set<string>();
  urls.add(`${baseUrl}/`);

  for (const page of listStaticPages()) {
    if (page === "index") continue;
    urls.add(`${baseUrl}/${page}/`);
  }

  for (const slug of listServiceSlugs()) {
    urls.add(`${baseUrl}/${slug}/`);
  }

  return Array.from(urls);
}

function writeSitemap(urls: string[]) {
  const body = urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  const outPath = resolve(root, "public/sitemap.xml");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, xml, "utf8");
  return outPath;
}

function writeRobots() {
  const txt = `# ${baseUrl}/
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
  const outPath = resolve(root, "public/robots.txt");
  writeFileSync(outPath, txt, "utf8");
  return outPath;
}

const urls = buildUrlList();
const sitemapPath = writeSitemap(urls);
const robotsPath = writeRobots();

console.log(`Generated ${sitemapPath} (${urls.length} URLs)`);
console.log(`Generated ${robotsPath}`);
