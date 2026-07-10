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

export const themeBootScript = `(function(){var h=new Date().getHours();var d=h>=${DARK_START}||h<${LIGHT_START};document.documentElement.setAttribute("data-theme",d?"dark":"light");})();`;
