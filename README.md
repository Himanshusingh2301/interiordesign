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
│   └── google*.html         # Search Console verification (manual)
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
│   │   └── structured-data.ts  # JSON-LD builders
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

## Spinning up a new site from this template

The checklist for cloning this repo into a new brand:

### 1. Edit `src/site.config.ts`

This is the **only** place to edit site-wide identity. Update:

- `url` — production URL (e.g. `https://newsite.vercel.app`)
- `business.name`, `shortName`
- `business.addressLocality`, `addressRegion`, `addressCountry`
- `business.streetAddress`, `postalCode` (optional)
- `business.areaServed` — array of service regions
- `business.openingHours` — schema.org format (`"Mo-Sa 08:00-18:00"`)
- `business.priceRange` — `"$"`, `"$$"`, `"$$$"`, `"$$$$"`

`astro.config.mjs`, JSON-LD schemas, the sitemap generator, and
`robots.txt` all read from this file. **Do not edit them by hand**.

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

### 5. Drop the Google Search Console verification file in `public/`

Download the HTML verification file from Search Console and place it in
`public/`. It will be served verbatim.

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
