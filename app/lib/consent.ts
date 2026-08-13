/** Clave y evento compartidos entre el banner de cookies y la analítica. */
export const COOKIE_CONSENT_KEY = "maen-cookies-accepted";
export const COOKIE_CONSENT_EVENT = "maen-cookie-consent";

/** Envía un evento de conversión a GA4 si el usuario aceptó cookies. */
export function trackEvent(
  name: string,
  params: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}
