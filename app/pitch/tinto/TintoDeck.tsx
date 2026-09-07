"use client";

import LazyVideo from "../../components/LazyVideo";
import Visor, { useArrastreDeReels, type Diapo } from "../Visor";
import type { Client } from "../../clients";
import {
  ARRANQUE,
  CLIENTE,
  DIAS_SEMANA,
  DUDAS,
  EQUIPO,
  LO_ACORDADO,
  METODOLOGIA,
  PACK,
  semanasDe,
} from "./propuesta";

/**
 * Propuesta para Tinto en formato de diapositivas.
 *
 * Aquí solo viven las diapositivas: el visor —teclado, animación, progreso,
 * pantalla completa y precarga— es el mismo para todas las propuestas y está
 * en ../Visor.
 *
 * Se cuenta distinto de la de Defendoor a propósito, porque el momento es
 * otro: Defendoor todavía tiene que decir que sí y hay que convencerle; Tinto
 * ya ha dicho que sí. Así que esto no argumenta el precio ni desmonta
 * objeciones, enseña cómo va a funcionar el mes a partir de ahora.
 *
 * Los reels llegan ya resueltos desde el servidor —el componente de página los
 * busca en clients.ts— para no arrastrar aquí todo el catálogo de clientes.
 */

const euros = (n: number) => n.toLocaleString("es-ES");

/** «Canal» o «Canales» según cuántos haya, para que no cante si entra TikTok. */
const CANALES_ETIQUETA = PACK.canales.length === 1 ? "Canal" : "Canales";

