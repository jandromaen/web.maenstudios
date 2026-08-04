"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Contenido del pitch                                                 */
/* ------------------------------------------------------------------ */

type Act = {
  n: string;
  time: string;
  kicker: string;
  title: string;
  subtitle: string;
  voz: string;
  idea: string;
  visual: string;
  sonido: string;
  locucion: string;
};

const acts: Act[] = [
  {
    n: "01",
    time: "0:00 – 0:22",
    kicker: "Acto 1 · La ciudad dormida",
    title: "El olvido",
    subtitle: "La ciudad dormida",
    voz: "Hubo un tiempo en que esta ciudad no pedía permiso para brillar. Una época vibrante que dejó huella en cada grieta del Eixample y en la mirada de sus gentes. Pareciera que Barcelona ha olvidado quién es… o lo que es capaz de provocar.",
    idea: "La ciudad no está muerta: está dormida.",
    visual:
      "Amanecer gris azulado. Planos fijos, simetría de chaflanes vacíos. Persianas bajadas, un neón apagado, una grieta en la piedra en macro. LUT ceniza, contraste bajo. Un único dolly frontal lentísimo. Nadie mira a cámara.",
    sonido:
      "Piano solo, notas sueltas con reverb de sala grande. Sin percusión. El foley es protagonista: persiana metálica, pasos aislados. El silencio pesa más que la música.",
    locucion:
      "Grave y confidencial, como quien recuerda en voz baja. Pausa de 1 s tras «brillar». El final casi susurrado, con los puntos suspensivos audibles.",
  },
  {
    n: "02",
    time: "0:22 – 0:45",
    kicker: "Acto 2 · Bocaccio y el archivo",
    title: "El precedente",
    subtitle: "Bocaccio y el archivo",
    voz: "Pero esto ya lo hemos vivido. A finales de los sesenta, entre el humo de las tertulias y las copas en Bocaccio, una estirpe de mentes libres decidió romper el molde. Convirtieron la noche en arte, el ocio en cultura y la irreverencia en pura vanguardia.",
    idea: "Ya existe el precedente. Solo hay que repetirlo.",
    visual:
      "Archivo real intercalado con recreación en textura 16 mm: grano grueso, halación, gate weave. Tungsteno, humo atravesando un haz de luz. Insertos: hielo cayendo, una cerilla, una risa desenfocada. Ámbar sepia con negros lavados.",
    sonido:
      "Contrabajo en pizzicato y escobillas. Jazz de club filtrado, como si sonara en la sala de al lado. Foley: murmullo de tertulia, cristal contra cristal. Un chasquido de proyector marca cada salto al archivo.",
    locucion:
      "Sube el brillo y la energía. Ritmo ágil, cómplice, casi divertido. «Bocaccio» se pronuncia con gusto. La tríada final —arte / cultura / vanguardia— como tres golpes secos.",
  },
  {
    n: "03",
    time: "0:45 – 0:52",
    kicker: "Acto 3 · La bisagra",
    title: "La llamada",
    subtitle: "La bisagra",
    voz: "Hoy, la historia vuelve a pedirnos paso.",
    idea: "Un fósforo. Nada más.",
    visual:
      "Corte seco del archivo al presente. Dos fotogramas en negro y un único plano simbólico: un fósforo que prende. Primer plano cerrado, fondo negro, una sola luz práctica. El color pasa del ceniza al ámbar.",
    sonido:
      "Silencio absoluto durante 0,8 s. Un único golpe grave de sub bajo precedido de reverb inversa. Un foley aislado y enorme: el raspado del fósforo. Nada más suena.",
    locucion:
      "La frase más lenta del film. Pausa antes y después. Hablada, no actuada. Es la bisagra del relato: si se sobreactúa, la pieza pierde credibilidad.",
  },
  {
    n: "04",
    time: "0:52 – 1:20",
    kicker: "Acto 4 · Los oficios, por dentro",
    title: "La infiltración",
    subtitle: "Los oficios, por dentro",
    voz: "Vamos a infiltrarnos en el interior de los nuevos locales que están llamados a reinventar el corazón de la ciudad. A retratar el alma y la finura de quienes la sostienen: restauradores audaces, bartenders de culto, artistas de la barra y del plato que se juegan el tipo por devolvernos la sofisticación.",
    idea: "No observamos el oficio: entramos en él.",
    visual:
      "Aquí empieza el documental. Plano secuencia con gimbal: puerta, pasillo, pase de cocina, barra. Retratos de 1 a 2 s, mirada a cámara, luz de velas y latón. Insertos macro: la coctelera, el humo del pase, el filo. Cálido, negros profundos, piel rica.",
    sonido:
      "Entra el pulso: kick suave a 100 BPM y cuerdas en staccato. El montaje corta a tiempo. El foley se vuelve percusivo —hielo, plancha, corcho, cuchillo— hasta integrarse en la base rítmica.",
    locucion:
      "Crescendo controlado. La enumeración se escala: cada oficio con más peso que el anterior. La voz sube en intención, no en velocidad. No acelerar nunca.",
  },
  {
    n: "05",
    time: "1:20 – 1:32",
    kicker: "Acto 5 · Los retos, con estilo",
    title: "El carácter",
    subtitle: "Los retos, con estilo",
    voz: "Y si por el camino nos encontramos con retos o problemáticas, los abordaremos como siempre lo ha hecho esta ciudad: con carisma, ingenio y talento.",
    idea: "Los retos se resuelven con estilo, nunca con queja.",
    visual:
      "Un respiro. Cámara en mano, más suelta y humana: una conversación real, una discusión que acaba en risas, la calle a las dos de la mañana. La fricción urbana como guiño visual, nunca como denuncia. Luz mixta y más aire.",
    sonido:
      "La percusión se aligera. Regresa el motivo de piano del Acto 1, ahora en modo mayor: la misma melodía con otra emocionalidad. Foley cálido: sala llena, cubiertos, conversación ininteligible.",
    locucion:
      "Media sonrisa audible; complicidad, nunca queja. Pausa antes de la tríada y decir «carisma, ingenio y talento» con separación, apoyando el peso en la última palabra.",
  },
  {
    n: "06",
    time: "1:32 – 1:50",
    kicker: "Acto 6 · El último tramo narrado",
    title: "El manifiesto",
    subtitle: "El último tramo narrado",
    voz: "Porque las grandes épocas no se firman en los despachos; se conquistan en las mesas, en la nocturnidad y en las ideas que surgen al abrigo de una buena copa. Es hora de encender de nuevo la pasión y devolver a Barcelona su lugar en el mundo.",
    idea: "La última frase en castellano. Después ya no narra nadie.",
    visual:
      "Montaje acelerado que recupera todo lo visto, cortes cada vez más breves. Se abre a la ciudad viva: terrazas llenas, dron nocturno sobre el Eixample encendido, el mar al fondo. El último plano cae sobre la palabra «mundo».",
    sonido:
      "Crescendo sinfónico electrónico: cuerdas, sintetizador analógico y percusión orquestal. Toda la pieza está compuesta para culminar en «mundo» y cortarse ahí en seco, dejando una cola de reverb.",
    locucion:
      "Máximo peso, mínima velocidad. El narrador se despide sin saberlo. «Su lugar en el mundo» con la barbilla alta: la única frase del film que sí se proclama.",
  },
];

