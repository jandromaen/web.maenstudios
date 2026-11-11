"use client";

import LazyVideo from "../../components/LazyVideo";
import Visor, { useArrastreDeReels, type Diapo } from "../Visor";
import type { Client } from "../../clients";
import { CONDICIONES, HORA_CUOTA, POR_HORAS, POR_PIEZAS } from "./tarifas";

/**
 * Tarifas de producción puntual. El visor es el común de las propuestas
 * (../Visor); aquí solo viven las diapositivas.
 */
export default function TarifasDeck({
  muestra,
  portada,
}: {
  muestra: Client[];
  portada: Client[];
}) {
  const cogerReel = useArrastreDeReels();

  const diapos: Diapo[] = [
    {
      id: "portada",
      titulo: "Portada",
      render: () => (
        <div className="dk-portada">
          <div>
            <p className="dk-kicker">Maen Studios · Barcelona y Madrid</p>
            <h1>
              <span>Tarifas de</span>
              <span>producción</span>
              <span className="dk-tenue">fotografía y vídeo</span>
              <span className="dk-tenue">sin cuota mensual</span>
            </h1>
            <p className="dk-lead">
              Lo que cuesta un rodaje puntual con nosotros, por horas o por
              pieza entregada. Precios sin IVA.
            </p>
          </div>
          <div className="dk-baraja" aria-hidden="true">
            {portada.map((c, i) => (
              <div
                className="dk-baraja-reel"
                key={c.slug}
                data-pos={i}
                onPointerDown={cogerReel}
              >
                <div className="dk-reel">
                  <LazyVideo src={c.previewVideo!} poster={c.poster} priority />
                </div>
              </div>
            ))}
            <span className="dk-baraja-pista">Arrástralos ✦</span>
          </div>
        </div>
      ),
    },
    {
      id: "trabajo",
      titulo: "Esto es lo que producimos",
      render: () => (
        <div className="dk-trabajo">
          <div className="dk-trabajo-txt">
            <h2>Esto es lo que producimos</h2>
            <p className="dk-pie">
              Rodamos y editamos cada mes para más de veinte marcas de
              restauración, moda y deporte. Lo puntual se hace con el mismo
              equipo y el mismo acabado.
            </p>
          </div>
          <div className="dk-reels dk-reels--seis">
            {muestra.map((c) => (
              <figure className="dk-reel-item" key={c.slug}>
                <div className="dk-reel">
                  <LazyVideo src={c.previewVideo!} poster={c.poster} />
                </div>
                <figcaption>{c.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "horas",
      titulo: "Por horas",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <div className="dk-precio-grid">
            <div>
              <p className="dk-kicker">Por horas</p>
              <div className="dk-cifra">
                160<span className="dk-eur">€/h</span>
              </div>
              <p className="dk-mes-lbl">la hora de rodaje + IVA</p>
              <p className="dk-pie">
                Si reservas media jornada o jornada completa, la hora te sale
                más barata. La edición se cobra aparte.
              </p>
            </div>
            <div>
              <h3 className="dk-desglose-tit">Tarifas por horas</h3>
              <ul className="dk-desglose">
                {POR_HORAS.map((l) => (
                  <li key={l.concepto}>
                    <div>
                      <strong>{l.concepto}</strong>
                      <span>{l.detalle}</span>
                    </div>
                    <b>{l.precio}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "piezas",
      titulo: "Por piezas",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <div className="dk-precio-grid">
            <div>
              <p className="dk-kicker">Por piezas</p>
              <div className="dk-cifra">
                350<span className="dk-eur">€</span>
              </div>
              <p className="dk-mes-lbl">un reel terminado + IVA</p>
              <p className="dk-pie">
                Precio cerrado por pieza entregada, con grabación y edición
                incluidas. La opción más cómoda si ya sabes qué necesitas.
              </p>
            </div>
            <div>
              <h3 className="dk-desglose-tit">Tarifas por piezas</h3>
              <ul className="dk-desglose">
                {POR_PIEZAS.map((l) => (
                  <li key={l.concepto}>
                    <div>
                      <strong>{l.concepto}</strong>
                      <span>{l.detalle}</span>
                    </div>
                    <b>{l.precio}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "condiciones",
      titulo: "Condiciones",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Condiciones</h2>
          <div className="dk-dudas">
            {CONDICIONES.map((d) => (
              <div key={d.q}>
                <h3>{d.q}</h3>
                <p>{d.a}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "cierre",
      titulo: "¿Produces todos los meses?",
      render: () => (
        <div className="dk-cierre">
          <h2>
            ¿Produces todos los meses?
            <span className="dk-tenue"> Te sale más a cuenta un plan</span>
          </h2>
          <p className="dk-parrafo">
            Nuestros clientes con plan mensual de social media tienen una
            jornada de producción incluida en la cuota, y las horas extra les
            salen a <strong>{HORA_CUOTA}</strong> con grabación y edición
            incluidas. Si quieres, te preparamos una propuesta.
          </p>
          <p className="dk-firma">
            Maen Studios · Barcelona y Madrid · Alejandro Martín ·
            jandro@maenstudios.com · +34 688 629 688
          </p>
        </div>
      ),
    },
  ];

  return (
    <Visor
      marca="Maen Studios · Tarifas"
      diapos={diapos}
      precargar={muestra.map((c) => c.previewVideo!)}
    />
  );
}
