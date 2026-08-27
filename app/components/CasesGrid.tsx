"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import LazyVideo from "./LazyVideo";

/**
 * Solo lo que la tarjeta pinta, no la ficha entera del cliente.
 *
 * Importa: esto viaja del servidor al navegador con la página. Mandando el
 * objeto completo se colarían la descripción, la lista de vídeos y el resto de
 * campos de dos docenas de marcas para no usarlos.
 */
export type CasoTarjeta = {
  slug: string;
  name: string;
  tagline: string;
  previewVideo?: string;
  poster?: string;
  logo?: string;
  community?: string;
  sector: string;
};

/** Cuántas se descubren con cada pulsación: dos filas de la rejilla ancha. */
const TANDA = 6;

function Tarjeta({
  caso,
  yaVisible,
}: {
  caso: CasoTarjeta;
  /**
   * Las tarjetas que aparecen al pulsar el botón nacen ya descubiertas.
   *
   * El sistema de aparición al hacer scroll recorre el documento una sola vez
   * por página: lo que se añada después nunca lo observa nadie. Y como esas
   * piezas arrancan recortadas a altura cero por CSS, se quedaban así para
   * siempre — se veía el nombre de la marca y un hueco donde iba el vídeo.
   *
   * Tampoco tendría sentido animarlas: han aparecido porque alguien las ha
   * pedido, no porque hayan entrado en pantalla.
   */
  yaVisible: boolean;
}) {
  return (
    <Link
      className={`bd-case${yaVisible ? " es-visible" : ""}`}
      href={`/clientes/${caso.slug}`}
    >
      <div className="bd-case-media">
        {caso.previewVideo ? (
          <LazyVideo src={caso.previewVideo} poster={caso.poster} />
        ) : caso.logo ? (
          <div className="bd-case-logo-fallback">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={caso.logo} alt="" loading="lazy" decoding="async" />
          </div>
        ) : null}
        {/* Etiqueta en todas las tarjetas, pero con lo que cada marca tiene de
            verdad. La mitad del portfolio no lleva apuntado el número de
            seguidores, y ahí se pone el sector en vez de una cifra inventada:
            un «+8k» sobre una cuenta que tiene 900 lo desmonta cualquiera
            abriendo Instagram, y el que queda retratado es el estudio.

            En cuanto haya número, sale el número: esta regla se apaga sola
            marca a marca según se vayan rellenando en clients.ts. */}
        <div className="bd-case-overlay">
          <span className="bd-case-stat">
            {caso.community ? `Comunidad: ${caso.community}` : caso.sector}
          </span>
        </div>
      </div>
      <div className="bd-case-body">
        <h3>{caso.name}</h3>
        <p>{caso.tagline}</p>
      </div>
    </Link>
  );
}

/**
 * Rejilla de casos de la home con «mostrar más».
 *
 * Las que no se han descubierto todavía no se pintan, no se pintan ocultas: si
 * estuvieran en el HTML desde el principio, sus vídeos entrarían en la cuenta
 * del navegador y en la del rastreador aunque nadie los vea. Así la carga
 * inicial de la home es exactamente la misma que antes de existir el botón.
 */
export default function CasesGrid({ casos }: { casos: CasoTarjeta[] }) {
  const [visibles, setVisibles] = useState(TANDA);
  const rejilla = useRef<HTMLDivElement>(null);

  const quedan = casos.length - visibles;
  const mostrados = casos.slice(0, visibles);

  const mostrarMas = () => {
    const primeraNueva = visibles;
    setVisibles((n) => Math.min(n + TANDA, casos.length));

    /* El foco salta a la primera marca recién descubierta. Sin esto, quien
       navega con teclado pulsa el botón y se queda donde estaba: lo que ha
       aparecido está por encima y no hay forma de saberlo. */
    requestAnimationFrame(() => {
      const enlaces = rejilla.current?.querySelectorAll<HTMLAnchorElement>(".bd-case");
      enlaces?.[primeraNueva]?.focus({ preventScroll: true });
    });
  };

  return (
    <>
      <div className="bd-cases-grid is-featured" ref={rejilla}>
        {mostrados.map((caso, i) => (
          <Tarjeta key={caso.slug} caso={caso} yaVisible={i >= TANDA} />
        ))}
      </div>

      {quedan > 0 ? (
        <div className="bd-cases-mas">
          <button className="btn btn-ghost" type="button" onClick={mostrarMas}>
            Mostrar más
          </button>
        </div>
      ) : null}
    </>
  );
}
