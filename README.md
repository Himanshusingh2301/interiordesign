# Site template — JSON-driven Astro + Tailwind

A reusable static-site template designed to spin up new SEO-optimized
business sites by editing **one config file plus a few JSON files**.

- **Framework**: Astro (static, zero client-side JS)
- **Styling**: Tailwind CSS v4 with brand color tokens
- **Content**: JSON files validated with Zod schemas
- **SEO**: meta tags, canonical URLs, JSON-LD (LocalBusiness, Service, FAQ,
  Breadcrumb), auto-generated sitemap & robots.txt
- **Performance**: hero LCP preload, lazy images, intrinsic dimensions
  (CLS = 0)
- **Optional AI content pipeline**: convert a `.docx` document into a
  schema-validated `home.json` using OpenAI

## Project structure

```text
/
├── public/
│   ├── robots.txt           # auto-generated from siteConfig
│   ├── sitemap.xml          # auto-generated from routes
│   └── google*.html         # optional: Search Console file verification
├── scripts/
│   ├── build-sitemap.ts     # runs as `prebuild`; emits sitemap + robots
│   └── content-ai.ts        # optional: docx -> AI -> home.json
├── src/
│   ├── content/
│   │   ├── pages/           # home.json, about.json
│   │   ├── services/        # one JSON per service (slug.json)
│   │   └── schemas.ts       # Zod schemas
│   ├── layouts/
│   │   └── Layout.astro     # SEO head + JSON-LD injection
│   ├── lib/
│   │   ├── structured-data.ts  # JSON-LD builders
│   │   ├── site-url.ts         # PUBLIC_SITE_URL + SITE_URL_FALLBACK
│   │   └── indexing.ts         # allowIndexing + PUBLIC_ALLOW_INDEXING
│   ├── pages/
│   │   ├── index.astro      # home page
│   │   ├── about.astro      # about page
│   │   ├── 404.astro
│   │   └── [service].astro  # dynamic route, one page per services/*.json
│   ├── sections/            # reusable Astro section components
│   ├── styles/
│   │   └── global.css       # Tailwind import + brand color tokens
│   └── site.config.ts       # **single source of truth for site identity**
└── astro.config.mjs
```

## Commands

| Command            | Action                                                   |
| :----------------- | :------------------------------------------------------- |
| `npm install`      | Install dependencies                                     |
| `npm run dev`      | Local dev server at `localhost:4321`                     |
| `npm run build`    | Production build (auto-regenerates sitemap + robots)     |
| `npm run preview`  | Preview the production build locally                     |
| `npm run sitemap`  | Regenerate `public/sitemap.xml` + `public/robots.txt`    |
| `npm run content:ai` | Generate `home.json` from a `.docx` via OpenAI         |

## Controlling search indexing (staging vs live)

When a site is not ready for Google, block indexing in one of two ways:

1. **Config file** — in `src/site.config.ts`, set `allowIndexing: false`.
   Every page then gets `<meta name="robots" content="noindex, nofollow">`,
   JSON-LD is not emitted, `robots.txt` uses `Disallow: /`, and the sitemap is
   empty. Set back to `true` when you are ready, then rebuild and deploy.

2. **Environment variable** (good for Vercel) — set
   `PUBLIC_ALLOW_INDEXING=false` on Preview deployments and
   `PUBLIC_ALLOW_INDEXING=true` (or omit) on Production. This overrides
   `siteConfig.allowIndexing` at build time for that deploy only.

`npm run dev` reads `.env` if you add `PUBLIC_ALLOW_INDEXING=false` there.

**Note:** `noindex` is the reliable way to keep pages out of Google.
`robots.txt Disallow` does not guarantee non-indexing if other sites link to
your URL; the meta tag + no JSON-LD is what matters once a crawler fetches
the page.

Per-page opt-out still works: pass `noindex: true` in page JSON meta (e.g.
the 404 page). That stays in effect even when the site is indexable.

## Public site URL (`PUBLIC_SITE_URL`)

Canonical links, Open Graph URLs, `astro.config` `site`, sitemap, robots, and
JSON-LD business `@id` all follow **one** value:

1. **`PUBLIC_SITE_URL`** in `.env` (local) or **Vercel → Environment Variables**
   (e.g. `https://your-project.vercel.app`) — **no trailing path**.
2. If unset: **`SITE_URL_FALLBACK`** in `src/site.config.ts`.

