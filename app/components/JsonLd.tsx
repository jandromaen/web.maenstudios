import {
  BUSINESS,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "../seo-config";
import { EMAIL_PROJECTS } from "../site-data";

const postalAddress = {
  "@type": "PostalAddress",
  ...(BUSINESS.streetAddress
    ? { streetAddress: BUSINESS.streetAddress }
    : {}),
  addressLocality: BUSINESS.addressLocality,
  addressRegion: BUSINESS.addressRegion,
  ...(BUSINESS.postalCode ? { postalCode: BUSINESS.postalCode } : {}),
  addressCountry: BUSINESS.addressCountry,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/maen-logo.png`,
  image: `${SITE_URL}/og-image.png`,
  description: DEFAULT_DESCRIPTION,
  email: EMAIL_PROJECTS,
  ...(BUSINESS.telephone ? { telephone: BUSINESS.telephone } : {}),
  priceRange: BUSINESS.priceRange,
  foundingDate: BUSINESS.foundingYear,
  address: postalAddress,
  geo: {
    "@type": "GeoCoordinates",
    latitude: BUSINESS.latitude,
    longitude: BUSINESS.longitude,
  },
  areaServed: BUSINESS.areasServed.map((name) => ({
    "@type": "AdministrativeArea",
    name,
  })),
  contactPoint: {
    "@type": "ContactPoint",
    email: EMAIL_PROJECTS,
    contactType: "sales",
    areaServed: "ES",
    availableLanguage: ["es", "ca", "en"],
  },
  serviceType: [
    "Creación de contenido para redes sociales",
    "Producción de Reels y TikToks",
    "Estrategia de social media",
    "Edición de vídeo",
    "UGC y contenido con creadores",
  ],
  knowsAbout: [
    "Social media marketing",
    "Video production",
    "Content strategy",
    "Instagram Reels",
    "TikTok content",
  ],
  sameAs: Object.values(SOCIAL_LINKS),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "es-ES",
};

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function GlobalJsonLd() {
  return (
    <>
      <JsonLdScript data={organizationSchema} />
      <JsonLdScript data={websiteSchema} />
    </>
  );
}

export function ServiceJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Agencia de creación de contenido para redes sociales",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "España",
    description: DEFAULT_DESCRIPTION,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de contenido para redes sociales",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Producción de Reels y Shorts",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Estrategia de contenido y social media",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Edición y postproducción de vídeo",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "UGC y contenido con creadores",
          },
        },
      ],
    },
  };

  return <JsonLdScript data={schema} />;
}

export function PodcastJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "The After Podcast",
    description:
      "Podcast de Maen Studios con conversaciones con clientes, emprendedores y colaboradores sobre negocio, creatividad y contenido.",
    url: `${SITE_URL}/podcast`,
    webFeed: "https://www.youtube.com/playlist?list=PLsfyGPkvFTaOUeXy12Ss0Muk3CB6iu8Tb",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "es-ES",
  };

  return <JsonLdScript data={schema} />;
}

export function ClientJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `Contenido para ${name} — Maen Studios`,
    description,
    url,
    creator: { "@id": `${SITE_URL}/#organization` },
  };

  return <JsonLdScript data={schema} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };

  return <JsonLdScript data={schema} />;
}

export function FaqJsonLd({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return <JsonLdScript data={schema} />;
}

export function BlogPostingJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  const url = `${SITE_URL}/blog/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.png`,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "es-ES",
  };

  return <JsonLdScript data={schema} />;
}
