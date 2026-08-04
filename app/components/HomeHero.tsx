"use client";

import { useEffect, useState } from "react";
import { heroReels } from "../site-data";

export default function HomeHero() {
  const [open, setOpen] = useState(false);
  const reelSrc = heroReels[0] ?? "/reel-hero.mp4";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <section className="bd-hero" aria-label="Inicio">
        <div className="bd-hero-media">
          <video
            src={reelSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        </div>
        <div className="bd-hero-center">
          <button
            type="button"
            className="bd-reel-btn"
            onClick={() => setOpen(true)}
          >
            Watch Reel
          </button>
          <div className="bd-hero-meta">
            Maen Studios®
            <span>2020 — ∞</span>
          </div>
        </div>
      </section>

      {open && (
        <div
          className="bd-reel-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Reel Maen Studios"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="bd-reel-modal-close"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          <div
            className="bd-reel-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <video src={reelSrc} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </>
  );
}
