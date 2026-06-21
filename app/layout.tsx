import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maen Studios — Hacemos que paren el scroll",
  description:
    "Estudio de contenido audiovisual para redes sociales: reels, tiktoks y estrategia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
