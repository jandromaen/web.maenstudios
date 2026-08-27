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
};

/** Cuántas se descubren con cada pulsación: dos filas de la rejilla ancha. */
const TANDA = 6;

function Tarjeta({ caso }: { caso: CasoTarjeta }) {
  return (
    <Link className="bd-case" href={`/clientes/${caso.slug}`}>
      <div className="bd-case-media">
        {caso.previewVideo ? (
          <LazyVideo src={caso.previewVideo} poster={caso.poster} />
        ) : caso.logo ? (
          <div className="bd-case-logo-fallback">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={caso.logo} alt="" loading="lazy" decoding="async" />
          </div>
        ) : null}
        <div className="bd-case-overlay">
          {caso.community ? (
            <span className="bd-case-stat">Comunidad: {caso.community}</span>
          ) : null}
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
        {mostrados.map((caso) => (
          <Tarjeta key={caso.slug} caso={caso} />
        ))}
      </div>

      {quedan > 0 ? (
        <div className="bd-cases-mas">
          <button className="btn btn-ghost" type="button" onClick={mostrarMas}>
            Mostrar más
            {/* El número evita la duda de si quedan dos marcas o veinte */}
            <span className="bd-cases-cuentan"> ({quedan})</span>
          </button>
        </div>
      ) : null}
    </>
  );
}
