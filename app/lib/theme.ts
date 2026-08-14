export type ThemeMode = "light" | "dark";

/** El oscuro es el tema de la casa. El claro solo llega si lo pide el visitante. */
export const DEFAULT_THEME: ThemeMode = "dark";

/** Preferencia manual del visitante, guardada al pulsar el interruptor. */
export const THEME_STORAGE_KEY = "maen-theme";

export function getStoredTheme(): ThemeMode | null {
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null; // modo privado o cookies bloqueadas
  }
}

export function setStoredTheme(mode: ThemeMode | null) {
  try {
    if (mode) window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    else window.localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}

/** La preferencia guardada gana; si no hay ninguna, oscuro. */
export function resolveTheme(): ThemeMode {
  return getStoredTheme() ?? DEFAULT_THEME;
}

/**
 * Corre en <head> antes del primer pintado: sin esto la página aparecería en
 * claro y saltaría a oscuro, que es peor que no tener modo oscuro.
 *
 * Marca además `data-js`, que es lo que hace visible el interruptor de tema:
 * así el botón ya viene en el HTML (no aparece de golpe al hidratar) pero no
 * se le enseña a quien tenga JavaScript desactivado, donde no haría nada.
 */
export const themeBootScript = `(function(){var e=document.documentElement;e.setAttribute("data-js","1");var t="${DEFAULT_THEME}";try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");if(s==="dark"||s==="light")t=s}catch(x){}e.setAttribute("data-theme",t)})();`;
