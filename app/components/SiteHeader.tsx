"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { navLinks } from "../site-data";
import SelectorIdioma from "./SelectorIdioma";

/**
 * La cabecera no recibe ninguna prop de color a propósito.
 *
 * Antes había `light` y `adaptive` para decirle de qué color iba, y las
 * páginas interiores pasaban `light` fijo. Eso significaba que el servidor
 * pintaba ya la clase de «fondo claro», que en el tema oscuro -el de la casa-
 * era mentira: el logo salía negro sobre negro durante los 2-3 segundos que
 * tardaba en hidratar. Medido en producción, no supuesto.
 *
 * Ahora el HTML del servidor sale siempre con el logo blanco, que es lo
 * correcto para el tema por defecto, y en cuanto hay JavaScript la medición
 * decide. Sin props no hay forma de volver a mentirle.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /* Arranca en falso -logo blanco- y no en lo que diga una prop: es lo que
     pinta el servidor, y tiene que ser correcto para el tema por defecto. */
  const [overLight, setOverLight] = useState(false);
  /* El portal necesita document, que no existe al renderizar en el servidor. */
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
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

  /**
   * Mira qué color tiene debajo la cabecera y se tiñe al contrario.
   *
   * Antes esto era un IntersectionObserver sobre el hero, que solo sabía
   * responder «he pasado el hero o no». Con eso bastaba mientras la home fuera
   * hero oscuro + resto claro, pero se rompía en todo lo demás: en el tema
   * oscuro las páginas interiores tienen fondo oscuro y el logo salía negro
   * sobre negro, y las bandas `.statement--invert` invierten el color a mitad
   * de página en los dos temas.
   *
   * Así que en vez de deducir el color, se mide: se mira qué elemento hay justo
   * detrás del logo y se calcula la luminancia de su fondo. Funciona con
   * cualquier sección presente o futura sin marcarla de ninguna manera, que es
   * lo que pidió Jandro: que se adapte al color de cada momento.
   *
   */
  useEffect(() => {
    const marca = () => document.querySelector(".header .brand");

    /* Un color CSS a luminancia relativa (la fórmula de contraste de la WCAG).
       Devuelve null si es transparente: entonces hay que seguir buscando
       detrás, porque ese elemento no pinta fondo ninguno. */
    const luminancia = (css: string): number | null => {
      const n = css.match(/-?[\d.]+/g)?.map(Number);
      if (!n || n.length < 3) return null;
      const [r, g, b, a = 1] = n;
      if (a === 0) return null;
      const canal = (v: number) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
    };

    const medir = () => {
      const el = marca();
      if (!el) return;
      const r = el.getBoundingClientRect();
      /* El punto de muestra es el centro del propio logo, no el de la pantalla:
         lo que importa es lo que hay detrás de ÉL, no detrás del menú. */
      const detras = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);

      for (const candidato of detras) {
        /* La cabecera no tiene fondo, pero sus hijos salen igual en el sondeo
           y taparían la respuesta. */
        if (candidato.closest(".header")) continue;
        const lum = luminancia(getComputedStyle(candidato).backgroundColor);
        if (lum === null) continue;
        setOverLight(lum > 0.55);
        return;
      }
    };

    /* Una medición por fotograma como mucho: el sondeo es barato, pero hacerlo
       en cada evento de scroll no lo sería. */
    let pendiente = false;
    const alMoverse = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        medir();
      });
    };

    medir();
    window.addEventListener("scroll", alMoverse, { passive: true });
    window.addEventListener("resize", alMoverse);
    /* El interruptor de tema cambia los fondos sin que haya scroll, así que
       hay que volver a medir cuando cambia el atributo. */
    const observador = new MutationObserver(alMoverse);
    observador.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      window.removeEventListener("scroll", alMoverse);
      window.removeEventListener("resize", alMoverse);
      observador.disconnect();
    };
  }, []);

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

      {/* El cajón se pinta colgando del <body>, no aquí dentro.

          Su sitio natural sería este, pero el envoltorio de la animación de
          entrada crea su propio contexto de apilamiento: dentro de él, el
          z-index del cajón solo compite con sus hermanos, y la barra de
          cookies —que cuelga del body— le pasaba por encima justo en la
          esquina donde va el selector de idioma. Sacándolo a la raíz, su
          z-index vuelve a valer contra todo lo demás. */}
      {montado
        ? createPortal(
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
        </div>,
            document.body,
          )
        : null}
    </>
  );
}
