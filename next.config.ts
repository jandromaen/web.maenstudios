import type { NextConfig } from "next";
import { clients } from "./app/clients";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        /* Vídeos y fotos de /public. Next les pone por defecto
           `max-age=0, must-revalidate`, así que el navegador vuelve a preguntar
           al servidor por cada reel en cada visita: en móvil eso es una ida y
           vuelta por vídeo antes de que empiece a reproducirse.

           No se usa `immutable`: estos ficheros no llevan hash en el nombre, y
           si se sustituye un reel el visitante se quedaría con el viejo. Un día
           de caché firme, y una semana más sirviendo el anterior mientras se
           refresca por detrás. */
        source: "/(.*)\\.(mp4|webp|avif|jpg|jpeg|png|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Fichas retiradas del portfolio. Estaban indexadas, así que se redirigen
      // en vez de dejar 404 sueltos.
      {
        source: "/clientes/prototipalo",
        destination: "/clientes",
        permanent: true,
      },
      {
        source: "/clientes/thinking-home",
        destination: "/clientes",
        permanent: true,
      },
      {
        source: "/clientes/soccer-solver",
        destination: "/clientes",
        permanent: true,
      },
      {
        source: "/clientes/mr-crop",
        destination: "/clientes",
        permanent: true,
      },
      {
        source: "/clientes/cooltra",
        destination: "/clientes",
        permanent: true,
      },
      {
        source: "/clientes/freixenet",
        destination: "/clientes",
        permanent: true,
      },

      /* ── Restos de la web de Wix ───────────────────────────────────────
         Siguen indexados en Google un año después, con la marca vieja
         («TALENTOS | Maen Agency»), y todos daban 404: quien los encontraba
         se llevaba un error y la autoridad que tuvieran se tiraba.

         El orden importa: path-to-regexp se queda con la primera regla que
         encaja, así que las concretas van antes que los comodines. */

      /* Cada proyecto viejo que hoy sigue siendo cliente va a SU ficha, no al
         índice: quien buscaba Pigili quiere ver Pigili. Se genera desde
         clients.ts para que una ficha nueva quede cubierta sola. */
      ...clients.map((c) => ({
        source: `/proyectos/${c.slug}`,
        destination: `/clientes/${c.slug}`,
        permanent: true,
      })),

      /* El resto de proyectos —marcas que ya no llevamos, y los «copia-de»
         que Wix creaba al duplicar una página— al índice de clientes. */
      {
        source: "/proyectos/:resto*",
        destination: "/clientes",
        permanent: true,
      },

      /* Wix tenía una página por servicio colgando de /servicios. Hoy es una
         sola. `:resto+` y no `:resto*` a propósito: con el asterisco también
         encajaría /servicios y se redirigiría a sí misma para siempre. */
      {
        source: "/servicios/:resto+",
        destination: "/servicios",
        permanent: true,
      },

      /* La de talentos tiene equivalente exacto hoy, así que va antes que el
         comodín de abajo. */
      {
        source: "/copia-de-talents",
        destination: "/talents",
        permanent: true,
      },
      {
        source: "/copia-de-:resto",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
