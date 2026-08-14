import type { MetadataRoute } from "next";
import { clients } from "./clients";
import { posts } from "./blog-data";
import { localLandings } from "./local-data";
import { SITE_URL } from "./seo-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/servicios`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/clientes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/podcast`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/talents`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    /* Páginas legales: prioridad baja, pero indexables. Ocultarlas no protege
       de nada; para surtir efecto tienen que estar accesibles. */
    ...["privacidad", "aviso-legal", "cookies"].map((ruta) => ({
      url: `${SITE_URL}/${ruta}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  // Landings locales: prioridad alta, son puerta de entrada del SEO local
  const localRoutes: MetadataRoute.Sitemap = localLandings.map((landing) => ({
    url: `${SITE_URL}${landing.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const clientRoutes: MetadataRoute.Sitemap = clients.map((client) => ({
    url: `${SITE_URL}/clientes/${client.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...localRoutes, ...clientRoutes, ...blogRoutes];
}
