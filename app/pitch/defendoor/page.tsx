import type { Metadata } from "next";
import Link from "next/link";
import { CLIENTE, PACK, LO_QUE_PIDEN, INCLUYE, DUDAS } from "./propuesta";
import "./defendoor.css";

/**
 * Propuesta para Defendoor Abogados, a raíz de su consulta por el formulario.
 *
 * Oculta a propósito: noindex aquí y /pitch/ ya bloqueado en robots.ts. Es un
 * documento para una persona, no una página de la web.
 */
export const metadata: Metadata = {
  title: "Propuesta para Defendoor Abogados",
  robots: { index: false, follow: false },
};

const euros = (n: number) => n.toLocaleString("es-ES");

export default function PropuestaDefendoor() {
  return (
    <main className="dfd">
      <div className="dfd-wrap">
        <header className="dfd-hero">
          <p className="dfd-kicker">
            Maen Studios · Propuesta para {CLIENTE.nombre}
          </p>
          <h1>
            Doce vídeos al mes que contestan lo que vuestros clientes ya están
            preguntando
          </h1>
          <p className="dfd-lead">
            Hola {CLIENTE.contacto}. Esto es lo que haríamos con vuestras redes,
            con qué frecuencia y cuánto costaría. Está escrito después de leer
            vuestra web, así que va con nombres y apellidos y no con plantillas.
          </p>
        </header>

        {/* Repetir el encargo antes de responderlo: si algo se ha entendido
            mal, se ve aquí y no tres semanas después. */}
        <section className="dfd-sec">
          <h2>Lo que nos habéis pedido</h2>
          <ul className="dfd-check">
            {LO_QUE_PIDEN.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="dfd-nota">
            Si algo de esto no encaja con lo que teníais en la cabeza, decidlo
            antes de seguir leyendo: lo demás depende de esto.
          </p>
        </section>

        <section className="dfd-sec">
          <h2>Cómo lo leemos nosotros</h2>
          <p>
            No vendéis servicios jurídicos genéricos. Vendéis{" "}
            <strong>{CLIENTE.especialidad}</strong> a gente que está pasando por
            un mal momento y que llega buscando una respuesta muy concreta:
            si puede perder su casa, cuánto tarda el proceso, si van a dejar de
            llamarle del banco.
          </p>
          <p>
            Eso cambia el tipo de vídeo que hay que hacer. El contenido de marca
            que funciona en hostelería o en moda —bonito, aspiracional, sin
            información— aquí no sirve de nada. Vuestro público no quiere
            inspirarse: quiere saber si tiene solución.
          </p>
          <p>
            Así que la regla sería una y muy simple:{" "}
            <strong>cada vídeo contesta una pregunta real</strong>, de las que
            ya os llegan por teléfono. Eso funciona en Instagram, pero sobre
            todo funciona en YouTube, donde la gente busca exactamente eso y el
            vídeo sigue trayendo clientes dos años después. Es el canal que
            más va a rendir de los tres, y el que casi ningún despacho trabaja.
          </p>
        </section>

        {/* La pregunta que hizo José, contestada de frente y con una
            recomendación que va en contra de vender más horas. */}
        <section className="dfd-sec dfd-destacado">
          <h2>Sobre el presentador</h2>
          <p>
            Preguntáis si podemos aportar nosotros a la persona que aparece. La
            respuesta corta es sí: tenemos gente y podemos ponerla.
          </p>
          <p>
            <strong>La respuesta larga es que no deberíais.</strong> No al
            principio.
          </p>
          <p>
            Alguien contratado explicando cómo cancelar deudas es un actor
            hablando de la ruina de otros. Se nota, y en vuestro sector se
            castiga: quien está endeudado desconfía por definición, y lo que le
            hace levantar el teléfono es ver la cara del abogado que le va a
            atender. Ahí tenéis una ventaja que ninguna agencia puede fabricar
            —veinte años y más de cinco mil casos— y ponerle un presentador
            delante la tira.
          </p>
          <p>Lo que proponemos:</p>
          <ul className="dfd-check">
            <li>
              <strong>Salen vuestros abogados.</strong> Con teleprónter y
              dirección, para que no sea un esfuerzo. Nadie tiene que memorizar
              ni improvisar
            </li>
            <li>
              <strong>Dos personas fijas como mucho.</strong> La gente sigue
              caras, no marcas; alternar cinco abogados diluye
            </li>
            <li>
              <strong>Presentador nuestro solo para formatos concretos</strong>,
              si más adelante hacen falta: piezas de calle, entrevistas o
              formatos donde no toque hablar en nombre del despacho
            </li>
          </ul>
          <p className="dfd-nota">
            Si preferís el presentador desde el primer día, lo montamos igual.
            Pero os diríamos esto antes de empezar, no después.
          </p>
        </section>

        <section className="dfd-sec">
          <h2>Qué incluye el pack mensual</h2>
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

        <section className="dfd-sec">
          <h2>El precio</h2>
          <div className="dfd-precio">
            <div className="dfd-cifra">
              {euros(PACK.precioMes)} €<span>/ mes + IVA</span>
            </div>
            <dl>
              <div>
                <dt>Piezas al mes</dt>
                <dd>{PACK.piezasMes}</dd>
              </div>
              <div>
                <dt>Jornadas de rodaje</dt>
                <dd>{PACK.jornadasMes} en {CLIENTE.ciudad}</dd>
              </div>
              <div>
                <dt>Canales gestionados</dt>
                <dd>{PACK.canales.join(" · ")}</dd>
              </div>
              <div>
                <dt>Compromiso</dt>
                <dd>{PACK.permanencia} meses</dd>
              </div>
            </dl>
          </div>
          <p>
            Sale a poco más de{" "}
            <strong>{euros(Math.round(PACK.precioMes / PACK.piezasMes))} € por
            pieza</strong>{" "}
            con todo dentro: guion, rodaje, edición, publicación y comunidad. Un
            vídeo suelto encargado a un freelance ronda esa cifra sin incluir
            nada de lo demás.
          </p>
          <p className="dfd-nota">
            Los tres meses de compromiso no son una atadura comercial: son el
            tiempo mínimo para tener datos con los que decidir. Con cuatro
            vídeos publicados no se sabe nada; con treinta y seis, sí. A partir
            del cuarto mes, un mes de preaviso y sin penalización.
          </p>
        </section>

        <section className="dfd-sec">
          <h2>Cómo sería el primer mes</h2>
          <ol className="dfd-pasos">
            <li>
              <strong>Semana 1 · Reunión y guiones.</strong> Una hora con
              vosotros para sacar las preguntas que más os repiten. Salimos de
              ahí con las doce piezas del mes escritas.
            </li>
            <li>
              <strong>Semana 2 · Primera jornada.</strong> Vamos a Granollers y
              rodamos seis piezas. Unas dos horas de vuestro abogado, no más.
            </li>
            <li>
              <strong>Semana 3 · Publicación y segunda jornada.</strong> Empiezan
              a salir los primeros vídeos mientras rodamos los seis restantes.
            </li>
            <li>
              <strong>Semana 4 · Primeros números.</strong> Qué se ha visto, qué
              se ha guardado, qué preguntas ha traído. Con eso se escribe el mes
              siguiente.
            </li>
          </ol>
        </section>

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
          <p>
            Una llamada de veinte minutos para enseñaros trabajo parecido y
            resolver lo que no esté claro. Si encaja, la primera jornada de
            rodaje puede ser en dos semanas.
          </p>
          <div className="dfd-acciones">
            <Link className="btn btn-primary" href="/contacto">
              Hablamos
            </Link>
            <Link className="btn btn-ghost" href="/clientes">
              Ver nuestro trabajo
            </Link>
          </div>
          <p className="dfd-firma">
            Maen Studios · Barcelona y Madrid · Propuesta preparada para{" "}
            {CLIENTE.contacto}, de {CLIENTE.nombre}
          </p>
        </footer>
      </div>
    </main>
  );
}
