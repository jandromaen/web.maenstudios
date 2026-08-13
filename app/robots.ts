import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Páginas privadas o de conversión: no aportan nada en el índice
        disallow: ["/api/", "/pitch/", "/gracias"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
