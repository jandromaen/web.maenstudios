"use client";

import LazyVideo from "../../components/LazyVideo";
import Visor, { useArrastreDeReels, type Diapo } from "../Visor";
import type { Client } from "../../clients";
import {
  CLIENTE,
  CUENTA_ATRAS,
  DESGLOSE,
  EQUIPO,
  FUERA,
  LO_QUE_PIDEN,
  METODOLOGIA,
  PACK,
  PREGUNTAS,
  PRELANZAMIENTO,
  PRIMERA_ETAPA,
} from "./propuesta";

/**
 * Propuesta para Marta Balada (joyería de diseño, prelanzamiento) en formato
 * de diapositivas. Mismo visor y mismas piezas que Defendoor: esta todavía
 * tiene que decir que sí.
 */

/* En es-ES las cifras de cuatro dígitos no llevan punto («1800»); en un
   presupuesto se lee mejor «1.800». */
const euros = (n: number) =>
  n.toLocaleString("es-ES", { useGrouping: "always" } as Intl.NumberFormatOptions);

export default function MartaBaladaDeck({
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
            <p className="dk-kicker">Propuesta para {CLIENTE.nombre}</p>
            <h1>
              <span>Lanzar una marca</span>
              <span>de joyería</span>
              <span className="dk-tenue">antes de</span>
              <span className="dk-tenue">lanzarla</span>
            </h1>
            <p className="dk-lead">
              Hola {CLIENTE.contacto}. Esto es lo que montaríamos con vosotras:
              el prelanzamiento, los tres primeros meses y qué cuesta cada cosa.
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
      id: "porque",
      titulo: "Por qué importa",
      render: () => (
        <div className="dk-manifiesto">
          <p className="dk-manifiesto-txt">
            Una joya no se compra por una foto{" "}
            <span className="dk-tenue">de catálogo</span>.
          </p>
          <p className="dk-manifiesto-txt">
            Se compra cuando la ves puesta, de cerca, con la luz rebotando.
          </p>
          <p className="dk-manifiesto-txt dk-manifiesto-txt--fuerte">
            Queremos que el día que abráis la tienda ya haya gente que quiera
            una.
          </p>
          <p className="dk-pie">
            Por eso empezamos antes del lanzamiento. Las semanas de antes valen
            más que las de después, y no vuelven.
          </p>
        </div>
      ),
    },
    {
      id: "pedido",
      titulo: "Lo que nos habéis pedido",
      render: () => (
        <div className="dk-centro">
          <h2>Lo que nos habéis pedido</h2>
          <ul className="dk-lista">
            {LO_QUE_PIDEN.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="dk-pie">
            Casi todo entra. Lo que no, os lo decimos claro unas diapositivas
            más adelante.
          </p>
        </div>
      ),
    },
    {
      id: "cifras",
      titulo: "El mes en cuatro cifras",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Vuestro mes, en cuatro cifras</h2>
          <div className="dk-cifras">
            <div className="dk-cifra-grande">
              <strong>{PACK.reelsSemana}</strong>
              <span className="dk-cifra-que">reels cada semana</span>
              <span className="dk-cifra-nota">
                {PACK.reelsMes} al mes, sin semanas en blanco
              </span>
            </div>
            <div>
              <strong>{PACK.postsSemana}</strong>
              <span className="dk-cifra-que">fotos o carruseles por semana</span>
              <span className="dk-cifra-nota">
                Más {PACK.storiesSemana} stories semanales
              </span>
            </div>
            <div>
              <strong>{PACK.canales.length}</strong>
              <span className="dk-cifra-que">canales gestionados</span>
              <span className="dk-cifra-nota">{PACK.canales.join(" y ")}</span>
            </div>
            <div className="dk-cifra-destacada">
              <strong>{PACK.sesionesMes}</strong>
              <span className="dk-cifra-que">sesión de foto y vídeo al mes</span>
              <span className="dk-cifra-nota">
                Rodado y editado por nosotros, de principio a fin
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "prelanzamiento",
      titulo: "El prelanzamiento",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <p className="dk-kicker">Fase 0 · {PRELANZAMIENTO.semanas} semanas</p>
          <h2>La cuenta atrás</h2>
          <ol className="dk-fases">
            {CUENTA_ATRAS.map((s) => (
              <li key={s.semana}>
                <span className="dk-fase-num">{s.semana}</span>
                <div>
                  <h3>{s.titulo}</h3>
                  <p>{s.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="dk-pie">
            El día del lanzamiento empieza la gestión mensual, con la primera
            sesión de la colección completa.
          </p>
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
              Moda, complementos y producto. Ninguna es joyería todavía
              —seríais la primera— pero el oficio es el mismo: producto de
              cerca, bien iluminado y con algo que contar.
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
      id: "metodo",
      titulo: "El método",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Cómo trabajamos, cada mes</h2>
          <p className="dk-sub">
            Cinco fases, siempre las mismas. Vosotras solo entráis en el
            briefing y en la sesión.
          </p>
          <ol className="dk-fases">
            {METODOLOGIA.map((f, i) => (
              <li key={f.nombre}>
                <span className="dk-fase-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{f.nombre}</h3>
                  <p>{f.resumen}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ),
    },
    {
      id: "metodo-detalle",
      titulo: "El método por dentro",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Qué pasa en cada fase</h2>
          <div className="dk-fases-detalle">
            {METODOLOGIA.map((f, i) => (
              <div key={f.nombre}>
                <span className="dk-fase-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{f.nombre}</h3>
                <ul>
                  {f.puntos.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "paid",
      titulo: "Publicidad",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <p className="dk-kicker">Opcional</p>
          <h2>Publicidad en Meta y TikTok</h2>
          <div className="dk-dos">
            <div>
              <p className="dk-si">Nuestros honorarios</p>
              <p className="dk-parrafo">
                Montamos, lanzamos y optimizamos las campañas con el contenido
                que ya producimos: captación de seguidoras y venta directa a la
                tienda. <strong>{euros(PACK.paidGestionMes)} € + IVA al mes.</strong>
              </p>
            </div>
            <div>
              <p className="dk-si">Vuestra inversión</p>
              <p className="dk-parrafo">
                Va aparte y la pagáis directamente a Meta o TikTok, sin pasar
                por nosotros. Recomendamos empezar desde{" "}
                <strong>{euros(PACK.paidInversionMinima)} € al mes</strong> a
                partir del lanzamiento.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "fuera",
      titulo: "Lo que no incluye",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Lo que no incluye, dicho claro</h2>
          <div className="dk-dudas">
            {FUERA.map((f) => (
              <div key={f.que}>
                <h3>{f.que}</h3>
                <p>{f.porque}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "equipo",
      titulo: "Vuestro equipo",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Cuatro personas, no una</h2>
          <p className="dk-sub">
            Cuatro oficios distintos, y ninguno haciendo el trabajo del otro a
            medias.
          </p>
          <div className="dk-equipo">
            {EQUIPO.map((m) => (
              <div key={m.rol}>
                <h3>{m.rol}</h3>
                <p>{m.hace}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "precio",
      titulo: "El precio",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <div className="dk-precio-grid">
            <div>
              <div className="dk-cifra">
                {euros(PACK.precioMes)}
                <span className="dk-eur">€</span>
              </div>
              <p className="dk-mes-lbl">al mes + IVA</p>
              <dl className="dk-precio-datos">
                <div>
                  <dt>Prelanzamiento</dt>
                  <dd>{euros(PRELANZAMIENTO.precio)} € pago único</dd>
                </div>
                <div>
                  <dt>Compromiso</dt>
                  <dd>{PACK.permanencia} meses</dd>
                </div>
                <div>
                  <dt>Primera etapa completa</dt>
                  <dd>{euros(PRIMERA_ETAPA)} €</dd>
                </div>
                <div className="dk-opcional">
                  <dt>Gestión de publicidad</dt>
                  <dd>+{euros(PACK.paidGestionMes)} € al mes</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="dk-desglose-tit">Qué estáis pagando cada mes</h3>
              <ul className="dk-desglose">
                {DESGLOSE.map((l) => (
                  <li key={l.concepto}>
                    <div>
                      <strong>{l.concepto}</strong>
                      <span>
                        {l.horas} h · {l.perfil}
                      </span>
                    </div>
                    <b>{euros(l.importe)} €</b>
                  </li>
                ))}
                <li className="dk-desglose-total">
                  <div>
                    <strong>Total mensual</strong>
                    <span>{PACK.horasNuestras} h de trabajo al mes</span>
                  </div>
                  <b>{euros(PACK.precioMes)} €</b>
                </li>
              </ul>
            </div>
          </div>
          <p className="dk-pie">
            Precios sin IVA. La inversión publicitaria va aparte y la pagáis
            directamente a cada plataforma.
          </p>
        </div>
      ),
    },
    {
      id: "prelanzamiento-precio",
      titulo: "El prelanzamiento, por partidas",
      render: () => (
        <div className="dk-centro">
          <h2>El prelanzamiento, por partidas</h2>
          <ul className="dk-desglose">
            {PRELANZAMIENTO.partidas.map((p) => (
              <li key={p.concepto}>
                <div>
                  <strong>{p.concepto}</strong>
                  <span>{p.detalle}</span>
                </div>
                <b>{euros(p.importe)} €</b>
              </li>
            ))}
            <li className="dk-desglose-total">
              <div>
                <strong>Total · pago único</strong>
                <span>{PRELANZAMIENTO.semanas} semanas antes del lanzamiento</span>
              </div>
              <b>{euros(PRELANZAMIENTO.precio)} €</b>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "preguntas",
      titulo: "Vuestras preguntas",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Vuestras siete preguntas</h2>
          <div className="dk-dudas">
            {PREGUNTAS.map((d) => (
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
      titulo: "El siguiente paso",
      render: () => (
        <div className="dk-cierre">
          <h2>
            Una reunión de media hora
            <span className="dk-tenue"> y arrancamos la cuenta atrás</span>
          </h2>
          <p className="dk-parrafo">
            Nos contáis la marca, nos enseñáis las piezas y cerramos la fecha de
            lanzamiento. Con eso, la estrategia está lista en una semana.
          </p>
          <p className="dk-firma">
            Maen Studios · Barcelona y Madrid · jandro@maenstudios.com
          </p>
        </div>
      ),
    },
  ];

  return (
    <Visor
      marca="Maen × Marta Balada"
      diapos={diapos}
      precargar={muestra.map((c) => c.previewVideo!)}
    />
  );
}
