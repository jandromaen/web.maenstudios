import type { Metadata } from "next";

export const SITE_URL = "https://maenstudios.com";

export const SITE_NAME = "Maen Studios";

export const DEFAULT_DESCRIPTION =
  "Agencia de creación de contenido para redes sociales. Dirección creativa, producción de contenidos y community management para marcas que quieren crecer en Instagram, TikTok y YouTube.";

export const DEFAULT_KEYWORDS = [
  "agencia contenido redes sociales",
  "creación de contenido",
  "dirección creativa",
  "producción de contenidos",
  "community management",
  "contenido instagram",
  "contenido tiktok",
  "estudio audiovisual",
  "agencia social media",
  "Maen Studios",
  "agencia social media España",
  "agencia social media Barcelona",
];

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/maen.studios/",
  youtube: "https://www.youtube.com/@MaenStudios",
  linkedin: "https://www.linkedin.com/company/maen-agency",
  tiktok: "https://www.tiktok.com/@maen.studios",
};

/**
 * Datos de negocio para SEO local (schema LocalBusiness).
 * Rellena `streetAddress`, `postalCode` y `telephone` cuando los tengas
 * para maximizar el SEO local (Google usa la coherencia de estos datos).
 */
export const BUSINESS = {
  streetAddress: "", // ej: "Carrer de ..., 00"
  addressLocality: "Barcelona",
  addressRegion: "Cataluña",
  postalCode: "", // ej: "08000"
  addressCountry: "ES",
  telephone: "", // ej: "+34600000000"
  priceRange: "€€",
  foundingYear: "2023",
  // Coordenadas aproximadas de Barcelona (ajústalas a tu ubicación real)
  latitude: 41.3874,
  longitude: 2.1686,
  areasServed: ["Barcelona", "Cataluña", "España"],
};

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Maen Studios — Agencia de creación de contenido para redes sociales",
};

type PageMetaOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  noIndex = false,
}: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const allKeywords = [...new Set([...keywords, ...DEFAULT_KEYWORDS])];

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
