import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import CookieBanner from "./components/CookieBanner";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { GlobalJsonLd } from "./components/JsonLd";
import ThemeToggle from "./components/ThemeToggle";
import ScrollReveal from "./components/ScrollReveal";
import ReelMotion from "./components/ReelMotion";
import HeroHalo from "./components/HeroHalo";
import HeroReelDrag from "./components/HeroReelDrag";
import { themeBootScript } from "./lib/theme";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  GSC_VERIFICATION,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "./seo-config";
import "./globals.css";

/* Display: Monument Extended — mismo display del portfolio Canva */
const display = localFont({
  src: [
    {
      path: "./fonts/MonumentExtended-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MonumentExtended-Ultrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

/* Body: Plus Jakarta Sans ≈ TT Fors (Canva; comercial TypeType, no redistribuible) */
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const DEFAULT_TITLE = `${SITE_NAME} | Agencia de contenido para redes sociales en Barcelona y Madrid`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  category: "Marketing y publicidad",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: true, email: true, address: true },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  /**
   * Las dos propiedades de Search Console a la vez. La primera sale de
   * NEXT_PUBLIC_GSC_VERIFICATION (definida en Vercel) y verifica la propiedad
   * antigua; quitarla la desverificaria, y de ahi salen los datos de busquedas
   * del informe semanal. La segunda es la propiedad nueva. Google admite
   * varias etiquetas y comprueba la suya, asi que conviven sin problema.
   */
  verification: {
    google: [
      GSC_VERIFICATION,
      "F8q96DiuWidyV1yyV-B5FOgkH2RFHn2My3mw4hklS4E",
    ].filter(Boolean),
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_ES",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <GlobalJsonLd />
        {children}
        <ScrollReveal />
        <ReelMotion />
        <HeroHalo />
        <HeroReelDrag />
        <ThemeToggle />
        <CookieBanner />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
