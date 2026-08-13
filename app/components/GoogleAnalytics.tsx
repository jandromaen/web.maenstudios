"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { GA_ID } from "../seo-config";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY } from "../lib/consent";

/**
 * Google Analytics 4 con Consent Mode v2: el script solo se carga cuando el
 * usuario acepta las cookies en el banner (RGPD). Vercel Analytics, que no usa
 * cookies, se carga siempre desde el layout.
 */
export default function GoogleAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setConsented(
          window.localStorage.getItem(COOKIE_CONSENT_KEY) === "1",
        );
      } catch {
        setConsented(false);
      }
    };

    read();
    window.addEventListener(COOKIE_CONSENT_EVENT, read);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, read);
  }, []);

  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
