import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Fichas retiradas del portfolio. Estaban indexadas, así que se redirigen
      // en vez de dejar 404 sueltos.
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
