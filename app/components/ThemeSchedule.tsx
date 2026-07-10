"use client";

import { useEffect } from "react";
import {
  getThemeMode,
  msUntilNextThemeChange,
} from "../lib/theme-schedule";

function applyTheme() {
  document.documentElement.setAttribute("data-theme", getThemeMode());
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
