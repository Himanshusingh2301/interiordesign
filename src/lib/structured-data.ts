/**
 * JSON-LD structured data builders. Each function returns a plain object
 * meant to be emitted as <script type="application/ld+json">.
 *
 * Keep these as plain JSON-shaped objects (no class instances) so they
 * serialize cleanly with JSON.stringify.
 */

type Json = Record<string, unknown>;

function compact(obj: Json): Json {
  const out: Json = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    out[key] = value;
  }
  return out;
}

function toE164Phone(phone: string | undefined, defaultCountry = "+1"): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("+")) return digits;
  return `${defaultCountry}${digits.replace(/^1/, "")}`;
}

export interface LocalBusinessInput {
  name: string;
  url: string;
  description?: string;
  telephone?: string;
  email?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
  streetAddress?: string;
  postalCode?: string;
  areaServed?: string[];
  priceRange?: string;
  sameAs?: string[];
  /** e.g. ["Mo-Sa 08:00-18:00"] */
  openingHours?: string[];
  /** Extra schema.org types, e.g. HomeAndConstructionBusiness */
  additionalTypes?: string[];
  image?: string;
}

export function localBusinessSchema(input: LocalBusinessInput): Json {
  const address = compact({
    "@type": "PostalAddress",
    streetAddress: input.streetAddress,
    addressLocality: input.addressLocality,
    addressRegion: input.addressRegion,
    postalCode: input.postalCode,
    addressCountry: input.addressCountry ?? "US",
  });

  const businessType =
    input.additionalTypes && input.additionalTypes.length > 0
      ? ["LocalBusiness", ...input.additionalTypes]
      : "LocalBusiness";

  return compact({
    "@context": "https://schema.org",
    "@type": businessType,
    "@id": `${input.url.replace(/\/$/, "")}/#business`,
    name: input.name,
    url: input.url,
    description: input.description,
    telephone: toE164Phone(input.telephone),
    email: input.email,
    image: input.image,
    ...(Object.keys(address).length > 1 ? { address } : {}),
    areaServed: input.areaServed,
    priceRange: input.priceRange,
    sameAs: input.sameAs,
    openingHours: input.openingHours,
  });
}

export interface ServiceSchemaInput {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  areaServed?: string[];
  provider: {
    name: string;
    url: string;
    /** Reuse the same @id used for LocalBusiness so they cross-reference. */
    id?: string;
  };
}

export function serviceSchema(input: ServiceSchemaInput): Json {
  const provider = compact({
    "@type": "LocalBusiness",
    "@id": input.provider.id,
    name: input.provider.name,
    url: input.provider.url,
  });

  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: input.url,
    areaServed: input.areaServed,
    provider,
  });
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]): Json | null {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbListSchema(items: BreadcrumbItem[]): Json | null {
  if (!items || items.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
