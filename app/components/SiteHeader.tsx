"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "../site-data";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="header">
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
