"use client";

import LazyVideo from "../../components/LazyVideo";
import Visor, { useArrastreDeReels, type Diapo } from "../Visor";
import type { Client } from "../../clients";
import {
  CLIENTE,
  PACK,
  LO_ACORDADO,
  METODOLOGIA,
  EQUIPO,
  DUDAS,
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

export default function TintoDeck({
  portada,
  barrio,
  muestra,
}: {
  portada: Client[];
  barrio: Client[];
  muestra: Client[];
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
            Un restaurante nuevo tiene{" "}
            <span className="dk-tenue">unos pocos meses</span> para que el
            barrio decida que existe.
          </p>
          <p className="dk-manifiesto-txt">
            Y esa decisión ya no se toma pasando por delante. Se toma en un
            móvil, la noche anterior.
          </p>
          <p className="dk-manifiesto-txt dk-manifiesto-txt--fuerte">
            Lo que queremos es que, cuando alguien de {CLIENTE.zona} busque
            dónde cenar, {CLIENTE.nombre} ya le suene.
          </p>
          <p className="dk-pie">
            Eso no lo hace una campaña. Lo hace aparecer cada semana, sin fallar
            uno solo, desde el primer mes.
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
      /* El argumento más fuerte que tenemos con ellos, así que va solo y a
         doble tamaño: no es «hacemos restaurantes», es el barrio de al lado. */
      id: "barrio",
      titulo: "Ya trabajamos en la zona",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <p className="dk-kicker">A diez minutos de {CLIENTE.zona}</p>
          <h2>Vuestro barrio ya nos conoce</h2>
          <p className="dk-parrafo">
            Llevamos dos casas de la zona alta, y las dos son de las difíciles:
            una con treinta y cinco años detrás y una bodega de toda la vida. El
            público al que le vais a hablar es exactamente el mismo.
          </p>
          <div className="dk-reels dk-reels--dos">
            {barrio.map((c) => (
              <figure className="dk-reel-item" key={c.slug}>
                <div className="dk-reel">
                  <LazyVideo src={c.previewVideo!} poster={c.poster} />
                </div>
                <figcaption>
                  {c.name}
                  {c.community ? ` · ${c.community}` : ""}
                </figcaption>
              </figure>
            ))}
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
              Seis casas distintas, del bocadillo a la cocina de autor. Cambia
              el plato y cambia el tono, pero el oficio es el mismo: que se vea
              apetecible en un móvil, a las once de la noche y sin sonido.
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
      id: "cierre",
      titulo: "El siguiente paso",
      render: () => (
        <div className="dk-cierre">
          <h2>
            Una hora de briefing
            <span className="dk-tenue"> y rodamos en dos semanas</span>
          </h2>
          <p className="dk-parrafo">
            Nos sentamos con vosotros a ver la carta, decidimos qué entra en el
            primer mes y cerramos la fecha del rodaje. A partir de ahí, lo
            único que os pedimos es abrirnos la puerta fuera del servicio.
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
      precargar={[...barrio, ...muestra].map((c) => c.previewVideo!)}
    />
  );
}
