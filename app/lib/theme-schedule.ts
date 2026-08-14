/** Hora local a partir de la cual entra el modo oscuro */
export const DARK_START = 20;

/** Hora local a partir de la cual vuelve el modo claro */
export const LIGHT_START = 8;

export type ThemeMode = "light" | "dark";

export function getThemeMode(date = new Date()): ThemeMode {
  const hour = date.getHours();
  return hour >= DARK_START || hour < LIGHT_START ? "dark" : "light";
}

export function msUntilNextThemeChange(date = new Date()): number {
  const next = new Date(date);
  next.setSeconds(0, 0);

  if (getThemeMode(date) === "dark") {
    if (date.getHours() >= DARK_START) {
      next.setDate(next.getDate() + 1);
    }
    next.setHours(LIGHT_START, 0, 0, 0);
  } else {
    next.setHours(DARK_START, 0, 0, 0);
  }

  const ms = next.getTime() - date.getTime();
  return ms > 0 ? ms : 60_000;
}

/** Preferencia manual del visitante. Si existe, manda sobre el horario. */
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

/** La preferencia guardada gana; si no hay ninguna, decide la hora. */
export function resolveTheme(date = new Date()): ThemeMode {
  return getStoredTheme() ?? getThemeMode(date);
}

/**
 * Corre en <head> antes del primer pintado: sin esto la página aparecería en
 * claro y saltaría a oscuro, que es peor que no tener modo oscuro.
 *
 * Marca además `data-js`, que es lo que hace visible el interruptor de tema:
 * así el botón ya viene en el HTML (no aparece de golpe al hidratar) pero no
 * se le enseña a quien tenga JavaScript desactivado, donde no haría nada.
 */
export const themeBootScript = `(function(){var e=document.documentElement;e.setAttribute("data-js","1");try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");if(s==="dark"||s==="light"){e.setAttribute("data-theme",s);return}}catch(x){}var h=new Date().getHours();e.setAttribute("data-theme",h>=${DARK_START}||h<${LIGHT_START}?"dark":"light")})();`;
