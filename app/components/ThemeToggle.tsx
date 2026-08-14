"use client";

import {
  resolveTheme,
  setStoredTheme,
  type ThemeMode,
} from "../lib/theme";

/**
 * Interruptor flotante de tema. Al pulsarlo la elección queda guardada y pasa
 * a mandar sobre el horario automático: si alguien pide modo oscuro a las tres
 * de la tarde, no tiene sentido que el reloj se lo quite.
 *
 * Los dos iconos van siempre en el DOM y es el CSS quien enseña el que toca
 * según `data-theme`. Así el botón ya sale correcto en el HTML del servidor,
 * sin desajuste de hidratación ni parpadeo.
 */
export default function ThemeToggle() {
  function alternar() {
    const actual =
      (document.documentElement.getAttribute("data-theme") as ThemeMode | null) ??
      resolveTheme();
    const siguiente: ThemeMode = actual === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", siguiente);
    setStoredTheme(siguiente);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={alternar}
      aria-label="Cambiar entre modo claro y oscuro"
      title="Cambiar entre modo claro y oscuro"
    >
      {/* Luna: se ve en claro, invita a pasar a oscuro */}
      <svg
        className="theme-toggle-icon theme-toggle-moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 13.5A8.2 8.2 0 1 1 10.5 4a6.6 6.6 0 0 0 9.5 9.5Z" />
      </svg>
      {/* Sol: se ve en oscuro, invita a volver a claro */}
      <svg
        className="theme-toggle-icon theme-toggle-sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M4.5 4.5l1.6 1.6M17.9 17.9l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.5 19.5l1.6-1.6M17.9 6.1l1.6-1.6" />
      </svg>
    </button>
  );
}
