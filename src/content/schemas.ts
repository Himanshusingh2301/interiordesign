import { z } from "zod";

/**
 * Architecture:
 *   - Per-section prop schemas define the SHAPE of each component's input.
 *   - Per-page schemas (e.g. `homePageSchema`) define which named content
 *     SLOTS a page exposes. The page file (e.g. `src/pages/index.astro`)
 *     decides which section component renders each slot and in what order.
 *
 * Adding a new section: write the .astro file + add a `*PropsSchema` here.
 * Adding a new page: create a `<page>PageSchema` listing its slots and types.
 */

/* ----------------------------- Shared building blocks ----------------------------- */

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

/* --------------------------- Section prop schemas --------------------------- */

export const navbarPropsSchema = z.object({
  logo: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      href: z.string().optional(),
    })
    .optional(),
  navItems: z
    .array(
      linkSchema.extend({
        children: z.array(linkSchema).optional(),
      }),
    )
    .optional(),
  cta: ctaSchema.optional(),
});

export const heroPropsSchema = z.object({
  heading: z.string().optional(),
  cta: ctaSchema.optional(),
  image: imageSchema.optional(),
});

export const introSplitPropsSchema = z.object({
  heading: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  image: imageSchema.optional(),
  reverse: z.boolean().optional(),
});

export const featureGridPropsSchema = z.object({
  heading: z.string().optional(),
  intro: z.string().optional(),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
});

export const aboutWithFormPropsSchema = z.object({
  heading: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  cta: ctaSchema.optional(),
  form: z
    .object({
      action: z.string().optional(),
      method: z.union([z.literal("GET"), z.literal("POST")]).optional(),
      submitLabel: z.string().optional(),
      services: z.array(z.string()).optional(),
    })
    .optional(),
});

export const servicesGridPropsSchema = z.object({
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        paragraphs: z.array(z.string()),
        image: imageSchema,
        bullets: z
          .array(
            z.object({
              label: z.string(),
              description: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

export const servicesGridLinkedPropsSchema = z.object({
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        href: z.string().optional(),
        paragraphs: z.array(z.string()),
        image: imageSchema,
        bullets: z
          .array(
            z.object({
              label: z.string(),
              description: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

export const comparisonTablePropsSchema = z.object({
  heading: z.string().optional(),
  intro: z.string().optional(),
  columns: z.tuple([z.string(), z.string(), z.string()]).optional(),
  rows: z.array(z.tuple([z.string(), z.string(), z.string()])).optional(),
  highlightColumn: z.union([z.literal(1), z.literal(2)]).optional(),
});

export const ctaBannerPropsSchema = z.object({
  heading: z.string().optional(),
  body: z.string().optional(),
  cta: ctaSchema.optional(),
  variant: z.union([z.literal("dark"), z.literal("primary")]).optional(),
});

export const benefitsListPropsSchema = z.object({
  heading: z.string().optional(),
  columns: z.union([z.literal(2), z.literal(3)]).optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
});

export const processStepsPropsSchema = z.object({
  heading: z.string().optional(),
  intro: z.string().optional(),
  steps: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
  images: z.array(imageSchema).optional(),
  reverse: z.boolean().optional(),
});

export const faqAccordionPropsSchema = z.object({
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional(),
  defaultOpenIndex: z.number().int().nonnegative().optional(),
});

export const contactCardsPropsSchema = z.object({
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        type: z.union([
          z.literal("phone"),
          z.literal("address"),
          z.literal("email"),
        ]),
        label: z.string(),
        value: z.string(),
        href: z.string().optional(),
      }),
    )
    .optional(),
});

export const sec045CardIconSchema = z.enum(["home", "location", "rupee"]);

export const sec045CardSchema = z.object({
  icon: sec045CardIconSchema,
  title: z.string(),
  description: z.string(),
});

export const sec045BusinessSchema = z.object({
  name: z.string(),
  telephone: z.string(),
  addressLocality: z.string(),
  addressRegion: z.string(),
  addressCountry: z.string().default("IN"),
  areaServed: z.array(z.string()).min(1),
  priceRange: z.string().optional(),
});

export const sec045PropsSchema = z.object({
  heading: z.string(),
  description: z.string(),
  callButton: ctaSchema,
  whatsapp: ctaSchema,
  cards: z.array(sec045CardSchema).min(1).max(3),
  images: z.object({
    main: imageSchema,
    lamp: imageSchema,
    chair: imageSchema,
  }),
  business: sec045BusinessSchema,
});

export const sec045PageMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().optional(),
});

export const sec045ContentSchema = z.object({
  meta: sec045PageMetaSchema,
  modernInteriorHero: sec045PropsSchema,
});

export type Sec045Content = z.infer<typeof sec045ContentSchema>;

export const siteFooterPropsSchema = z.object({
  logo: z
    .object({
      secondary: z.string().optional(),
      primary: z.string().optional(),
      href: z.string().optional(),
    })
    .optional(),
  tagline: z.string().optional(),
  social: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        bgClass: z.string(),
      }),
    )
    .optional(),
  servicesLinks: z.array(linkSchema).optional(),
  legalLinks: z.array(linkSchema).optional(),
  contact: z
    .object({
      phone: z.string().optional(),
      addressLines: z.array(z.string()).optional(),
      email: z.string().optional(),
    })
    .optional(),
  disclosure: z
    .object({
      heading: z.string(),
      body: z.string(),
    })
    .optional(),
});

/* ------------------------------- Page meta ------------------------------- */

export const pageMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  canonical: z.string().optional(),
  ogImage: z.string().optional(),
  noindex: z.boolean().optional(),
  lang: z.string().optional(),
});

