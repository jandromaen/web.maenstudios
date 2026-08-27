import type { Metadata } from "next";
import Link from "next/link";
import LazyVideo from "../../components/LazyVideo";
import { clients, type Client } from "../../clients";
import {
  CLIENTE,
  PACK,
  LO_QUE_PIDEN,
  INCLUYE,
  DUDAS,
  MUESTRA,
  MES,
} from "./propuesta";
import "./defendoor.css";

/**
 * Propuesta para Defendoor Abogados, a raíz de su consulta por el formulario.
 *
 * Oculta a propósito: noindex aquí y /pitch/ ya bloqueado en robots.ts. Es un
 * documento para una persona, no una página de la web.
 *
 * Se apoya en vídeo real en vez de en descripciones: a un cliente que va a
 * pagar por producción audiovisual, enseñarle piezas nuestras convence más que
 * cualquier párrafo sobre nuestra forma de trabajar.
 */
export const metadata: Metadata = {
  title: "Propuesta para Defendoor Abogados",
  robots: { index: false, follow: false },
};

const euros = (n: number) => n.toLocaleString("es-ES");
const porSlug = (slug: string) => clients.find((c) => c.slug === slug);

export default function PropuestaDefendoor() {
  const muestra = MUESTRA.map(porSlug).filter((c): c is Client => Boolean(c));

  return (
    <main className="dfd">
      {/* ── Portada ───────────────────────────────────────────────────── */}
      <section className="dfd-portada">
        <div className="dfd-portada-texto">
          <p className="dfd-kicker">
            Maen Studios · Propuesta para {CLIENTE.nombre}
          </p>
          <h1>
            <span>{PACK.piezasMes} vídeos al mes</span>
            <span className="dfd-tenue">que contestan lo que</span>
            <span className="dfd-tenue">ya os preguntan</span>
          </h1>
          <p className="dfd-lead">
            Hola {CLIENTE.contacto}. Esto es lo que haríamos con vuestras redes,
            con qué frecuencia y cuánto costaría.
          </p>
        </div>

        <div className="dfd-portada-reels" aria-hidden="true">
          {muestra.slice(0, 3).map((c: Client) => (
            <div className="dfd-reel" key={c.slug}>
              <LazyVideo src={c.previewVideo!} poster={c.poster} priority />
            </div>
          ))}
        </div>
      </section>

      {/* ── Cifras ────────────────────────────────────────────────────── */}
      <section className="dfd-cifras">
        <div>
          <strong>{PACK.piezasMes}</strong>
          <span>piezas al mes</span>
        </div>
        <div>
          <strong>{PACK.jornadasMes}</strong>
          <span>jornadas en {CLIENTE.ciudad}</span>
        </div>
        <div>
          <strong>{PACK.canales.length}</strong>
          <span>canales gestionados</span>
        </div>
        <div>
          <strong>2 h</strong>
          <span>de vuestro tiempo al mes</span>
        </div>
      </section>

      <div className="dfd-wrap">
        {/* Repetir el encargo antes de responderlo: si algo se ha entendido
            mal, se ve aquí y no tres semanas después. */}
        <section className="dfd-sec">
          <h2>Lo que nos habéis pedido</h2>
          <ul className="dfd-pedido">
            {LO_QUE_PIDEN.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── Trabajo real ──────────────────────────────────────────────── */}
      <section className="dfd-trabajo">
        <div className="dfd-wrap">
          <h2>Esto es lo que producimos</h2>
          <p className="dfd-sub">
            Seis piezas de marcas que llevamos. Ninguna es un despacho todavía
            —seríais los primeros— pero el trabajo es el mismo: alguien delante
            de una cámara, una idea clara y treinta segundos para contarla.
          </p>
        </div>
        <div className="dfd-tira">
          {muestra.map((c: Client) => (
            <figure className="dfd-tira-item" key={c.slug}>
              <div className="dfd-reel">
                <LazyVideo src={c.previewVideo!} poster={c.poster} />
              </div>
              <figcaption>
                <strong>{c.name}</strong>
                <span>{c.sector}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="dfd-wrap">
        <section className="dfd-sec">
          <h2>Cómo lo leemos</h2>
          <p className="dfd-parrafo">
            No vendéis servicios jurídicos genéricos. Vendéis{" "}
            <strong>{CLIENTE.especialidad}</strong> a gente que está pasando por
            un mal momento y que llega buscando una respuesta muy concreta: si
            puede perder su casa, cuánto tarda, si van a dejar de llamarle del
            banco.
          </p>
          <p className="dfd-parrafo">
            El contenido bonito y aspiracional que funciona en hostelería o en
            moda aquí no sirve. Vuestro público no quiere inspirarse: quiere
            saber si tiene solución.
          </p>
          <blockquote className="dfd-cita">
            Cada vídeo contesta una pregunta real, de las que ya os llegan por
            teléfono.
          </blockquote>
          <p className="dfd-parrafo">
            Eso funciona en Instagram, pero sobre todo en{" "}
            <strong>YouTube</strong>, donde la gente busca exactamente eso y el
            vídeo sigue trayendo clientes dos años después. Es el canal que más
            va a rendir de los tres y el que casi ningún despacho trabaja.
          </p>
        </section>
      </div>

      {/* ── El presentador: la pregunta directa de José ───────────────── */}
      <section className="dfd-presentador">
        <div className="dfd-wrap">
          <p className="dfd-kicker">Vuestra pregunta</p>
          <h2>¿Ponéis vosotros al presentador?</h2>
          <div className="dfd-respuesta">
            <div>
              <p className="dfd-si">Sí, podemos.</p>
              <p className="dfd-parrafo">
                Tenemos gente y la ponemos sin problema si es lo que queréis.
              </p>
            </div>
            <div>
              <p className="dfd-no">Pero no deberíais.</p>
              <p className="dfd-parrafo">
                No al principio. Un actor contratado explicando cómo cancelar
                deudas es lo que más desconfianza genera en alguien endeudado. Y
                tiráis por la borda vuestra única ventaja imposible de copiar:
                veinte años y más de cinco mil casos.
              </p>
            </div>
          </div>
          <ul className="dfd-pedido dfd-pedido--claro">
            <li>
              <strong>Salen vuestros abogados</strong>, con teleprónter y
              dirección. Nadie memoriza ni improvisa
            </li>
            <li>
              <strong>Dos caras fijas como mucho.</strong> La gente sigue
              personas, no marcas
            </li>
            <li>
              <strong>Presentador nuestro solo para formatos concretos</strong>,
              más adelante: calle, entrevistas, piezas donde no toque hablar en
              nombre del despacho
            </li>
          </ul>
        </div>
      </section>

      <div className="dfd-wrap">
        {/* ── El mes, visto de golpe ──────────────────────────────────── */}
        <section className="dfd-sec">
          <h2>Un mes por dentro</h2>
          <div className="dfd-mes">
            {MES.map((s: (typeof MES)[number]) => (
              <div className="dfd-semana" key={s.semana}>
                <span className="dfd-semana-num">{s.semana}</span>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dfd-sec">
          <h2>Qué incluye</h2>
          <div className="dfd-bloques">
            {INCLUYE.map((b) => (
              <div className="dfd-bloque" key={b.bloque}>
                <h3>{b.bloque}</h3>
                <ul>
                  {b.puntos.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Precio ────────────────────────────────────────────────────── */}
      <section className="dfd-precio-sec">
        <div className="dfd-wrap">
          <div className="dfd-precio">
            <div className="dfd-cifra">
              {euros(PACK.precioMes)}<span className="dfd-eur"> €</span>
              <span className="dfd-mes-lbl">/ mes + IVA</span>
            </div>
            <p className="dfd-porpieza">
              {euros(Math.round(PACK.precioMes / PACK.piezasMes))} € por pieza,
              con guion, rodaje, edición, publicación y comunidad dentro
            </p>
            <dl>
              <div>
                <dt>Piezas al mes</dt>
                <dd>{PACK.piezasMes}</dd>
              </div>
              <div>
                <dt>Jornadas de rodaje</dt>
                <dd>
                  {PACK.jornadasMes} en {CLIENTE.ciudad}
                </dd>
              </div>
              <div>
                <dt>Canales</dt>
                <dd>{PACK.canales.join(" · ")}</dd>
              </div>
              <div>
                <dt>Compromiso</dt>
                <dd>{PACK.permanencia} meses</dd>
              </div>
            </dl>
          </div>
          <p className="dfd-nota">
            Los {PACK.permanencia} meses no son una atadura comercial: son el
            tiempo mínimo para tener datos con los que decidir. Con cuatro vídeos
            publicados no se sabe nada; con {PACK.piezasMes * PACK.permanencia},
            sí. A partir del cuarto mes, un mes de preaviso y sin penalización.
          </p>
        </div>
      </section>

      <div className="dfd-wrap">
        <section className="dfd-sec">
          <h2>Lo que suelen preguntarnos</h2>
          <div className="dfd-dudas">
            {DUDAS.map((d) => (
              <details key={d.q}>
                <summary>{d.q}</summary>
                <p>{d.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="dfd-cierre">
          <h2>El siguiente paso</h2>
          <p className="dfd-parrafo">
            Una llamada de veinte minutos para enseñaros más trabajo y resolver
            lo que no esté claro. Si encaja, la primera jornada de rodaje puede
            ser en dos semanas.
          </p>
          <div className="dfd-acciones">
            <Link className="btn btn-primary" href="/contacto">
              Hablamos
            </Link>
            <Link className="btn btn-ghost" href="/clientes">
              Ver todo el trabajo
            </Link>
          </div>
          <p className="dfd-firma">
            Maen Studios · Barcelona y Madrid · Preparada para {CLIENTE.contacto}
            , de {CLIENTE.nombre}
          </p>
        </footer>
      </div>
    </main>
  );
}
