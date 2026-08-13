import type { Metadata } from "next";

/**
 * Dominio canónico. Debe ser un host que resuelva de verdad: hoy solo lo hace
 * `www` (la raíz no tiene registro DNS en Wix). Si algún día se publica la raíz
 * y se prefiere como canónica, se cambia aquí y se propaga a canonicals,
 * sitemap, robots, JSON-LD e imágenes OG.
 */
export const SITE_URL = "https://www.maenstudios.com";

export const SITE_NAME = "Maen Studios";

export const DEFAULT_DESCRIPTION =
  "Agencia de creación de contenido para redes sociales en Barcelona y Madrid. Dirección creativa, producción audiovisual y community management para marcas que quieren crecer en Instagram, TikTok y YouTube.";

export const DEFAULT_KEYWORDS = [
  "agencia contenido redes sociales",
  "agencia de contenido Barcelona",
  "agencia de contenido Madrid",
  "creación de contenido",
  "dirección creativa",
  "producción audiovisual",
  "community management",
  "contenido instagram",
  "contenido tiktok",
  "estudio audiovisual",
  "agencia social media",
  "Maen Studios",
  "agencia social media España",
  "agencia social media Barcelona",
  "agencia social media Madrid",
];

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/maen.studios/",
  youtube: "https://www.youtube.com/@MaenStudios",
  linkedin: "https://www.linkedin.com/company/maen-agency",
  tiktok: "https://www.tiktok.com/@maen.studios",
};

/**
 * Teléfono de contacto en formato internacional (ej: "+34600000000").
 * Cuando lo rellenes aparece automáticamente en contacto, footer, landings
 * y en el schema LocalBusiness (Google lo usa para el SEO local y para
 * mostrar el botón de llamada en móvil).
 */
export const PHONE = "+34688629688";

/** Formato legible del teléfono (ej: "+34 600 00 00 00"). */
export const PHONE_DISPLAY = "+34 688 629 688";

export type Office = {
  /** Identificador para el @id del schema (ej: "#oficina-barcelona") */
  id: string;
  city: string;
  /** Etiqueta que se muestra en la web */
  label: string;
  streetAddress: string;
  postalCode: string;
  addressRegion: string;
  addressCountry: string;
  latitude: number;
  longitude: number;
  /** Enlace a Google Maps para la ficha de contacto */
  mapUrl?: string;
  /** Ruta de la landing local correspondiente */
  landingPath: string;
  /** Zonas que se atienden desde esta oficina */
  areasServed: string[];
};

/**
 * Oficinas de Maen Studios. La coherencia de estos datos (NAP: nombre,
 * dirección y teléfono idénticos aquí, en Google Business Profile y en redes)
 * es el factor principal del SEO local.
 */
export const OFFICES: Office[] = [
  {
    id: "oficina-barcelona",
    city: "Barcelona",
    label: "Barcelona",
    streetAddress: "Carrer del Bruc 61",
    postalCode: "08009",
    addressRegion: "Cataluña",
    addressCountry: "ES",
    // Eixample Dreta, entre Consell de Cent y Diputació
    latitude: 41.3928,
    longitude: 2.1704,
    mapUrl: "https://maps.google.com/?q=Carrer+del+Bruc+61,+08009+Barcelona",
    landingPath: "/agencia-de-contenido-barcelona",
    areasServed: [
      "Barcelona",
      "Área metropolitana de Barcelona",
      "Cataluña",
      "Girona",
      "Tarragona",
    ],
  },
  {
    id: "oficina-madrid",
    city: "Madrid",
    label: "Madrid",
    streetAddress: "Calle de Génova 3",
    postalCode: "28004",
    addressRegion: "Comunidad de Madrid",
    addressCountry: "ES",
    latitude: 40.4268,
    longitude: -3.6959,
    mapUrl: "https://maps.google.com/?q=Calle+de+G%C3%A9nova+3,+28004+Madrid",
    landingPath: "/agencia-de-contenido-madrid",
    areasServed: [
      "Madrid",
      "Comunidad de Madrid",
      "Alcobendas",
      "Pozuelo de Alarcón",
      "Las Rozas",
    ],
  },
];

export const HQ = OFFICES[0];

export function getOffice(city: string): Office | undefined {
  return OFFICES.find((o) => o.city.toLowerCase() === city.toLowerCase());
}

/** Horario de atención (se publica en el schema LocalBusiness). */
export const OPENING_HOURS = {
  days: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ],
  opens: "09:00",
  closes: "18:00",
};

export const BUSINESS = {
  priceRange: "€€",
  foundingYear: "2020",
  vatCountry: "ES",
  areasServed: ["Barcelona", "Madrid", "Cataluña", "Comunidad de Madrid", "España"],
};

/**
 * Códigos de verificación / analítica. Se leen de variables de entorno para
 * no versionarlos: añádelas en Vercel → Settings → Environment Variables.
 */
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Maen Studios — Agencia de creación de contenido para redes sociales en Barcelona y Madrid",
};

type PageMetaOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  /** Sobrescribe la imagen social (ej: OG dinámica de un artículo) */
  image?: { url: string; width: number; height: number; alt: string };
  /** "article" para posts del blog */
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function createPageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  noIndex = false,
  image = OG_IMAGE,
  type = "website",
  publishedTime,
  modifiedTime,
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
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-video-preview": -1,
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      type,
      images: [image],
      ...(type === "article"
        ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