Set `PUBLIC_SITE_URL` on Vercel for Production so a new `*.vercel.app` or
custom domain never needs editing JSON. Page JSON **does not** store
`canonical` anymore; it is always derived from this URL + current path.

## Spinning up a new site from this template

The checklist for cloning this repo into a new brand:

### 1. Edit `src/site.config.ts`

This is the **only** place to edit site-wide defaults. Update:

- `SITE_URL_FALLBACK` — used when `PUBLIC_SITE_URL` is not set (template default hostname)
- `allowIndexing` — set `false` while the site is staging; `true` when live
  (or use `PUBLIC_ALLOW_INDEXING` in `.env` / Vercel instead)
- `business.name`, `shortName`
- `business.addressLocality`, `addressRegion`, `addressCountry`
- `business.streetAddress`, `postalCode` (optional)
- `business.areaServed` — array of service regions
- `business.openingHours` — schema.org format (`"Mo-Sa 08:00-18:00"`)
- `business.priceRange` — `"$"`, `"$$"`, `"$$$"`, `"$$$$"`

`astro.config.mjs`, JSON-LD builders, and the sitemap generator resolve the
live hostname via `src/lib/site-url.ts`. Prefer **`PUBLIC_SITE_URL`** on Vercel
over editing fallbacks. **Do not edit** `public/robots.txt` or
`public/sitemap.xml` by hand.

### 2. Replace JSON content

- `src/content/pages/home.json` — home page sections
- `src/content/pages/about.json` — about page sections
- `src/content/services/*.json` — one file per service. The filename
  (minus `.json`) becomes the URL slug. New file → new page,
  automatically routed and added to the sitemap.

Optional: run `npm run content:ai -- --doc path/to/file.docx` to fill
`home.json` from a Word document via OpenAI (requires `.env` with
`OPENAI_API_KEY`).

### 3. Re-skin the brand color (optional)

Edit `src/styles/global.css` and change the `--color-brand*` tokens in
the `@theme` block:

```css
@theme {
  --color-brand: #e89938;
  --color-brand-hover: #d98730;
  --color-brand-tint: #fff7ec;
  /* ... */
}
```

Every section component picks up the new color automatically.

### 4. Update logos / icons (optional)

The SVG logos live inline inside:

- `src/sections/Navbar.astro`
- `src/sections/SiteFooter.astro`

Replace the `<svg>` blocks with the new brand's mark.

### 5. Verify Google Search Console (HTML file — recommended)

1. In [Search Console](https://search.google.com/search-console), open your property
   (URL must match production, e.g. `https://yoursite.vercel.app`).
2. **Settings → Ownership verification → HTML file** → **Download** the file.
   Do not rename it or change the one line inside.
3. Copy that file into this repo’s **`public/`** folder (same name as downloaded).
4. Deploy. In a private/incognito window, open  
   `https://your-site/<exact-filename>.html` — you should see one line like  
   `google-site-verification: google….html`.
5. In Search Console, click **Verify**.

Astro copies everything in `public/` to the site root, so no extra config is needed.

**HTML tag (optional):** set `PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel / `.env`
to the meta tag `content` value only, then redeploy.

### 6. Build + deploy

```sh
npm install
npm run build
```

`sitemap.xml` and `robots.txt` regenerate automatically as part of
`prebuild`. Deploy `dist/` to Vercel (or any static host).

### 7. Submit the sitemap to Google Search Console

After deploy, in Search Console: **Sitemaps → Add new sitemap →
`sitemap.xml`**.

## What does **NOT** change between sites

- `src/sections/*.astro` — reusable components
- `src/layouts/Layout.astro` — SEO scaffolding
- `src/content/schemas.ts` — Zod schemas
- `src/lib/structured-data.ts` — JSON-LD builders
- `src/pages/*.astro` — routing & section composition (only edit if you
  want a different section order or new dynamic routes)
- `scripts/*` — build tooling

## SEO features included

- Canonical URLs, `<title>`, meta description, Open Graph, Twitter Card
- `noindex` per-page opt-out
- `<link rel="preload">` on hero LCP image
- Width/height on all images (CLS = 0)
- `loading="lazy"` on below-fold images
- JSON-LD: `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`
- Auto-generated `sitemap.xml` and `robots.txt`
- Custom 404 page with `noindex`

PageSpeed Insights desktop baseline: Performance 100, Accessibility 96,
Best Practices 100, SEO 100.
