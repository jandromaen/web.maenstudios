import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Mr. Crop se retiró del portfolio: su ficha ya estaba indexada, así que
      // se redirige en vez de dejar un 404 suelto.
      {
        source: "/clientes/mr-crop",
        destination: "/clientes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