export default function TintoDeck({ portada }: { portada: Client[] }) {
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
              Esto es lo que vamos a montar con vosotros: qué sale cada semana,
              quién lo hace y qué cuesta.
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
      /* Va antes que las cifras a propósito: primero por qué importa, después
         los detalles. Con los datos delante nadie se emociona. */
      id: "porque",
      titulo: "Por qué importa",
      render: () => (
        <div className="dk-manifiesto">
          <p className="dk-manifiesto-txt">
            En {CLIENTE.apertura} abrís las puertas.
          </p>
          <p className="dk-manifiesto-txt">
            Casi todos empiezan a contarse{" "}
            <span className="dk-tenue">el día que abren</span>. Y ese día ya es
            tarde.
          </p>
          <p className="dk-manifiesto-txt dk-manifiesto-txt--fuerte">
            Queremos que {CLIENTE.nombre} llegue a su primera noche con gente
            esperando.
          </p>
          <p className="dk-pie">
            Por eso empezamos en septiembre. Las semanas de antes valen más que
            las de después, y no vuelven.
          </p>
        </div>
      ),
    },
    {
      id: "acordado",
      titulo: "Lo que hemos acordado",
      render: () => (
        <div className="dk-centro">
          <h2>Lo que hemos acordado</h2>
          <ul className="dk-lista">
            {LO_ACORDADO.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="dk-pie">
            Es lo que aprobasteis, punto por punto. Si algo no encaja con lo que
            teníais en la cabeza, mejor decirlo ahora que en el primer rodaje.
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
            {/* La primera manda: es el compromiso que de verdad se compra */}
            <div className="dk-cifra-grande">
              <strong>{PACK.reelsSemana}</strong>
              <span className="dk-cifra-que">reels cada semana</span>
              <span className="dk-cifra-nota">
                {PACK.reelsMes} al mes, sin semanas en blanco
              </span>
            </div>
            <div>
              <strong>{PACK.postsSemana}</strong>
              <span className="dk-cifra-que">publicaciones cada semana</span>
              <span className="dk-cifra-nota">
                Foto de plato, sala y equipo
              </span>
            </div>
            <div>
              <strong>30</strong>
              <span className="dk-cifra-que">días de calendario cerrado</span>
              <span className="dk-cifra-nota">
                Lo veis entero antes de que se publique nada
              </span>
            </div>
            <div className="dk-cifra-destacada">
              <strong>{euros(PACK.precioMes)} €</strong>
              <span className="dk-cifra-que">al mes, IVA incluido</span>
              <span className="dk-cifra-nota">
                Rodaje, edición y gestión dentro. Sin extras por pieza
              </span>
            </div>
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
            Cinco fases, siempre las mismas. Vosotros solo entráis en la primera
            y en el rodaje.
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
            Es la diferencia real entre una agencia y el cuñado que hace buenas
            fotos: cuatro oficios distintos, y ninguno haciendo el trabajo del
            otro a medias.
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
              {/* «IVA incluido» va pegado a la cifra y no en una nota al pie:
                  es la diferencia entre 800 y 968, y en un sitio menos visible
                  la factura del primer mes sería una sorpresa. */}
              <p className="dk-mes-lbl">al mes · IVA incluido</p>
              <dl className="dk-precio-datos">
                <div>
                  <dt>Reels cada semana</dt>
                  <dd>{PACK.reelsSemana}</dd>
                </div>
                <div>
                  <dt>Publicaciones cada semana</dt>
                  <dd>{PACK.postsSemana}</dd>
                </div>
                <div>
                  <dt>Stories</dt>
                  <dd>Según calendario</dd>
                </div>
                <div>
                  <dt>{CANALES_ETIQUETA}</dt>
                  <dd>{PACK.canales.join(", ")}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="dk-desglose-tit">Qué entra en esos 800 €</h3>
              <ul className="dk-lista dk-lista--compacta">
                <li>
                  <strong>El rodaje entero</strong>, de foto y de vídeo, con
                  equipo de luz y sonido
                </li>
                <li>
                  <strong>Toda la edición</strong>: montaje, subtítulos, color y
                  retoque de las fotos
                </li>
                <li>
                  <strong>El calendario y los copys</strong>, escritos y
                  programados por nosotros
                </li>
                <li>
                  <strong>La comunidad</strong>: comentarios y mensajes
                  contestados
                </li>
                <li>
                  <strong>El informe mensual</strong>, con lo que ha funcionado
                  y lo que cambiamos
                </li>
              </ul>
            </div>
          </div>
          <p className="dk-pie">
            Una sola cuota al mes, sin coste por pieza suelta ni extras de
            producción. Lo que se rueda de más un mes no se factura aparte.
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
      /* Va después del precio y de las dudas a propósito: es lo único que le
         pedimos al cliente en todo el deck, y una petición se hace cuando ya
         no queda nada por explicar. */
      id: "arranque",
      titulo: "Cuándo empezamos",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <p className="dk-kicker">Antes de abrir, no después</p>
          <h2>Elegid día para el arranque</h2>
          <div className="dk-arranque">
            <div>
              <p className="dk-cal-mes">
                {ARRANQUE.nombreMes} {ARRANQUE.anio}
              </p>
              <div className="dk-cal-rejilla">
                {DIAS_SEMANA.map((d, i) => (
                  <span className="dk-cal-cab" key={i}>
                    {d}
                  </span>
                ))}
                {semanasDe(ARRANQUE.anio, ARRANQUE.mes)
                  .flat()
                  .map((dia, i) => (
                    <span
                      key={i}
                      className={[
                        "dk-cal-dia",
                        dia === null ? "dk-cal-dia--vacio" : "",
                        dia !== null && ARRANQUE.opciones.includes(dia)
                          ? "dk-cal-dia--opcion"
                          : "",
                        /* El último día del mes: enseña cuánto margen queda
                           entre la reunión y la apertura sin escribirlo. */
                        dia === 30 ? "dk-cal-dia--hito" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {dia ?? ""}
                    </span>
                  ))}
              </div>
              <div className="dk-cal-leyenda">
                <span>
                  <i className="dk-cal-marca--opcion" />
                  Reunión de arranque
                </span>
                <span>
                  <i className="dk-cal-marca--hito" />
                  Fin de mes · abrís en {CLIENTE.apertura}
                </span>
              </div>
            </div>

            <div>
              <p className="dk-parrafo">
                Lunes {ARRANQUE.opciones[0]}, martes {ARRANQUE.opciones[1]} o
                miércoles {ARRANQUE.opciones[2]}. Nos vale cualquiera de los
                tres: decidid vosotros y bloqueamos la agenda.
              </p>
              <h3 className="dk-desglose-tit">Qué sale de esa reunión</h3>
              <ul className="dk-lista dk-lista--compacta">
                {ARRANQUE.ordenDelDia.map((punto) => (
                  <li key={punto}>{punto}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="dk-pie">
            Con esa fecha quedan dos semanas largas hasta la apertura: tiempo
            para rodar, editar y llegar a {CLIENTE.apertura} con el primer mes
            entero ya publicado o listo para publicarse.
          </p>
        </div>
      ),
    },
    {
      id: "cierre",
      titulo: "El siguiente paso",
      render: () => (
        <div className="dk-cierre">
          <h2>
            Nos vemos en septiembre
            <span className="dk-tenue"> y abrís contados</span>
          </h2>
          <p className="dk-parrafo">
            Decidnos cuál de los tres días os va bien y nos ponemos en marcha.
            A partir de ahí lo único que os pedimos es una hora al mes y
            abrirnos la puerta fuera del servicio.
          </p>
          <p className="dk-firma">
            Maen Studios · Barcelona y Madrid · jandro@maenstudios.com
          </p>
        </div>
      ),
    },
  ];

  /* Sin precarga: los únicos vídeos que quedan son los cinco de la portada, y
     esos ya bajan con prioridad en la primera pantalla. */
  return <Visor marca={`Maen × ${CLIENTE.nombre}`} diapos={diapos} />;
}