/* ------------------------------- Home page ------------------------------- */

/**
 * The home page's content slots.
 *
 * - Slot names describe PURPOSE (whyChooseUs), not component type
 *   (featureGrid). The same component can fill different slots — e.g.
 *   `whyChooseUs` and `areasServed` are both rendered by `<FeatureGrid />`.
 * - Every content slot is OPTIONAL: the author picks which sections appear
 *   on a given page by including or omitting the slot in JSON.
 *   `index.astro` conditionally renders each section only when its slot
 *   is provided.
 */
export const homePageSchema = z.object({
  meta: pageMetaSchema,

  header: z.object({
    navbar: navbarPropsSchema.optional(),
  }),

  content: z.object({
    hero: heroPropsSchema.optional(),
    intro: introSplitPropsSchema.optional(),
    whyChooseUs: featureGridPropsSchema.optional(),
    about: aboutWithFormPropsSchema.optional(),
    services: servicesGridLinkedPropsSchema.optional(),
    proVsDiy: comparisonTablePropsSchema.optional(),
    midCta: ctaBannerPropsSchema.optional(),
    benefits: benefitsListPropsSchema.optional(),
    process: processStepsPropsSchema.optional(),
    faqs: faqAccordionPropsSchema.optional(),
    contacts: contactCardsPropsSchema.optional(),
  }),

  footer: z.object({
    siteFooter: siteFooterPropsSchema.optional(),
  }),
});

export type HomePageContent = z.infer<typeof homePageSchema>;

/* ------------------------------- About page ------------------------------ */

/**
 * The about page exposes every available section as an optional slot.
 * `about.astro` renders a section only when its slot is provided in JSON,
 * so the author chooses which sections appear by including/omitting them.
 */
export const aboutPageSchema = z.object({
  meta: pageMetaSchema,

  header: z
    .object({
      navbar: navbarPropsSchema.optional(),
    })
    .default({}),

  content: z
    .object({
      hero: heroPropsSchema.optional(),
      intro: introSplitPropsSchema.optional(),
      whyChooseUs: featureGridPropsSchema.optional(),
      about: aboutWithFormPropsSchema.optional(),
      services: servicesGridLinkedPropsSchema.optional(),
      proVsDiy: comparisonTablePropsSchema.optional(),
      midCta: ctaBannerPropsSchema.optional(),
      benefits: benefitsListPropsSchema.optional(),
      process: processStepsPropsSchema.optional(),
      faqs: faqAccordionPropsSchema.optional(),
      contacts: contactCardsPropsSchema.optional(),
    })
    .default({}),

  footer: z
    .object({
      siteFooter: siteFooterPropsSchema.optional(),
    })
    .default({}),
});

export type AboutPageContent = z.infer<typeof aboutPageSchema>;

/* ------------------------------ Service page ------------------------------ */

/**
 * One schema shared by every service page. The dynamic route
 * `src/pages/[service].astro` loads each JSON file under
 * `src/content/services/<slug>.json`, validates it with this schema,
 * and the filename becomes the URL slug (e.g. /water-leak-detection/).
 *
 * Every section slot is optional. Add a slot to a service's JSON to show
 * that section on that service page; omit it to hide.
 */
export const servicePageSchema = z.object({
  meta: pageMetaSchema,

  header: z
    .object({
      navbar: navbarPropsSchema.optional(),
    })
    .default({}),

  content: z
    .object({
      hero: heroPropsSchema.optional(),
      intro: introSplitPropsSchema.optional(),
      whyChooseUs: featureGridPropsSchema.optional(),
      about: aboutWithFormPropsSchema.optional(),
      services: servicesGridLinkedPropsSchema.optional(),
      proVsDiy: comparisonTablePropsSchema.optional(),
      midCta: ctaBannerPropsSchema.optional(),
      benefits: benefitsListPropsSchema.optional(),
      process: processStepsPropsSchema.optional(),
      faqs: faqAccordionPropsSchema.optional(),
      contacts: contactCardsPropsSchema.optional(),
    })
    .default({}),

  footer: z
    .object({
      siteFooter: siteFooterPropsSchema.optional(),
    })
    .default({}),
});

export type ServicePageContent = z.infer<typeof servicePageSchema>;
