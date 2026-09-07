"use client";

import LazyVideo from "../../components/LazyVideo";
import Visor, { useArrastreDeReels, type Diapo } from "../Visor";
import type { Client } from "../../clients";
import {
  CLIENTE,
  PACK,
  DESGLOSE,
  EQUIPO,
  LO_QUE_PIDEN,
  METODOLOGIA,
  DUDAS,
} from "./propuesta";

/**
 * Propuesta para Defendoor en formato de diapositivas.
 *
 * Se pasa a diapositivas porque una propuesta comercial se enseña en una
 * llamada, no se lee sola: en scroll el cliente se salta el bloque que no le
 * interesa, y aquí cada idea ocupa una pantalla y se defiende de una en una.
 *
 * Aquí solo viven las diapositivas. El visor -teclado, animación, progreso,
 * pantalla completa y precarga- es el mismo para todas las propuestas y está
 * en ../Visor.
 *
 * Los reels llegan ya resueltos desde el servidor -el componente de página los
 * busca en clients.ts- para no arrastrar aquí todo el catálogo de clientes.
 */

const euros = (n: number) => n.toLocaleString("es-ES");

export default function DefendoorDeck({
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
              <span>Un equipo</span>
              <span>de Social Media</span>
              <span className="dk-tenue">a medida para</span>
              <span className="dk-tenue">{CLIENTE.nombre}</span>
            </h1>
            <p className="dk-lead">
              Hola {CLIENTE.contacto}. Esto es lo que montaríamos con vosotros:
              quién lo hace, cada cuánto sale y qué cuesta.
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
      /* Va antes que el encargo a propósito: primero por qué importa, después
         los detalles. Con los datos delante nadie se emociona. */
      id: "porque",
      titulo: "Por qué importa",
      render: () => (
        <div className="dk-manifiesto">
          <p className="dk-manifiesto-txt">
            Ahora mismo, alguien está buscando en su móvil{" "}
            <span className="dk-tenue">si puede perder su casa</span>.
          </p>
          <p className="dk-manifiesto-txt">
            Va a encontrar foros, publicidad y letra pequeña.
          </p>
          <p className="dk-manifiesto-txt dk-manifiesto-txt--fuerte">
            Lo que queremos es que os encuentre a vosotros. Y que al veros, ya
            se fíe.
          </p>
          <p className="dk-pie">
            Eso no se consigue con una campaña. Se consigue apareciendo cada
            semana, contestando lo que de verdad preguntan.
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
            Si algo no encaja con lo que teníais en la cabeza, decidlo antes:
            todo lo demás depende de esto.
          </p>
        </div>
      ),
    },
    {
      id: "cifras",
      titulo: "El pack en cuatro cifras",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>El pack, en cuatro cifras</h2>
          <div className="dk-cifras">
            {/* La primera manda: es el compromiso que de verdad se compra */}
            <div className="dk-cifra-grande">
              <strong>{PACK.piezasSemana}</strong>
              <span className="dk-cifra-que">vídeos cada semana</span>
              <span className="dk-cifra-nota">
                Uno cada dos días laborables, sin parar en agosto
              </span>
            </div>
            <div>
              <strong>{PACK.jornadasMes}</strong>
              <span className="dk-cifra-que">jornada de rodaje al mes</span>
              <span className="dk-cifra-nota">
                En vuestras oficinas de {CLIENTE.ciudad}
              </span>
            </div>
            <div>
              <strong>{PACK.canales.length}</strong>
              <span className="dk-cifra-que">canales gestionados</span>
              <span className="dk-cifra-nota">{PACK.canales.join(", ")}</span>
            </div>
            <div className="dk-cifra-destacada">
              <strong>{PACK.horasMes} h</strong>
              <span className="dk-cifra-que">de vuestro tiempo al mes</span>
              <span className="dk-cifra-nota">
                Cuatro de rodaje y una de briefing y reportes. Lo demás es
                nuestro
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
          <p className="dk-parrafo">
            No vendéis servicios jurídicos genéricos. Vendéis{" "}
            <strong>{CLIENTE.especialidad}</strong> a gente que está pasando por
            un mal momento y llega buscando una respuesta concreta: si puede
            perder su casa, cuánto tarda, si van a dejar de llamarle del banco.
          </p>
          <blockquote className="dk-cita">
            Cada vídeo contesta una pregunta real, de las que ya os llegan por
            teléfono.
          </blockquote>
          <p className="dk-parrafo">
            Funciona en Instagram y TikTok, pero sobre todo en{" "}
            <strong>YouTube</strong>: ahí la gente busca exactamente eso y el
            vídeo sigue trayendo clientes dos años después. Es el canal que más
            va a rendir y el que casi ningún despacho trabaja.
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
              Ninguna es un despacho todavía —seríais los primeros— pero el
              trabajo es el mismo: alguien delante de una cámara, una idea clara
              y treinta segundos para contarla.
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
      id: "presentador",
      titulo: "El presentador",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <p className="dk-kicker">Vuestra pregunta</p>
          <h2>¿Ponéis vosotros al presentador?</h2>
          <div className="dk-dos">
            <div>
              <p className="dk-si">Sí, podemos.</p>
              <p className="dk-parrafo">
                Tenemos gente y la ponemos si es lo que queréis.
              </p>
            </div>
            <div>
              <p className="dk-no">Pero no deberíais.</p>
              <p className="dk-parrafo">
                Un actor contratado explicando cómo cancelar deudas es lo que más
                desconfianza genera en alguien endeudado. Y tira por la borda
                vuestra única ventaja imposible de copiar: veinte años y más de
                cinco mil casos.
              </p>
            </div>
          </div>
          <ul className="dk-lista dk-lista--compacta">
            <li>
              <strong>Salen vuestros abogados</strong>, con teleprónter y
              dirección
            </li>
            <li>
              <strong>Dos caras fijas como mucho.</strong> La gente sigue
              personas, no marcas
            </li>
            <li>
              <strong>Presentador nuestro más adelante</strong>, solo para calle
              o entrevistas
            </li>
          </ul>
          <div className="dk-extra">
            <div>
              <span className="dk-extra-que">
                Si aun así lo preferís desde el principio
              </span>
              <span className="dk-extra-nota">
                Casting, caché y su presencia en el rodaje. Va fuera del pack a
                propósito: no queremos cobraros de más por algo que os estamos
                desaconsejando
              </span>
            </div>
            <strong>+{euros(PACK.presentadorMes)} € / mes</strong>
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
            Cinco fases, siempre las mismas. Vosotros solo entráis en la
            primera y en el rodaje.
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
      id: "equipo",
      titulo: "Vuestro equipo",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Cuatro personas, no una</h2>
          <p className="dk-sub">
            Es la diferencia real entre una agencia y un freelance: cuatro
            oficios distintos, y ninguno haciendo el trabajo del otro a medias.
          </p>
          <div className="dk-equipo">
            {EQUIPO.map((m) => (
              <div key={m.rol}>
                <h3>{m.rol}</h3>
                <p>{m.hace}</p>
              </div>
            ))}
          </div>
          <p className="dk-extra dk-extra--simple">
            <span className="dk-extra-que">
              {PACK.horasNuestras} horas de trabajo nuestro al mes, frente a las{" "}
              {PACK.horasMes} vuestras
            </span>
          </p>
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
                  <dt>Vídeos cada semana</dt>
                  <dd>{PACK.piezasSemana}</dd>
                </div>
                <div>
                  <dt>Compromiso</dt>
                  <dd>{PACK.permanencia} meses</dd>
                </div>
                {/* Lleva «al mes» aunque el precio grande de arriba ya lo diga:
                    es la única línea recurrente de una tabla cuya vecina son 3
                    meses de compromiso, y sin ponerlo se lee como pago único. */}
                <div className="dk-opcional">
                  <dt>Presentador nuestro</dt>
                  <dd>+{euros(PACK.presentadorMes)} € al mes</dd>
                </div>
              </dl>
            </div>

            {/* El desglose va al lado del total, no en otra diapositiva: la
                cifra grande impresiona y el desglose es lo que la justifica.
                Separarlas deja la impresión sin su explicación. */}
            <div>
              <h3 className="dk-desglose-tit">Qué estáis pagando</h3>
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
                    <strong>Total</strong>
                    <span>{PACK.horasNuestras} h de trabajo al mes</span>
                  </div>
                  <b>{euros(PACK.precioMes)} €</b>
                </li>
              </ul>
            </div>
          </div>
          <p className="dk-pie">
            Los {PACK.permanencia} meses no son una atadura: son el tiempo
            mínimo para tener datos. Con dos semanas publicando no se sabe nada;
            con {PACK.permanencia * 4} semanas seguidas, sí.
          </p>
        </div>
      ),
    },
    {
      id: "dudas",
      titulo: "Lo que suelen preguntarnos",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Lo que suelen preguntarnos</h2>
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
            <span className="dk-tenue"> y empezamos en dos semanas</span>
          </h2>
          <p className="dk-parrafo">
            Os enseñamos más trabajo, resolvemos lo que no esté claro y, si
            encaja, la primera jornada de rodaje puede ser en quince días.
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
      marca={`Maen × ${CLIENTE.nombre}`}
      diapos={diapos}
      precargar={muestra.map((c) => c.previewVideo!)}
    />
  );
}
