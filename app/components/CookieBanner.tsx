"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY } from "../lib/consent";

const STORAGE_KEY = COOKIE_CONSENT_KEY;

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  /** "1" = analítica permitida; "0" = cerrado sin aceptar (no se carga GA4). */
  function persistAndHide(accepted: boolean) {
    try {
      window.localStorage.setItem(STORAGE_KEY, accepted ? "1" : "0");
    } catch {
      /* ignore quota / private mode */
    }
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label="Aviso de cookies"
      aria-describedby="cookie-banner-text"
    >
      <div className="cookie-banner-inner">
        <div className="cookie-banner-left">
          <span className="cookie-banner-a11y" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="7" r="1.6" fill="currentColor" />
              <path
                d="M8.5 11.2h7M12 11.2v6.3M9.2 17.5h5.6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cookie-banner-logo"
            src="/maen-logo.png"
            alt=""
            aria-hidden="true"
          />
          <p id="cookie-banner-text" className="cookie-banner-copy">
            Este sitio utiliza cookies para garantizarte la mejor experiencia.{" "}
            <Link href="/privacidad" className="cookie-banner-link">
              Política de privacidad
            </Link>
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-banner-accept"
            onClick={() => persistAndHide(true)}
            aria-label="Aceptar cookies"
          >
            Aceptar cookies
          </button>
          <button
            type="button"
            className="cookie-banner-close"
            onClick={() => persistAndHide(false)}
            aria-label="Cerrar aviso de cookies"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
