import {
  BUSINESS,
  DEFAULT_DESCRIPTION,
  OFFICES,
  OPENING_HOURS,
  PHONE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  type Office,
} from "../seo-config";
import { EMAIL_PROJECTS } from "../site-data";

function postalAddress(office: Office) {
  return {
    "@type": "PostalAddress",
    ...(office.streetAddress ? { streetAddress: office.streetAddress } : {}),
    addressLocality: office.city,
    addressRegion: office.addressRegion,
    ...(office.postalCode ? { postalCode: office.postalCode } : {}),
    addressCountry: office.addressCountry,
  };
}

const openingHoursSpecification = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: OPENING_HOURS.days,
    opens: OPENING_HOURS.opens,
    closes: OPENING_HOURS.closes,
  },
];

/** Una ficha LocalBusiness por oficina: es lo que Google usa para el SEO local. */
function officeSchema(office: Office) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#${office.id}`,
    name: `${SITE_NAME} ${office.city}`,
    legalName: SITE_NAME,
    description: `Agencia de creación de contenido para redes sociales en ${office.city}: dirección creativa, producción audiovisual y community management.`,
    url: `${SITE_URL}${office.landingPath}`,
    logo: `${SITE_URL}/maen-logo.png`,
    image: `${SITE_URL}/og-image.png`,
    email: EMAIL_PROJECTS,
    ...(PHONE ? { telephone: PHONE } : {}),
    ...(office.mapUrl ? { hasMap: office.mapUrl } : {}),
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: "EUR",
    address: postalAddress(office),
    geo: {
      "@type": "GeoCoordinates",
      latitude: office.latitude,
      longitude: office.longitude,
    },
    openingHoursSpecification,
    areaServed: office.areasServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    sameAs: Object.values(SOCIAL_LINKS),
  };
}

/** Oficina con dirección completa: la usamos como dirección principal de la marca. */
const primaryOffice =
  OFFICES.find((o) => o.streetAddress && o.postalCode) ?? OFFICES[0];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "Maen",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/maen-logo.png`,
  },
  image: `${SITE_URL}/og-image.png`,
  description: DEFAULT_DESCRIPTION,
  email: EMAIL_PROJECTS,
  ...(PHONE ? { telephone: PHONE } : {}),
  priceRange: BUSINESS.priceRange,
  foundingDate: BUSINESS.foundingYear,
  address: postalAddress(primaryOffice),
  location: OFFICES.map((office) => ({ "@id": `${SITE_URL}/#${office.id}` })),
  department: OFFICES.map((office) => ({ "@id": `${SITE_URL}/#${office.id}` })),
  areaServed: BUSINESS.areasServed.map((name) => ({
    "@type": "AdministrativeArea",
    name,
  })),
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: EMAIL_PROJECTS,
      ...(PHONE ? { telephone: PHONE } : {}),
      contactType: "sales",
      areaServed: "ES",
      availableLanguage: ["es", "ca", "en"],
    },
  ],
  serviceType: [
    "Creación de contenido para redes sociales",
    "Dirección Creativa",
    "Producción Audiovisual",
    "Community Management",
    "UGC y campañas con creadores",
  ],
  knowsAbout: [
    "Social media marketing",
    "Video production",
    "Dirección creativa",
    "Producción audiovisual",
    "Community management",
    "Marketing de contenidos",
    "UGC",
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
      {OFFICES.map((office) => (
        <JsonLdScript key={office.id} data={officeSchema(office)} />
      ))}
    </>
  );
}

const SERVICE_CATALOG = [
  {
    name: "Dirección Creativa",
    description:
      "Concepto de campaña, línea editorial, guiones y dirección de arte para marcas en redes sociales.",
  },
  {
    name: "Producción Audiovisual",
    description:
      "Rodaje y edición de Reels, TikToks, spots cortos, piezas de producto y motion listos para publicar.",
  },
  {
    name: "Community Management",
    description:
      "Calendario editorial, publicación, interacción con la comunidad y seguimiento de resultados.",
  },
  {
    name: "UGC y campañas con creadores",
    description:
      "Selección de talento, briefing, producción de contenido UGC y gestión completa de campañas.",
  },
];

export function ServiceJsonLd({ city }: { city?: string } = {}) {
  const area = city
    ? [{ "@type": "City", name: city }]
    : BUSINESS.areasServed.map((name) => ({
        "@type": "AdministrativeArea",
        name,
      }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: city
      ? `Agencia de creación de contenido para redes sociales en ${city}`
      : "Agencia de creación de contenido para redes sociales",
    name: city
      ? `Creación de contenido para redes sociales en ${city}`
      : "Creación de contenido para redes sociales",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: area,
    description: DEFAULT_DESCRIPTION,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de contenido para redes sociales",
      itemListElement: SERVICE_CATALOG.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          provider: { "@id": `${SITE_URL}/#organization` },
        },
      })),
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

/** Listado de casos: ayuda a Google a entender /clientes como portfolio. */
export function ItemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: { name: string; path: string; description?: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.description ? { description: item.description } : {}),
      url: `${SITE_URL}${item.path}`,
    })),
  };

  return <JsonLdScript data={schema} />;
}

export function ContactPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contacto#webpage`,
    url: `${SITE_URL}/contacto`,
    name: "Contacto — Maen Studios",
    description:
      "Contacta con Maen Studios: oficinas en Barcelona y Madrid. Respondemos en menos de 24 horas.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "es-ES",
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
  wordCount,
  keywords,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  wordCount?: number;
  keywords?: string[];
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
    image: image ? `${SITE_URL}${image}` : `${SITE_URL}/blog/${slug}/opengraph-image`,
    ...(wordCount ? { wordCount } : {}),
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "es-ES",
  };

  return <JsonLdScript data={schema} />;
}