type Slide = { id: string; render: () => ReactNode };

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export default function PitchDeck() {
  const slides: Slide[] = useMemo(
    () => [
      /* 1 · PORTADA -------------------------------------------------- */
      {
        id: "portada",
        render: () => (
          <div className="pt-slide pt-cover">
            <span className="pt-eyebrow">Pitch de producción · Barcelona 2026</span>
            <h1 className="pt-cover-title">
              Tornem a ser
              <br />
              <span className="pt-amber">Barcelona</span>
            </h1>
            <p className="pt-cover-sub">
              Microdocumental manifiesto sobre el renacer nocturno, gastronómico
              y cultural del centro de Barcelona.
            </p>
            <div className="pt-meta-row">
              <div className="pt-meta">
                <span className="pt-meta-k">Formato</span>
                <span className="pt-meta-v">Microdocumental</span>
              </div>
              <div className="pt-meta">
                <span className="pt-meta-k">Duración</span>
                <span className="pt-meta-v">2&apos; 00&quot;</span>
              </div>
              <div className="pt-meta">
                <span className="pt-meta-k">Publica</span>
                <span className="pt-meta-v">Gastroconnect</span>
              </div>
              <div className="pt-meta">
                <span className="pt-meta-k">Rodaje</span>
                <span className="pt-meta-v">Centro de Barcelona</span>
              </div>
            </div>
          </div>
        ),
      },

      /* 2 · EL PROYECTO ---------------------------------------------- */
      {
        id: "proyecto",
        render: () => (
          <div className="pt-slide">
            <span className="pt-eyebrow">El proyecto</span>
            <h2 className="pt-statement">
              Una ciudad no se reactiva con campañas.
              <br />
              <span className="pt-amber">Se reactiva con relato.</span>
            </h2>
            <div className="pt-cards pt-cards-3">
              <article className="pt-card">
                <span className="pt-card-n">01</span>
                <h3>Propósito</h3>
                <p>
                  Sacudir la apatía del centro de Barcelona y devolverle su
                  personalidad, su dinamismo y su influencia. No describimos un
                  problema: encendemos una intención colectiva y ponemos nombre
                  a quienes ya la están ejerciendo.
                </p>
              </article>
              <article className="pt-card">
                <span className="pt-card-n">02</span>
                <h3>Contenido</h3>
                <p>
                  Documentamos las nuevas aperturas de restaurantes, bares y
                  coctelerías del centro. Entrevistamos a restauradores,
                  bartenders y creativos. Los retos se abordan con carisma,
                  talento e ingenio.
                </p>
              </article>
              <article className="pt-card">
                <span className="pt-card-n">03</span>
                <h3>Posición</h3>
                <p>
                  Se publica a través de Gastroconnect, pero la marca no se
                  nombra en la locución. La pieza debe sentirse como un
                  manifiesto de ciudad, no como publicidad.
                </p>
              </article>
            </div>
          </div>
        ),
      },

      /* 3 · REFERENCIA CULTURAL -------------------------------------- */
      {
        id: "referencia",
        render: () => (
          <div className="pt-slide">
            <span className="pt-eyebrow">La referencia cultural</span>
            <h2 className="pt-h2">
              La <span className="pt-amber">Gauche Divine</span>
            </h2>
            <blockquote className="pt-quote">
              «Convirtieron la noche en arte, el ocio en cultura y la
              irreverencia en pura vanguardia.»
            </blockquote>
            <p className="pt-lead">
              Barcelona, 1968–1975. Arquitectos, editores, fotógrafos, cineastas
              y modelos que usaron la noche como territorio de libertad en pleno
              tardofranquismo. Su epicentro fue Bocaccio, la sala abierta por
              Oriol Regàs en la calle Muntaner en 1967.
            </p>
            <div className="pt-cards pt-cards-3">
              <article className="pt-card pt-card-sm">
                <h3>El método</h3>
                <p>
                  La ciudad no se transformó desde los despachos, sino desde las
                  mesas y las barras.
                </p>
              </article>
              <article className="pt-card pt-card-sm">
                <h3>El legado</h3>
                <p>
                  Diseño, edición, la Escuela de Barcelona y la fotografía de
                  Colita, Maspons y Miserachs.
                </p>
              </article>
              <article className="pt-card pt-card-sm">
                <h3>Lo que tomamos</h3>
                <p>
                  No la nostalgia ni la estética: la actitud. Ambición, humor y
                  fe en el talento propio.
                </p>
              </article>
            </div>
          </div>
        ),
      },

      /* 4 · TERRITORIO DE MARCA -------------------------------------- */
      {
        id: "territorio",
        render: () => (
          <div className="pt-slide">
            <span className="pt-eyebrow">Territorio de marca</span>
            <h2 className="pt-h2">Reglas del manifiesto</h2>
            <div className="pt-cards pt-cards-2">
              <article className="pt-card pt-card-yes">
                <h3>Lo que es</h3>
                <ul className="pt-list">
                  <li>Un manifiesto colectivo de ciudad.</li>
                  <li>Un documental de autor con vocación de serie.</li>
                  <li>Una invitación abierta a formar parte.</li>
                  <li>Una pieza que la comunidad comparte como propia.</li>
                </ul>
              </article>
              <article className="pt-card pt-card-no">
                <h3>Lo que no es</h3>
                <ul className="pt-list">
                  <li>Un spot publicitario con logo protagonista.</li>
                  <li>Una queja sobre el estado de la ciudad.</li>
                  <li>Un catálogo o un ranking de locales.</li>
                  <li>Una pieza nostálgica que mira solo hacia atrás.</li>
                </ul>
              </article>
            </div>
            <p className="pt-warn">
              La marca no se nombra jamás en la locución. Gastroconnect firma al
              final, en tipografía discreta sobre negro, cuando el mensaje ya
              pertenece al espectador.
            </p>
          </div>
        ),
      },

      /* 5 · ESTRUCTURA NARRATIVA ------------------------------------- */
      {
        id: "estructura",
        render: () => (
          <div className="pt-slide">
            <span className="pt-eyebrow">Estructura narrativa</span>
            <h2 className="pt-h2">
              Arquitectura del film{" "}
              <span className="pt-amber pt-h2-tag">7 actos · 2&apos; 00&quot;</span>
            </h2>
            <div className="pt-timeline">
              {acts.map((a) => (
                <div className="pt-tl-item" key={a.n}>
                  <span className="pt-tl-n">{a.n}</span>
                  <span className="pt-tl-time">{a.time}</span>
                  <span className="pt-tl-title">{a.title}</span>
                  <span className="pt-tl-sub">{a.subtitle}</span>
                </div>
              ))}
              <div className="pt-tl-item pt-tl-final">
                <span className="pt-tl-n">07</span>
                <span className="pt-tl-time">1:50 – 2:00</span>
                <span className="pt-tl-title">Cara a càmera</span>
                <span className="pt-tl-sub">El trencament final</span>
              </div>
            </div>
            <p className="pt-foot">Siete actos encadenados sin respiro.</p>
          </div>
        ),
      },

      /* 6–11 · ACTOS 1–6 -------------------------------------------- */
      ...acts.map((a) => ({
        id: `acto-${a.n}`,
        render: () => (
          <div className="pt-slide pt-act">
            <div className="pt-act-head">
              <span className="pt-act-num">{a.n}</span>
              <div>
                <span className="pt-eyebrow">{a.kicker}</span>
                <h2 className="pt-act-title">
                  {a.title}
                  <span className="pt-act-time">{a.time}</span>
                </h2>
              </div>
            </div>
            <blockquote className="pt-voz">“{a.voz}”</blockquote>
            <p className="pt-idea">
              <span className="pt-idea-k">Idea fuerza</span>
              {a.idea}
            </p>
            <div className="pt-cards pt-cards-3 pt-act-notes">
              <article className="pt-card pt-card-sm">
                <h3>Imagen</h3>
                <p>{a.visual}</p>
              </article>
              <article className="pt-card pt-card-sm">
                <h3>Sonido y música</h3>
                <p>{a.sonido}</p>
              </article>
              <article className="pt-card pt-card-sm">
                <h3>Locución</h3>
                <p>{a.locucion}</p>
              </article>
            </div>
          </div>
        ),
      })),

      /* 12 · EQUIPO -------------------------------------------------- */
      {
        id: "equipo",
        render: () => (
          <div className="pt-slide">
            <span className="pt-eyebrow">Quiénes abanderan el proyecto</span>
            <h2 className="pt-h2">Los tres que lo firman</h2>
            <div className="pt-cards pt-cards-3">
              <article className="pt-card pt-team">
                <h3>Guillem Mitats</h3>
                <span className="pt-team-role">Estrategia y visión de negocio</span>
                <p>
                  Emprendedor y estratega. El engranaje que convierte una idea
                  de ciudad en un proyecto que ocurre: conecta la visión
                  creativa con la ejecución real, los locales y los tiempos.
                </p>
                <span className="pt-team-adds">
                  Aporta · Ejecución, alianzas y sostenibilidad
                </span>
              </article>
              <article className="pt-card pt-team">
                <h3>Enric Rebordosa</h3>
                <span className="pt-team-role">Autoridad y memoria del sector</span>
                <p>
                  Uno de los nombres más influyentes de la restauración
                  barcelonesa. Aporta el peso de la industria, la alta
                  gastronomía y una autenticidad local que no se fabrica.
                </p>
                <span className="pt-team-adds">
                  Aporta · Credibilidad, prestigio y legitimidad local
                </span>
              </article>
              <article className="pt-card pt-team">
                <h3>Quique Roca</h3>
                <span className="pt-team-role">Altavoz, comunidad y divulgación</span>
                <p>
                  Fundador de Gastroconnect, el canal y podcast de referencia
                  del sector. Representa a la nueva generación y su capacidad de
                  convocatoria: garantiza que esto se convierta en conversación.
                </p>
                <span className="pt-team-adds">
                  Aporta · Alcance, comunidad y continuidad del relato
                </span>
              </article>
            </div>
            <p className="pt-foot">
              Tres generaciones y tres ángulos del mismo sector: quien lo
              ejecuta, quien lo ha construido y quien lo cuenta. Los tres cierran
              el film mirando a cámara.
            </p>
          </div>
        ),
      },

      /* 13 · ACTO 7 · CARA A CÀMERA ---------------------------------- */
      {
        id: "acto-7",
        render: () => (
          <div className="pt-slide">
            <span className="pt-eyebrow">Acto 7 · El clímax final</span>
            <h2 className="pt-h2">
              Cara a càmera{" "}
              <span className="pt-amber pt-h2-tag">1:50 – 2:00</span>
            </h2>
            <div className="pt-cards pt-cards-3">
              <article className="pt-card pt-camera">
                <span className="pt-plano">Plano 1 · 1:50–1:53</span>
                <p className="pt-cat-line">“Tornem a fer-la gran.”</p>
                <span className="pt-team-role">Guillem Mitats</span>
              </article>
              <article className="pt-card pt-camera">
                <span className="pt-plano">Plano 2 · 1:53–1:56</span>
                <p className="pt-cat-line">“Tornem a fer-la divina.”</p>
                <span className="pt-team-role">Enric Rebordosa</span>
              </article>
              <article className="pt-card pt-camera">
                <span className="pt-plano">Plano 3 · 1:56–2:00</span>
                <p className="pt-cat-line">“Tornem a ser Barcelona.”</p>
                <span className="pt-team-role">Quique Roca</span>
              </article>
            </div>
            <p className="pt-lead pt-lead-center">
              <strong className="pt-amber">El castellano narra; el catalán compromete.</strong>{" "}
              Desaparece el narrador y aparecen tres personas reales, con nombre,
              cara y lengua propia. Se rompe la cuarta pared: la música para en
              seco sobre «mundo» y los últimos diez segundos van casi a cappella.
              El logotipo entra sobre el silencio.
            </p>
          </div>
        ),
      },

      /* 14 · DIRECCIÓN DE SONIDO ------------------------------------- */
      {
        id: "sonido",
        render: () => (
          <div className="pt-slide">
            <span className="pt-eyebrow">Dirección de sonido</span>
            <h2 className="pt-h2">
              La lección de <span className="pt-amber">Midnight in Paris</span>
            </h2>
            <p className="pt-lead">
              Woody Allen, 2011. Sin banda sonora orquestal original: música de
              fuente, archivo real mezclado con grabaciones nuevas que recrean el
              idioma de la época. Suena antigua y contemporánea a la vez. Eso es
              exactamente lo que necesita esta pieza.
            </p>
            <div className="pt-cards pt-cards-4">
              <article className="pt-card pt-card-sm">
                <h3>Tema principal</h3>
                <p>
                  Guitarra manouche de cuerda de nylon. Un único motivo que
                  regresa en los actos 2, 5 y 7.
                </p>
              </article>
              <article className="pt-card pt-card-sm">
                <h3>Apertura</h3>
                <p>
                  Clarinete o saxo soprano solo, con textura de grabación
                  antigua. Abre el Acto 1 en lugar del piano.
                </p>
              </article>
              <article className="pt-card pt-card-sm">
                <h3>Época</h3>
                <p>
                  Contrabajo, escobillas y piano de salón para el bloque de
                  archivo del Acto 2.
                </p>
              </article>
              <article className="pt-card pt-card-sm">
                <h3>Presente</h3>
                <p>
                  La misma guitarra sobre un pulso contemporáneo en el Acto 4.
                  Sin sintetizador ni percusión orquestal.
                </p>
              </article>
            </div>
            <p className="pt-warn">
              Una sola melodía en todo el film: cambian el instrumento y el
              tempo, nunca el tema. Y el Acto 7 va sin música: solo voz directa y
              sala.
            </p>
          </div>
        ),
      },

      /* 15 · DIRECCIÓN DE LOCUCIÓN ----------------------------------- */
      {
        id: "locucion",
        render: () => (
          <div className="pt-slide">
            <span className="pt-eyebrow">Dirección de locución</span>
            <h2 className="pt-h2">La voz que sostiene el film</h2>
            <div className="pt-cards pt-cards-3">
              <article className="pt-card pt-card-sm">
                <h3>Casting</h3>
                <p>
                  Registro grave medio, 40–55 años, dicción castellana neutra
                  con calidez. Un timbre con recorrido vital, no comercial. Se
                  prueba también en femenino.
                </p>
              </article>
              <article className="pt-card pt-card-sm">
                <h3>Técnica</h3>
                <p>
                  Condensador de gran diafragma, cabina tratada, trabajo de
                  cercanía. Compresión suave: buscamos respiración audible, no
                  una voz plana de publicidad.
                </p>
              </article>
              <article className="pt-card pt-card-sm">
                <h3>Ritmo global</h3>
                <p>
                  Unas 110 palabras por minuto. Tres tomas completas de
                  referencia y pick ups acto por acto. La respiración se conserva
                  en la mezcla.
                </p>
              </article>
            </div>
            <div className="pt-rules">
              <span className="pt-rules-k">Cuatro reglas innegociables</span>
              <ol className="pt-rules-list">
                <li>La voz nunca va por encima de la música: va por debajo y hacia dentro.</li>
                <li>El silencio forma parte del texto. Las pausas están escritas.</li>
                <li>Se lee a una sola persona, nunca a una audiencia.</li>
                <li>La voz en off termina en el Acto 6: el final se dice a cámara.</li>
              </ol>
            </div>
          </div>
        ),
      },

      /* 16 · PRODUCCIÓN ---------------------------------------------- */
      {
        id: "produccion",
        render: () => (
          <div className="pt-slide">
            <span className="pt-eyebrow">Producción</span>
            <h2 className="pt-h2">Calendario y entrega</h2>
            <div className="pt-cards pt-cards-4">
              <article className="pt-card pt-card-sm">
                <span className="pt-card-n">01</span>
                <h3>Edición · 2 semanas</h3>
                <p>Montaje, etalonaje y mezcla a partir del material rodado.</p>
              </article>
              <article className="pt-card pt-card-sm">
                <span className="pt-card-n">02</span>
                <h3>Primer entregable</h3>
                <p>Semana del 24. Primer corte completo para revisión.</p>
              </article>
              <article className="pt-card pt-card-sm">
                <span className="pt-card-n">03</span>
                <h3>Ronda de edición</h3>
                <p>Una sola. Los cambios se recogen en un documento y se aplican de una vez.</p>
              </article>
              <article className="pt-card pt-card-sm">
                <span className="pt-card-n">04</span>
                <h3>Entrega final</h3>
                <p>1.ª sem. de agosto. Máster cerrado y todas las versiones listas.</p>
              </article>
            </div>
            <div className="pt-deliver">
              <div className="pt-deliver-block">
                <span className="pt-deliver-k">Qué se entrega</span>
                <p>
                  Máster de 2&apos; 00&quot; · versión vertical 9:16 · tres
                  teasers de 15 s · subtítulos en castellano, catalán e inglés.
                </p>
              </div>
              <div className="pt-deliver-block pt-deliver-date">
                <span className="pt-deliver-k">Publicación</span>
                <p>
                  <strong className="pt-amber">Domingo 6 de septiembre de 2026.</strong>{" "}
                  La ciudad ya ha vuelto de vacaciones, el sector reabre y la
                  audiencia está otra vez con el móvil en la mano.
                </p>
              </div>
            </div>
          </div>
        ),
      },

      /* 17 · CIERRE -------------------------------------------------- */
      {
        id: "cierre",
        render: () => (
          <div className="pt-slide pt-closing">
            <blockquote className="pt-closing-quote">
              Tornem a fer-la gran.
              <br />
              Tornem a fer-la divina.
              <br />
              <span className="pt-amber">Tornem a ser Barcelona.</span>
            </blockquote>
            <div className="pt-closing-foot">
              <span>Barcelona · 2026</span>
              <span className="pt-closing-brand">Gastroconnect</span>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((prev) => {
        const clamped = Math.max(0, Math.min(total - 1, next));
        setDir(clamped >= prev ? 1 : -1);
        return clamped;
      });
    },
    [total],
  );

  const goNext = useCallback(() => go(index + 1), [go, index]);
  const goPrev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(total - 1);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, go, total]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  return (
    <div className="pt-root" ref={containerRef}>
      <div className="pt-grain" aria-hidden />
      <div className="pt-glow" aria-hidden />

      <div className="pt-stage">
        <div
          key={index}
          className={`pt-anim ${dir === 1 ? "pt-anim-next" : "pt-anim-prev"}`}
        >
          {slides[index].render()}
        </div>
      </div>

      {/* Zonas de click para avanzar/retroceder */}
      <button
        className="pt-zone pt-zone-prev"
        onClick={goPrev}
        aria-label="Anterior"
        disabled={index === 0}
      />
      <button
        className="pt-zone pt-zone-next"
        onClick={goNext}
        aria-label="Siguiente"
        disabled={index === total - 1}
      />

      {/* Barra de progreso superior */}
      <div className="pt-progress" aria-hidden>
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      {/* Controles */}
      <div className="pt-hud">
        <span className="pt-hud-brand">Tornem a ser Barcelona</span>
        <div className="pt-hud-nav">
          <button onClick={goPrev} disabled={index === 0} aria-label="Anterior">
            ‹
          </button>
          <span className="pt-hud-count">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            onClick={goNext}
            disabled={index === total - 1}
            aria-label="Siguiente"
          >
            ›
          </button>
          <button
            className="pt-hud-fs"
            onClick={toggleFullscreen}
            aria-label="Pantalla completa"
            title="Pantalla completa (F)"
          >
            ⤢
          </button>
        </div>
      </div>

      {/* Puntos de navegación */}
      <div className="pt-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={i === index ? "pt-dot pt-dot-on" : "pt-dot"}
            onClick={() => go(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
