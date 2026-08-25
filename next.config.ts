import type { NextConfig } from "next";

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
    ];
  },
};

export default nextConfig;
