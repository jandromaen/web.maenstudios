"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  IDIOMAS,
  IDIOMA_POR_DEFECTO,
  ORDEN_SELECTOR,
  guardarIdioma,
  leerIdioma,
  type Idioma,
} from "../lib/idioma";
import { traducir } from "../lib/traducciones";

/* Ramas del DOM que no se tocan nunca. El logo es una marca, no una palabra;
   el código y las direcciones no se traducen; y los campos de formulario
   llevan el texto que ha escrito el visitante. */
const INTOCABLES = new Set([
  "SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT", "SVG", "NOSCRIPT",
]);

/**
 * Recorre el texto visible y lo sustituye por su traducción.
 *
 * Se guarda el original en el propio nodo la primera vez. Sin eso, volver al
 * español obligaría a recargar la página: una vez sustituido el texto, el
 * original ya no está en ninguna parte.
 */
function aplicar(idioma: Idioma) {
  const paseo = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(nodo) {
      const padre = nodo.parentElement;
      if (!padre || INTOCABLES.has(padre.tagName)) return NodeFilter.FILTER_REJECT;
      if (padre.closest("[data-sin-traducir]")) return NodeFilter.FILTER_REJECT;
      return nodo.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const nodos: Text[] = [];
  let n: Node | null;
  while ((n = paseo.nextNode())) nodos.push(n as Text);

  for (const nodo of nodos) {
    const padre = nodo.parentElement!;
    const original = padre.dataset.original ?? nodo.nodeValue ?? "";

    if (idioma === IDIOMA_POR_DEFECTO) {
      if (padre.dataset.original !== undefined) {
        nodo.nodeValue = original;
        delete padre.dataset.original;
      }
      continue;
    }

    const traducido = traducir(original, idioma);
    if (traducido && traducido !== nodo.nodeValue) {
      if (padre.dataset.original === undefined) padre.dataset.original = original;
      nodo.nodeValue = traducido;
    }
  }

  /* El idioma del documento también cambia: es lo que leen los lectores de
     pantalla y lo que hace que el navegador no ofrezca traducir de nuevo. */
  document.documentElement.lang = idioma;
}

export default function SelectorIdioma() {
  const [idioma, setIdioma] = useState<Idioma>(IDIOMA_POR_DEFECTO);
  const [listo, setListo] = useState(false);
  const ruta = usePathname();
  const contenedor = useRef<HTMLDivElement>(null);

  /* La preferencia se lee tras montar, nunca en el servidor: el HTML que se
     sirve —y por tanto el que ve Google— es siempre el español. */
  useEffect(() => {
    const guardado = leerIdioma();
    setIdioma(guardado);
    setListo(true);
  }, []);

  /* Se reaplica al cambiar de idioma y al cambiar de página, porque React
     monta contenido nuevo que nace en español. Y se vigila el DOM para lo que
     aparece después: los casos que descubre «mostrar más», por ejemplo. */
  useEffect(() => {
    if (!listo) return;
    aplicar(idioma);
    if (idioma === IDIOMA_POR_DEFECTO) return;

    let pendiente = 0;
    const observador = new MutationObserver(() => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(() => {
        pendiente = 0;
        aplicar(idioma);
      });
    });
    observador.observe(document.body, { childList: true, subtree: true });
    return () => {
      observador.disconnect();
      if (pendiente) cancelAnimationFrame(pendiente);
    };
  }, [idioma, listo, ruta]);

  const elegir = (nuevo: Idioma) => {
    guardarIdioma(nuevo);
    setIdioma(nuevo);
  };

  const actual = IDIOMAS.find((i) => i.codigo === idioma) ?? IDIOMAS[0];

  return (
    <div className="selector-idioma" ref={contenedor} data-sin-traducir>
      <span className="selector-idioma-etiqueta" aria-hidden="true">
        {actual.corto}
      </span>
      <div className="selector-idioma-opciones" role="group" aria-label="Idioma">
        {ORDEN_SELECTOR.filter((c) => c !== idioma).map((codigo) => {
          const op = IDIOMAS.find((i) => i.codigo === codigo)!;
          return (
            <button
              key={codigo}
              type="button"
              className="selector-idioma-op"
              onClick={() => elegir(codigo)}
              lang={codigo}
            >
              {op.nombre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
