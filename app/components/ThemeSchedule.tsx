"use client";

import { useEffect } from "react";
import {
  msUntilNextThemeChange,
  resolveTheme,
} from "../lib/theme-schedule";

/** resolveTheme respeta la elección manual: el reloj solo decide si no la hay. */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", resolveTheme());
}

export default function ThemeSchedule() {
  useEffect(() => {
    applyTheme();

    let timer = window.setTimeout(function tick() {
      applyTheme();
      timer = window.setTimeout(tick, msUntilNextThemeChange());
    }, msUntilNextThemeChange());

    const onVisible = () => {
      if (document.visibilityState === "visible") applyTheme();
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
