"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "../site-data";

type SiteHeaderProps = {
  /** Fondo claro fijo: logo y nav oscuros (páginas interiores) */
  light?: boolean;
  /** Alterna según scroll sobre el hero (home) */
  adaptive?: boolean;
};

export default function SiteHeader({ light = false, adaptive = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [overLight, setOverLight] = useState(light);

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
                .map((l) => (
                  <Link key={l.href} href={l.href}>
                    {l.label}
                  </Link>
                ))}
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

      <div className={`nav-drawer${open ? " open" : ""}`} aria-hidden={!open}>
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
      </div>
    </>
  );
}
