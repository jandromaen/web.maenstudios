import type { Metadata } from "next";

/**
 * Metadatos comunes de las presentaciones de Skin Laundry. Sobrescriben los
 * de la web (icono, vista previa al compartir, autoría) para que en ningún
 * sitio aparezca Maen Studios: las presentaciones van firmadas por All About
 * Management × Skin Laundry.
 */
export function metaSkinLaundry(titulo: string, descripcion: string, _ruta?: string): Metadata {
  const imagen = { url: "/pitch/skin-laundry/og.jpg", width: 1200, height: 630, alt: "Skin Laundry Barcelona" };
  return {
    title: { absolute: titulo },
    description: descripcion,
    keywords: [],
    applicationName: "Skin Laundry",
    authors: [{ name: "All About Management" }],
    creator: "All About Management",
    publisher: "All About Management",
    category: undefined,
    robots: { index: false, follow: false },
    // Sin canonical ni URL: se sirven también desde un dominio propio sin la marca de Maen.
    alternates: {},
    icons: {
      icon: [{ url: "/pitch/skin-laundry/icon-ig.png", type: "image/png" }],
      apple: [{ url: "/pitch/skin-laundry/apple-icon-ig.png", type: "image/png" }],
    },
    openGraph: {
      title: titulo,
      description: descripcion,
      siteName: "Skin Laundry",
      locale: "es_ES",
      type: "website",
      images: [imagen],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [imagen.url],
    },
  };
}
