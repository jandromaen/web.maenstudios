"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "../site-data";
import SelectorIdioma from "./SelectorIdioma";

type SiteHeaderProps = {
  /** Fondo claro fijo: logo y nav oscuros (páginas interiores) */
  light?: boolean;
  /** Alterna según scroll sobre el hero (home) */
  adaptive?: boolean;
};

export default function SiteHeader({ light = false, adaptive = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overLight, setOverLight] = useState(light);
  const drawerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (light) {
      setOverLight(true);
      return;
    }
    if (!adaptive) {
      setOverLight(false);
      return;
    }

    const hero = document.querySelector(".bd-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOverLight(!entry.isIntersecting);
      },
      { rootMargin: "-56px 0px 0px 0px", threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [light, adaptive]);

  useEffect(() => {
    const drawer = drawerRef.current;
    const cursor = cursorRef.current;
    if (!drawer || !cursor || !open) {
      activeRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

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
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      drawer.classList.add("is-tracking");
      if (!activeRef.current) {
        activeRef.current = true;
        current.current.x = e.clientX;
        current.current.y = e.clientY;
        cursor.classList.add("is-active");
        cursor.style.transform = `translate3d(calc(-50% + ${e.clientX}px), calc(-50% + ${e.clientY}px), 0)`;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      drawer.classList.remove("is-tracking");
      cursor.classList.remove("is-active");
      activeRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    drawer.addEventListener("pointermove", onMove);
    drawer.addEventListener("pointerleave", onLeave);

    return () => {
      drawer.removeEventListener("pointermove", onMove);
      drawer.removeEventListener("pointerleave", onLeave);
      drawer.classList.remove("is-tracking");
      cursor.classList.remove("is-active");
      activeRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [open]);

  return (
    <>
      <header className={`header${overLight ? " header--light" : ""}`}>
        <div className="container header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="brand-logo"
              src="/maen-logo.png"
              alt="Maen Studios"
            />
          </Link>
          <nav className="nav" aria-label="Principal">
            <div className="nav-links">
              {navLinks
                .filter((l) => l.href !== "/")
                .map((l) => {
                  const active =
                    pathname === l.href || pathname.startsWith(`${l.href}/`);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={active ? "is-active" : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  );
                })}
            </div>
            <button
              type="button"
              className="nav-menu-btn"
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              ···
            </button>
          </nav>
        </div>
      </header>

      <div
        className={`nav-drawer${open ? " open" : ""}`}
        aria-hidden={!open}
        ref={drawerRef}
      >
        <div className="nav-drawer-top">
          <Link className="brand" href="/" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="brand-logo brand-logo-drawer"
              src="/maen-logo.png"
              alt="Maen Studios"
            />
          </Link>
          <button
            type="button"
            className="nav-drawer-close"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="nav-drawer-links">
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
        {/* Abajo a la izquierda, donde lo pidió Jandro: es una preferencia de
            lectura, no un apartado del menú, así que no compite con los
            enlaces. */}
        <SelectorIdioma />

        <div className="nav-drawer-cursor" ref={cursorRef} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/maen-icon.png"
            width={266}
            height={240}
            alt=""
            decoding="async"
          />
        </div>
      </div>
    </>
  );
}
