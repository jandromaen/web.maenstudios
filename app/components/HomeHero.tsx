"use client";

import { useEffect, useRef } from "react";
import { heroReels } from "../site-data";

export default function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const reelSrc = heroReels[0] ?? "/reel-hero.mp4";

  useEffect(() => {
    const hero = heroRef.current;
    const cursor = cursorRef.current;
    if (!hero || !cursor) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarse) return;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.12);
      current.current.y = lerp(current.current.y, target.current.y, 0.12);
      cursor.style.transform = `translate3d(calc(-50% + ${current.current.x}px), calc(-50% + ${current.current.y}px), 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      target.current.x = e.clientX - rect.left - rect.width / 2;
      target.current.y = e.clientY - rect.top - rect.height / 2;
      hero.classList.add("is-tracking");
      if (!activeRef.current) {
        activeRef.current = true;
        cursor.classList.add("is-active");
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
      hero.classList.remove("is-tracking");
      cursor.classList.remove("is-active");
      activeRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      cursor.style.transform = "translate3d(-50%, -50%, 0)";
      current.current.x = 0;
      current.current.y = 0;
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="bd-hero" aria-label="Inicio" ref={heroRef}>
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
      <div className="bd-hero-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="bd-hero-logo"
          src="/maen-logo.png"
          width={1020}
          height={80}
          alt="Maen Studios"
          decoding="async"
          fetchPriority="high"
        />
        <span>since 2020®</span>
      </div>
      <div className="bd-hero-cursor" ref={cursorRef} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="bd-hero-icon"
          src="/maen-icon.png"
          width={266}
          height={240}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
