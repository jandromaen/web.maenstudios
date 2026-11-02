"use client";

import LazyVideo from "../../components/LazyVideo";
import Visor, { useArrastreDeReels, type Diapo } from "../Visor";
import type { Client } from "../../clients";
import {
  CLIENTE,
  CIFRAS,
  DESGLOSE,
  DUDAS,
  EQUIPO,
  FASES,
  INCLUYE,
  LECTURA,
  LO_QUE_PIDEN,
  PRECIO,
} from "./propuesta";

/**
 * Propuesta para CGLU en formato de diapositivas.
 *
 * Aquí solo viven las diapositivas. El visor —teclado, animación, progreso,
 * pantalla completa y precarga— es el común de todas las propuestas, en
 * ../Visor.
 *
 * A diferencia de las propuestas de social media, esto es un proyecto cerrado
 * y no una cuota: el precio se enseña como total del encargo, no «al mes».
 */

const euros = (n: number) =>
  n.toLocaleString("es-ES", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
    /* En es-ES los números de cuatro cifras no llevan punto («6690»), y en
       un presupuesto se lee peor que «6.690». */
    useGrouping: "always",
  });

export default function CgluDeck({
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
            <p className="dk-kicker">
              Propuesta para {CLIENTE.nombre} · {CLIENTE.iniciativa}
            </p>
            <h1>
              <span>Ocho voces,</span>
              <span>una sola serie</span>
              <span className="dk-tenue">edición de entrevistas</span>
              <span className="dk-tenue">para {CLIENTE.nombre}</span>
            </h1>
            <p className="dk-lead">
              Cómo editaríamos las entrevistas de la iniciativa, en qué plazos y
              qué cuesta.
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
            Una alcaldesa cuenta cómo ha cambiado su ciudad{" "}
            <span className="dk-tenue">en su propio idioma</span>.
          </p>
          <p className="dk-manifiesto-txt">
            Alguien en otro continente tiene que entenderla en un minuto.
          </p>
          <p className="dk-manifiesto-txt dk-manifiesto-txt--fuerte">
            Nuestro trabajo es que lo que dice llegue entero, en el idioma de
            quien la escucha.
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
            Sacado de los Términos de Referencia y de vuestro correo. Si algo no
            encaja, decídnoslo antes: lo demás depende de esto.
          </p>
        </div>
      ),
    },
    {
      id: "cifras",
      titulo: "El encargo en cuatro cifras",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>El encargo, en cuatro cifras</h2>
          <div className="dk-cifras">
            <div className="dk-cifra-grande">
              <strong>{CIFRAS.piezas}</strong>
              <span className="dk-cifra-que">piezas terminadas</span>
              <span className="dk-cifra-nota">
                {CIFRAS.entrevistas} entrevistas de 6–8 min y {CIFRAS.capsulas}{" "}
                cápsulas de 60–90 s
              </span>
            </div>
            <div>
              <strong>{CIFRAS.idiomas}</strong>
              <span className="dk-cifra-que">idiomas de subtítulos</span>
              <span className="dk-cifra-nota">Inglés, francés y español</span>
            </div>
            <div>
              <strong>{PRECIO.revisiones}</strong>
              <span className="dk-cifra-que">rondas de revisión</span>
              <span className="dk-cifra-nota">Incluidas en cada pieza</span>
            </div>
            <div className="dk-cifra-destacada">
              <strong>{CIFRAS.entrega}</strong>
              <span className="dk-cifra-que">entrega final</span>
              <span className="dk-cifra-nota">
                Con el material en bruto antes del 13 de noviembre
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "lectura",
      titulo: "Cómo lo leemos",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Cómo lo leemos</h2>
          <blockquote className="dk-cita">{LECTURA.frase}</blockquote>
          <p className="dk-parrafo">
            Cada entrevista llega grabada en un sitio distinto, con otra luz y
            otro sonido. Por eso empezamos por un <strong>paquete gráfico
            común</strong> y una entrevista piloto: se valida el estilo una vez
            y las dieciséis piezas salen con el mismo acabado.
          </p>
          <p className="dk-parrafo">
            Las cápsulas no son un recorte de la entrevista. Son{" "}
            <strong>el minuto que hace que alguien quiera ver las otras siete</strong>,
            montado para que funcione sin sonido en redes.
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
              Editamos cada mes conversaciones, documental y formato corto para
              marcas y proyectos editoriales. El oficio es el mismo: que una
              persona hablando a cámara se vea y se escuche bien.
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
      id: "incluye",
      titulo: "Qué lleva cada pieza",
      render: () => (
        <div className="dk-centro">
          <h2>Qué lleva cada pieza</h2>
          <ul className="dk-lista">
            {INCLUYE.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="dk-pie">
            Las cápsulas se entregan además en vertical (9:16) y cuadrado (1:1)
            para redes.
          </p>
        </div>
      ),
    },
    {
      id: "calendario",
      titulo: "Calendario",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>De la llamada a la entrega, en cuatro semanas</h2>
          <p className="dk-sub">
            Vosotros solo entráis en el arranque y en el feedback.
          </p>
          <ol className="dk-fases">
            {FASES.map((f) => (
              <li key={f.nombre}>
                <span className="dk-fase-num">{f.fecha}</span>
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
      id: "equipo",
      titulo: "Vuestro equipo",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Cuatro oficios, un interlocutor</h2>
          <p className="dk-sub">
            Un solo equipo, en el estudio de Barcelona.
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
      titulo: "El presupuesto",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <div className="dk-precio-grid">
            <div>
              <div className="dk-cifra">
                {euros(PRECIO.base)}
                <span className="dk-eur">€</span>
              </div>
              <p className="dk-mes-lbl">el proyecto completo + IVA</p>
              <dl className="dk-precio-datos">
                <div>
                  <dt>IVA ({PRECIO.ivaPct} %)</dt>
                  <dd>{euros(PRECIO.iva)} €</dd>
                </div>
                <div>
                  <dt>Total IVA incluido</dt>
                  <dd>{euros(PRECIO.total)} €</dd>
                </div>
                <div className="dk-opcional">
                  <dt>Por entrevista, con sus dos piezas</dt>
                  <dd>{euros(PRECIO.porEntrevista)} €</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="dk-desglose-tit">Qué estáis pagando</h3>
              <ul className="dk-desglose">
                {DESGLOSE.map((l) => (
                  <li key={l.concepto}>
                    <div>
                      <strong>{l.concepto}</strong>
                      <span>
                        {l.unidades} × {euros(l.precio)} € · {l.detalle}
                      </span>
                    </div>
                    <b>{euros(l.unidades * l.precio)} €</b>
                  </li>
                ))}
                <li className="dk-desglose-total">
                  <div>
                    <strong>Total + IVA</strong>
                    <span>Gestión, revisiones y archivos fuente incluidos</span>
                  </div>
                  <b>{euros(PRECIO.base)} €</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "dudas",
      titulo: "Lo que conviene dejar claro",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Lo que conviene dejar claro</h2>
          <div className="dk-dudas">
            {DUDAS.map((d) => (
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
            Una llamada de veinte minutos
            <span className="dk-tenue"> y empezamos esta semana</span>
          </h2>
          <p className="dk-parrafo">
            Nos enseñáis el material, cerramos fechas y, en cuanto llegue el
            primer bruto, os mandamos la entrevista piloto.
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
      marca={`Maen × ${CLIENTE.nombre}`}
      diapos={diapos}
      precargar={muestra.map((c) => c.previewVideo!)}
    />
  );
}
