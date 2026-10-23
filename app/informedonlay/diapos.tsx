import type { CSSProperties, ReactNode } from "react";
import { FOTO, PUBLICACIONES, imagen, post, type Publicacion } from "./datos";

/**
 * Diapositivas del informe de Instagram + propuesta de contenido de Don Lay.
 *
 * Los textos son los del documento conjunto de Canva («Don Lay · Informe de
 * Instagram y propuesta de contenido»): aquí solo cambia la maqueta, que sigue
 * el Brand Manual 2026 (colores, tipografías, logotipo y franja de cabecera).
 *
 * Normas de comunicación de Don Lay: siempre «cocina cantonesa», nunca
 * «china», y nunca la palabra «tradicional».
 */

export type Diapo = { id: string; titulo: string; contenido: ReactNode };

type Fondo = "negro" | "rojo" | "beige";

/* ── Piezas comunes ─────────────────────────────────────────────────────── */

function Cab({ parte }: { parte: "informe" | "propuesta" }) {
  return (
    <div className="d-cab">
      <span>
        <b>Don Lay</b> · {parte === "informe" ? "Informe de Instagram" : "Propuesta de contenido"}
      </span>
      <img src="/informedonlay/icono-beige.svg" alt="" />
      <span>Maen Studios × Don Lay</span>
    </div>
  );
}

function Diapositiva({
  fondo,
  parte,
  cabecera = true,
  children,
}: {
  fondo: Fondo;
  parte: "informe" | "propuesta";
  cabecera?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`d d--${fondo}`}>
      {cabecera && <Cab parte={parte} />}
      {children}
    </section>
  );
}

const abs = (top: number, left: number, width?: number, height?: number): CSSProperties => ({
  position: "absolute",
  top,
  left,
  width,
  height,
});

function Foto({
  src,
  alt,
  style,
  pie,
  posicion,
}: {
  src: string;
  alt: string;
  style: CSSProperties;
  pie?: string;
  posicion?: string;
}) {
  return (
    <div className="d-foto" style={style}>
      <img src={src} alt={alt} style={posicion ? { objectPosition: posicion } : undefined} />
      {pie && <span className="d-pie-foto">{pie}</span>}
    </div>
  );
}

function Video({ src, poster, style }: { src: string; poster: string; style: CSSProperties }) {
  return (
    <div className="d-foto" style={style}>
      <video src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" />
    </div>
  );
}

function Lista({ items, style, tam }: { items: string[]; style: CSSProperties; tam?: number }) {
  return (
    <ul className="d-lista" style={{ ...style, fontSize: tam }}>
      {items.map((t, i) => (
        <li key={t} data-n={String(i + 1).padStart(2, "0")}>
          {t}
        </li>
      ))}
    </ul>
  );
}

function Encabezado({
  etiqueta,
  titulo,
  sub,
  top = 150,
  left = 96,
  width = 1100,
  claseTitulo = "",
}: {
  etiqueta: string;
  titulo: ReactNode;
  sub?: string;
  top?: number;
  left?: number;
  width?: number;
  claseTitulo?: string;
}) {
  return (
    <div style={abs(top, left, width)}>
      <p className="d-et">{etiqueta}</p>
      <h2 className={`d-tit ${claseTitulo}`} style={{ marginTop: 22 }}>
        {titulo}
      </h2>
      {sub && (
        <p className="d-sub" style={{ marginTop: 22 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Cifra({ num, titulo, texto, style }: { num: string; titulo: string; texto: string; style?: CSSProperties }) {
  return (
    <div className="d-cifra" style={style}>
      <p className="d-num">{num}</p>
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </div>
  );
}

/** Mitad foto, mitad título: los separadores de sección del manual */
function Separador({
  fondo,
  parte,
  foto,
  alt,
  etiqueta,
  titulo,
  texto,
  posicion,
}: {
  fondo: Fondo;
  parte: "informe" | "propuesta";
  foto: string;
  alt: string;
  etiqueta: string;
  titulo: string;
  texto?: string;
  posicion?: string;
}) {
  return (
    <Diapositiva fondo={fondo} parte={parte} cabecera={false}>
      <Foto src={foto} alt={alt} style={abs(0, 0, 900, 1080)} posicion={posicion} />
      <img src="/informedonlay/icono-beige.svg" alt="" style={{ ...abs(96, 1000), height: 44, width: "auto" }} />
      <div style={abs(texto ? 300 : 380, 1000, 840)}>
        <p className="d-et">{etiqueta}</p>
        <h2 className="d-tit d-tit--xl" style={{ marginTop: 28, fontSize: texto ? 124 : 150 }}>
          {titulo}
        </h2>
        {texto && (
          <p style={{ marginTop: 40, fontSize: 32, lineHeight: 1.45, opacity: 0.85, maxWidth: 760 }}>{texto}</p>
        )}
      </div>
      <img src="/informedonlay/logo-beige.svg" alt="Don Lay" style={{ ...abs(960, 1000), height: 56, width: "auto" }} />
    </Diapositiva>
  );
}

function Ranking({ items, notas }: { items: Publicacion[]; notas: string[] }) {
  return (
    <div className="d-rank" style={abs(410, 96, 1728)}>
      {items.map((p, i) => (
        <div key={p.n}>
          <figure style={{ aspectRatio: "1 / 1" }}>
            <img src={imagen(p)} alt={p.tema} />
          </figure>
          <p className="d-num">{p.interacciones}</p>
          <h3>
            {p.tema} · {p.formato.toLowerCase()} · {p.fecha}
          </h3>
          <p>{notas[i]}</p>
        </div>
      ))}
    </div>
  );
}

function Movil({ src, alt, style, etiqueta }: { src: string; alt: string; style: CSSProperties; etiqueta?: string }) {
  return (
    <div className="d-movil" style={style}>
      <img src={src} alt={alt} />
      {etiqueta && <span className="d-ref-et">{etiqueta}</span>}
    </div>
  );
}

function DiapoVideos({
  titulo,
  items,
  refs,
}: {
  titulo: string;
  items: string[];
  refs: string[];
}) {
  const alto = 860;
  const ancho = Math.round((alto * 9) / 16);
  return (
    <Diapositiva fondo="negro" parte="propuesta">
      <Encabezado etiqueta="Vídeos" titulo={titulo} width={700} top={170} />
      <Lista items={items} style={abs(470, 96, 700)} tam={28} />
      {refs.map((r, i) => (
        <Movil
          key={r}
          src={`/informedonlay/ref/${r}.jpg`}
          alt={`Referencia de vídeo ${i + 1}`}
          etiqueta="Referencia"
          style={abs(150, (refs.length === 1 ? 1340 : 880 + i * (ancho + 48)) , ancho, alto)}
        />
      ))}
    </Diapositiva>
  );
}

function Pilar({
  n,
  titulo,
  items,
  foto,
  alt,
  fondo,
  posicion,
}: {
  n: string;
  titulo: string;
  items: string[];
  foto: string;
  alt: string;
  fondo: Fondo;
  posicion?: string;
}) {
  return (
    <Diapositiva fondo={fondo} parte="propuesta">
      <Encabezado etiqueta={`Pilar ${n}`} titulo={titulo} width={940} top={170} />
      <Lista items={items} style={abs(560, 96, 900)} tam={30} />
      <Foto src={foto} alt={alt} style={abs(76, 1120, 800, 1004)} posicion={posicion} />
      <span className="d-num" style={{ ...abs(900, 1160), fontSize: 150, color: "#f6f0e8", textShadow: "0 2px 30px rgba(0,0,0,.35)" }}>
        {n}
      </span>
    </Diapositiva>
  );
}

/* ── Las diapositivas ───────────────────────────────────────────────────── */

const top5 = [post(19), post(22), post(1), post(5), post(7)];
const top5Notas = [
  "1.322 de alcance · 21 guardados y 12 compartidos, máximos del periodo",
  "1.915 de alcance, el mayor del periodo · 63 likes · 26 visitas al perfil",
  "1.326 de alcance · 17 guardados",
  "1.432 de alcance · 10 guardados · 20 visitas al perfil",
  "1.143 de alcance · 5 % de engagement · 19 visitas al perfil",
];
const bottom5 = [post(21), post(8), post(15), post(11), post(14)];
const bottom5Notas = [
  "327 de alcance, el más bajo del periodo",
  "875 de alcance · ningún guardado ni compartido",
  "798 de alcance · ningún compartido · 2 visitas al perfil",
  "863 de alcance · ningún compartido · 1 visita al perfil",
  "980 de alcance · 1 guardado y 1 compartido",
];

/* Semanas del periodo para la línea de actividad (lunes 20 abr → 19 oct) */
const INICIO = Date.UTC(2026, 3, 20);
const FECHAS_ISO = [
  "2026-04-26", "2026-05-06", "2026-05-13", "2026-05-20", "2026-05-27", "2026-06-18",
  "2026-06-24", "2026-07-03", "2026-07-10", "2026-07-17", "2026-07-24", "2026-08-07",
  "2026-08-15", "2026-08-21", "2026-08-28", "2026-09-04", "2026-09-08", "2026-09-10",
  "2026-09-11", "2026-09-18", "2026-09-25", "2026-10-15", "2026-10-18", "2026-10-20",
];
const SEMANAS = 27;
const porSemana = Array.from({ length: SEMANAS }, () => [] as Publicacion[]);
FECHAS_ISO.forEach((f, i) => {
  const [a, m, d] = f.split("-").map(Number);
  const s = Math.floor((Date.UTC(a, m - 1, d) - INICIO) / (7 * 864e5));
  porSemana[Math.min(SEMANAS - 1, s)].push(PUBLICACIONES[i]);
});
const MESES = [
  { m: "Abr", s: 0 }, { m: "May", s: 2 }, { m: "Jun", s: 6 }, { m: "Jul", s: 10 },
  { m: "Ago", s: 15 }, { m: "Sep", s: 19 }, { m: "Oct", s: 23 },
];

export const DIAPOS: Diapo[] = [
  {
    id: "portada",
    titulo: "Portada",
    contenido: (
      <Diapositiva fondo="rojo" parte="informe" cabecera={false}>
        <Foto src={FOTO.arbolRojo} alt="Árbol rojo sobre la sala de Don Lay" style={abs(0, 0, 820, 1080)} />
        <p className="d-et" style={abs(96, 920)}>
          @donlayrestaurante · Madrid · Octubre 2026
        </p>
        <img src="/informedonlay/logo-beige.svg" alt="Don Lay" style={{ ...abs(300, 920), width: 640, height: "auto" }} />
        <h1 className="d-tit d-tit--m" style={{ ...abs(620, 920, 900), lineHeight: 1.1 }}>
          Informe de Instagram y propuesta de contenido
        </h1>
        <p style={{ ...abs(960, 920), fontSize: 22, fontWeight: 400, letterSpacing: "0.06em", opacity: 0.8 }}>
          MAEN STUDIOS
        </p>
      </Diapositiva>
    ),
  },
  {
    id: "indice",
    titulo: "Contenido",
    contenido: (
      <Diapositiva fondo="beige" parte="informe">
        <Encabezado etiqueta="Contenido" titulo="Qué hay en este documento" width={900} />
        <div style={{ ...abs(470, 96, 1060), display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 64 }}>
          <Lista
            tam={28}
            style={{}}
            items={["Metodología", "La cuenta hoy", "Actividad", "Rendimiento publicación a publicación"]}
          />
          <ul className="d-lista" style={{ fontSize: 28 }}>
            {["Qué funciona", "Qué no funciona", "Recomendaciones", "Propuesta de contenido"].map((t, i) => (
              <li key={t} data-n={String(i + 5).padStart(2, "0")}>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p style={{ ...abs(880, 96, 1000), fontSize: 24, opacity: 0.7 }}>
          La propuesta recoge el planning del rodaje del 26 de octubre, los cinco pilares de contenido, las referencias y los
          vídeos.
        </p>
        <Foto src={FOTO.dimsumCesta} alt="Cesta de dim sum de Don Lay" style={abs(76, 1240, 680, 1004)} />
      </Diapositiva>
    ),
  },
  {
    id: "metodologia",
    titulo: "Alcance y metodología",
    contenido: (
      <Diapositiva fondo="beige" parte="informe">
        <Encabezado etiqueta="01 · Metodología" titulo="Alcance y metodología" width={1000} />
        <Lista
          style={abs(460, 96, 1000)}
          items={[
            "Periodo: últimos 6 meses",
            "24 publicaciones propias del feed",
            "Datos de Instagram Insights: alcance, vistas, guardados, compartidos y audiencia",
            "Engagement = interacciones / alcance de cada publicación",
            "No incluye stories ni publicaciones en colaboración con otras cuentas",
          ]}
        />
        <Foto src={imagen(post(2))} alt="Chef cortando el pato laqueado" style={abs(76, 1240, 680, 1004)} />
      </Diapositiva>
    ),
  },
  {
    id: "cuenta",
    titulo: "La cuenta hoy",
    contenido: (
      <Diapositiva fondo="negro" parte="informe">
        <Encabezado
          etiqueta="02 · La cuenta hoy"
          titulo="@donlayrestaurante"
          sub="Datos del perfil a 23 de octubre de 2026"
          width={1100}
        />
        <Cifra num="27.161" titulo="Seguidores" texto="La cuenta sigue a 147 perfiles" style={abs(470, 96, 500)} />
        <Cifra num="949" titulo="Publicaciones" texto="Histórico total del feed" style={abs(470, 660, 500)} />
        <div style={{ ...abs(780, 96, 1080), display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px 64px" }}>
          {[
            ["Bio", "Alta cocina cantonesa en Madrid. Fundado por @nieves.ye · Pato laqueado y dim sum hechos a mano · Coctelería de autor"],
            ["Enlace", "Reserva directa · donlayrestaurante.es/reservas"],
            ["Destacadas", "Prensa, Info, Carta, Gente, Origen: cubren lo que consulta alguien antes de reservar"],
            ["Fijada", "Retrato de Nieves: pone cara al proyecto desde el primer vistazo al perfil"],
          ].map(([t, x]) => (
            <div key={t} style={{ fontSize: 21, lineHeight: 1.4 }}>
              <b style={{ fontWeight: 500, display: "block", marginBottom: 4 }}>{t}</b>
              <span style={{ opacity: 0.75 }}>{x}</span>
            </div>
          ))}
        </div>
        <Foto src={imagen(post(22))} alt="Retrato de Nieves Ye, fundadora de Don Lay" style={abs(76, 1240, 680, 1004)} />
      </Diapositiva>
    ),
  },
  {
    id: "actividad",
    titulo: "Ritmo y formatos de publicación",
    contenido: (
      <Diapositiva fondo="beige" parte="informe">
        <Encabezado etiqueta="03 · Actividad" titulo="Ritmo y formatos de publicación" width={1060} />
        <Lista
          style={abs(460, 96, 1060)}
          items={[
            "24 publicaciones en 6 meses: una por semana de media",
            "Tres parones de 2 a 3 semanas: junio, agosto y octubre",
            "11 carruseles, 11 fotos y solo 2 reels",
            "Casi la mitad sale en viernes, el día de menos alcance",
          ]}
        />
        {/* Línea de actividad: una columna por semana */}
        <div style={abs(860, 96, 1060, 150)}>
          <p style={{ fontSize: 18, fontWeight: 500, letterSpacing: "0.04em", opacity: 0.6, marginBottom: 14 }}>
            Publicaciones por semana
          </p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${SEMANAS}, 1fr)`, gap: 6, alignItems: "end", height: 64 }}>
            {porSemana.map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column-reverse", gap: 4, height: "100%" }}>
                {s.length === 0 ? (
                  <span style={{ height: 3, background: "rgba(29,29,27,.25)" }} />
                ) : (
                  s.map((p) => (
                    <span
                      key={p.n}
                      title={`${p.fecha} · ${p.formato}`}
                      style={{ height: 18, background: p.formato === "Reel" ? "#79242f" : "#1d1d1b" }}
                    />
                  ))
                )}
              </div>
            ))}
          </div>
          <div style={{ position: "relative", height: 26, marginTop: 10, fontSize: 16, opacity: 0.6 }}>
            {MESES.map((m) => (
              <span key={m.m} style={{ position: "absolute", left: `${(m.s / SEMANAS) * 100}%` }}>
                {m.m}
              </span>
            ))}
            <span style={{ position: "absolute", right: 0, color: "#79242f", opacity: 1 }}>■ Reel</span>
          </div>
        </div>
        <Foto src={FOTO.salaLamparas} alt="Sala de Don Lay" style={abs(76, 1240, 680, 1004)} />
      </Diapositiva>
    ),
  },
  {
    id: "sep-rendimiento",
    titulo: "Rendimiento",
    contenido: (
      <Separador
        fondo="negro"
        parte="informe"
        foto={FOTO.wokFuego}
        alt="Cocinero salteando al wok con fuego vivo"
        etiqueta="04 · Rendimiento"
        titulo="Publicación a publicación"
      />
    ),
  },
  {
    id: "galeria",
    titulo: "Las 24 publicaciones",
    contenido: (
      <Diapositiva fondo="negro" parte="informe">
        <Encabezado
          etiqueta="04 · Rendimiento · La cifra de cada publicación son sus interacciones"
          titulo="Las 24 publicaciones"
          sub="Todo el feed de los últimos 6 meses, por orden de publicación. Los dos reels se reproducen en vídeo."
          width={1728}
          top={120}
        />
        <div className="d-gal" style={{ top: 368 }}>
          {PUBLICACIONES.map((p) => (
            <figure key={p.n}>
              {p.video ? (
                <video src={p.video} poster={imagen(p)} autoPlay muted loop playsInline preload="metadata" />
              ) : (
                <img src={imagen(p)} alt={p.tema} />
              )}
              {p.video && <span className="d-marca-reel">Reel</span>}
              <figcaption>
                <b>{p.interacciones}</b>
                {p.fecha} · {p.formato}
              </figcaption>
            </figure>
          ))}
        </div>
      </Diapositiva>
    ),
  },
  {
    id: "cifras",
    titulo: "Cifras del periodo",
    contenido: (
      <Diapositiva fondo="beige" parte="informe">
        <Encabezado
          etiqueta="04 · Rendimiento"
          titulo="Cifras del periodo"
          sub="24 publicaciones propias del feed · últimos 6 meses"
          width={1100}
        />
        <div style={{ ...abs(420, 96, 1340), display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px 52px" }}>
          <Cifra num="26.687" titulo="Cuentas alcanzadas" texto="1.112 de media por publicación: cada publicación llega al 4 % de los seguidores" />
          <Cifra num="46.460" titulo="Vistas" texto="1.936 de media por publicación" />
          <Cifra num="960" titulo="Interacciones" texto="40 por publicación · engagement medio del 3,7 % sobre el alcance" />
          <Cifra num="103 / 89" titulo="Guardados y compartidos" texto="Más de la mitad de los guardados vienen de solo 4 publicaciones" />
          <Cifra num="27" titulo="Comentarios en 6 meses" texto="1,1 por publicación: apenas hay conversación con la comunidad" />
          <Cifra num="239 / 8" titulo="Visitas al perfil y nuevos seguidores" texto="Generados directamente por las publicaciones (Instagram no lo mide en reels)" />
        </div>
        <Foto src={imagen(post(5))} alt="Cabracho «Dragón de Mar»" style={abs(76, 1500, 420, 1004)} />
      </Diapositiva>
    ),
  },
  {
    id: "formatos",
    titulo: "Comparativa por formato",
    contenido: (
      <Diapositiva fondo="negro" parte="informe">
        <Encabezado etiqueta="04 · Rendimiento" titulo="Comparativa por formato" sub="Media por publicación · últimos 6 meses" width={1400} top={140} />
        <div style={{ ...abs(420, 96, 1728), display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 56 }}>
          {[
            { f: "Carrusel", v: 48, n: 11, p: post(19), t: "1.144 de alcance · 6,7 guardados · 4,9 compartidos · 4,2 % de engagement" },
            { f: "Foto", v: 32, n: 11, p: post(22), t: "1.069 de alcance · 2,1 guardados · 2,6 compartidos · 3,1 % de engagement" },
            { f: "Reel", v: 40, n: 2, p: post(6), t: "1.172 de alcance · 4,5 s de visionado medio · 64–74 % abandona en los 3 primeros segundos" },
          ].map((c) => (
            <div key={c.f} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 28 }}>
              <div style={{ width: 150, height: 188, overflow: "hidden" }}>
                {c.p.video ? (
                  <video src={c.p.video} poster={imagen(c.p)} autoPlay muted loop playsInline style={{ width: "100%", height: "100%" }} />
                ) : (
                  <img src={imagen(c.p)} alt={c.p.tema} style={{ width: "100%", height: "100%" }} />
                )}
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--serif)", fontWeight: 300, fontSize: 54, lineHeight: 1 }}>{c.f}</h3>
                <p style={{ fontSize: 22, marginTop: 10 }}>
                  <b style={{ fontWeight: 500 }}>{c.v} interacciones</b> · {c.n} publicaciones
                </p>
                <div className="d-barra">
                  <span style={{ width: `${(c.v / 48) * 100}%` }} />
                </div>
                <p style={{ fontSize: 20, lineHeight: 1.4, opacity: 0.75 }}>{c.t}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...abs(760, 96, 1728), display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 56 }}>
          <Cifra num="+50 %" titulo="El carrusel supera a la foto" texto="La mitad más de interacciones y el triple de guardados con un alcance similar" />
          <Cifra num="8 %" titulo="Peso del reel en el feed" texto="2 de 24 publicaciones: el formato con más recorrido fuera de los seguidores apenas se usa" />
          <Cifra num="Viernes" titulo="El día más usado, el de menos alcance" texto="11 de 24 publicaciones · 947 de alcance medio frente a 1.325 los miércoles y 1.743 los jueves" />
        </div>
      </Diapositiva>
    ),
  },
  {
    id: "top5",
    titulo: "Top 5 publicaciones",
    contenido: (
      <Diapositiva fondo="beige" parte="informe">
        <Encabezado
          etiqueta="04 · Rendimiento"
          titulo="Top 5 publicaciones"
          sub="Ordenadas por interacciones: likes, comentarios, guardados y compartidos"
          width={1150}
          top={130}
        />
        <div style={{ ...abs(150, 1330, 494), borderLeft: "1px solid rgba(29,29,27,.3)", paddingLeft: 36 }}>
          <p className="d-num" style={{ fontSize: 72 }}>4 de 5</p>
          <p style={{ fontSize: 24, fontWeight: 500, marginTop: 10, lineHeight: 1.3 }}>Son carruseles con algo concreto que contar</p>
          <p style={{ fontSize: 19, marginTop: 8, opacity: 0.75, lineHeight: 1.4 }}>
            Un plato explicado, la sala en acción, una persona o un dato útil: dan motivo para guardar y compartir
          </p>
        </div>
        <Ranking items={top5} notas={top5Notas} />
      </Diapositiva>
    ),
  },
  {
    id: "bottom5",
    titulo: "Lo que menos rinde",
    contenido: (
      <Diapositiva fondo="negro" parte="informe">
        <Encabezado
          etiqueta="04 · Rendimiento"
          titulo="Lo que menos rinde"
          sub="Menos interacciones del periodo (sin contar la del 20 oct, publicada hace solo 3 días)"
          width={1150}
          top={130}
        />
        <div style={{ ...abs(150, 1330, 494), borderLeft: "1px solid rgba(246,240,232,.3)", paddingLeft: 36 }}>
          <p className="d-num" style={{ fontSize: 72 }}>5 de 5</p>
          <p style={{ fontSize: 24, fontWeight: 500, marginTop: 10, lineHeight: 1.3 }}>Son fotos sueltas con un copy genérico</p>
          <p style={{ fontSize: 19, marginTop: 8, opacity: 0.75, lineHeight: 1.4 }}>
            Mensajes parecidos sobre técnica y precisión, sin un dato o una historia que enganche
          </p>
        </div>
        <Ranking items={bottom5} notas={bottom5Notas} />
      </Diapositiva>
    ),
  },
  {
    id: "audiencia",
    titulo: "Quién sigue a Don Lay",
    contenido: (
      <Diapositiva fondo="beige" parte="informe">
        <Encabezado
          etiqueta="04 · Rendimiento"
          titulo="Quién sigue a Don Lay"
          sub="Audiencia de seguidores según Instagram Insights, 23 de octubre de 2026"
          width={1200}
        />
        <div style={{ ...abs(470, 96, 1340), display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "44px 52px" }}>
          <Cifra num="27.161" titulo="Seguidores" texto="Una comunidad grande: cada publicación llega solo a 1 de cada 25" />
          <Cifra num="66 %" titulo="Entre 35 y 54 años" texto="37 % de 35 a 44 · 29 % de 45 a 54 · solo el 20 % tiene menos de 35" />
          <Cifra num="45 %" titulo="Mujeres" texto="32 % hombres · 23 % sin especificar" />
          <Cifra num="28 %" titulo="En Madrid ciudad" texto="38 % sumando los municipios del área metropolitana" />
          <Cifra
            num="+1.800"
            titulo="Seguidores lejos de Madrid"
            texto="725 en Barcelona y más de 1.000 en ciudades de Latinoamérica, con poca opción de visitar el restaurante"
            style={{ gridColumn: "span 2" }}
          />
        </div>
        <Foto src={FOTO.salaReservado} alt="Reservado de Don Lay bajo el árbol rojo" style={abs(76, 1500, 420, 1004)} />
      </Diapositiva>
    ),
  },
  {
    id: "funciona",
    titulo: "Lo que mejor conecta",
    contenido: (
      <Diapositiva fondo="negro" parte="informe">
        <Encabezado etiqueta="05 · Qué funciona" titulo="Lo que mejor conecta" width={1000} />
        <Lista
          style={abs(460, 96, 1000)}
          items={[
            "El carrusel: +50 % de interacciones y el triple de guardados",
            "Historias con nombre propio: Nieves y el equipo de sala",
            "Platos explicados: el porqué del hakao o del Dragón de Mar",
            "Información útil y concreta: horarios y planes de fin de semana",
            "Planes de ciudad: la F1 trajo el máximo de visitas al perfil",
          ]}
        />
        <Foto src={imagen(post(19))} alt="Platos de la publicación «Cocina abierta viernes a domingo»" style={abs(76, 1240, 680, 1004)} pie="Cocina abierta viernes a domingo · 80 interacciones" />
      </Diapositiva>
    ),
  },
  {
    id: "no-funciona",
    titulo: "Lo que no está rindiendo",
    contenido: (
      <Diapositiva fondo="beige" parte="informe">
        <Encabezado etiqueta="06 · Qué no funciona" titulo="Lo que no está rindiendo" width={1000} />
        <Lista
          style={abs(460, 96, 1000)}
          items={[
            "Fotos sueltas de cocina con copy genérico: las que menos rinden",
            "Copys repetitivos y el mismo cierre de reserva en cada publicación",
            "Casi sin reels, y con un 64–74 % de abandono en 3 segundos",
            "Comunidad callada: 27 comentarios en 6 meses",
            "Ritmo irregular, con parones de hasta 3 semanas",
          ]}
        />
        <Foto src={imagen(post(11))} alt="El fuego y el wok" style={abs(76, 1240, 680, 1004)} pie="El fuego y el wok · 21 interacciones" />
      </Diapositiva>
    ),
  },
  {
    id: "pasos",
    titulo: "Próximos pasos",
    contenido: (
      <Diapositiva fondo="rojo" parte="informe">
        <Encabezado etiqueta="07 · Recomendaciones" titulo="Próximos pasos" width={1060} />
        <Lista
          style={abs(460, 96, 1060)}
          items={[
            "2–3 publicaciones por semana con calendario fijo",
            "Un reel semanal con gancho en el primer segundo: corte del pato, wok, dim sum a mano",
            "El carrusel como formato principal del feed: platos explicados e historias del equipo",
            "Más Nieves y el equipo a cámara, con voz propia",
            "Invitar a la conversación y colaborar con perfiles gastronómicos de Madrid",
          ]}
        />
        <Video src="/informedonlay/ig/reel-1.mp4" poster={imagen(post(6))} style={abs(150, 1330, 486, 864)} />
        <span className="d-pie-foto" style={{ ...abs(1024, 1330), position: "absolute", textShadow: "none", opacity: 0.8 }}>
          Reel del 18 de junio
        </span>
      </Diapositiva>
    ),
  },
  {
    id: "sep-propuesta",
    titulo: "Propuesta de contenido",
    contenido: (
      <Separador
        fondo="rojo"
        parte="propuesta"
        foto={FOTO.dimsumVino}
        alt="Dim sum y copa de vino en la mesa de Don Lay"
        etiqueta="08 · Propuesta"
        titulo="Propuesta de contenido"
        texto="Lo que vamos a grabar el 26 de octubre para responder a lo que muestra el informe: más personas, más procesos y más reels"
      />
    ),
  },
  {
    id: "planning",
    titulo: "Planning de rodaje",
    contenido: (
      <Diapositiva fondo="negro" parte="propuesta">
        <Encabezado
          etiqueta="Planning de rodaje"
          titulo="Lunes 26 de octubre"
          sub="10:00 – 15:00 · Don Lay, Calle de Castelló 117, Madrid"
          width={1200}
          top={130}
        />
        <div style={abs(400, 96, 1180)}>
          {[
            ["10:00", "Llegada y montaje", "Reconocimiento del espacio, luz, sonido y set para la entrevista"],
            ["10:30", "Nieves a cámara", "Entrevista breve: origen, familia, trayectoria y motivaciones. Voz en off para los vídeos"],
            ["11:00", "Cocina: técnica", "Maestros del wok y del dim sum, ingredientes, sonidos y texturas"],
            ["12:00", "Cocina: platos estrella", "El pato laqueado y su corte, emplatado perfecto y limpio"],
            ["13:00", "Fine dining", "Mesa apartada: servicio en mesa, platos emplatados y dinámica de sala"],
            ["14:00", "Propuesta líquida y cierre", "Cócteles del horóscopo chino, vinos y últimos planos de recurso"],
          ].map(([h, t, x]) => (
            <div
              key={h}
              style={{
                display: "grid",
                gridTemplateColumns: "170px 1fr",
                padding: "13px 0",
                borderTop: "1px solid rgba(246,240,232,.18)",
              }}
            >
              <span className="d-num" style={{ fontSize: 40 }}>{h}</span>
              <span>
                <b style={{ fontWeight: 500, fontSize: 26, display: "block", lineHeight: 1.3 }}>{t}</b>
                <span style={{ fontSize: 20, opacity: 0.75, lineHeight: 1.35, display: "block" }}>{x}</span>
              </span>
            </div>
          ))}
        </div>
        <Foto src={FOTO.salaReservado} alt="Sala de Don Lay" style={abs(76, 1380, 540, 1004)} posicion="70% 50%" />
      </Diapositiva>
    ),
  },
  {
    id: "pilar-01",
    titulo: "Pilar 01",
    contenido: (
      <Pilar
        n="01"
        fondo="beige"
        titulo="Personificar el contenido y el concepto"
        items={["Tradición, técnica y alta cocina", "Acercar al cliente a través de la historia de la cocina cantonesa"]}
        foto={imagen(post(2))}
        alt="Chef cortando el pato laqueado"
      />
    ),
  },
  {
    id: "pilar-02",
    titulo: "Pilar 02",
    contenido: (
      <Pilar
        n="02"
        fondo="negro"
        titulo="Nieves Ye, empresaria"
        items={[
          "Testimonio a cámara y voz en off",
          "Origen, familia y trayectoria",
          "El peso de la historia y la tradición",
          "El esfuerzo y la mejora constante",
          "El sabor del progreso",
          "La mujer empresaria y la gestión",
        ]}
        foto={imagen(post(22))}
        alt="Nieves Ye, fundadora de Don Lay"
      />
    ),
  },
  {
    id: "pilar-03",
    titulo: "Pilar 03",
    contenido: (
      <Pilar
        n="03"
        fondo="beige"
        titulo="Capturar los procesos culinarios"
        items={[
          "Contraste entre el movimiento de la cocina y la calma de los comensales",
          "Contenido de técnica y producto",
          "Platos estrella: el pato como gran protagonista",
          "Los maestros del wok y del dim sum",
        ]}
        foto={FOTO.wokFuego}
        alt="Cocina de Don Lay, wok al fuego"
      />
    ),
  },
  {
    id: "pilar-04",
    titulo: "Pilar 04",
    contenido: (
      <Pilar
        n="04"
        fondo="negro"
        titulo="Referente cantonés y calidad del servicio"
        items={[
          "Trato cercano con el cliente",
          "Servicio en directo en la mesa",
          "Una experiencia única: el gran referente de la cocina cantonesa en Madrid",
        ]}
        foto={imagen(post(1))}
        alt="Servicio en la mesa de Don Lay"
      />
    ),
  },
  {
    id: "pilar-05",
    titulo: "Pilar 05",
    contenido: (
      <Pilar
        n="05"
        fondo="beige"
        titulo="Propuesta líquida"
        items={[
          "Procesos de elaboración",
          "Coctelería inspirada en el horóscopo chino",
          "Variedad de etiquetas: impacto estético y diferencial",
          "Vinos chinos: los grandes desconocidos",
        ]}
        foto={FOTO.barArbol}
        alt="Barra de coctelería de Don Lay"
        posicion="40% 50%"
      />
    ),
  },
  {
    id: "sep-referencias",
    titulo: "Referencias",
    contenido: (
      <Separador
        fondo="negro"
        parte="propuesta"
        foto={FOTO.salaLamparas}
        alt="Sala de Don Lay"
        etiqueta="Referencias"
        titulo="Marcas y lenguaje visual"
      />
    ),
  },
  {
    id: "ref-01",
    titulo: "@osteriarenata",
    contenido: (
      <Diapositiva fondo="negro" parte="propuesta">
        <Movil src="/informedonlay/ref/grid-1a.jpg" alt="Perfil de @osteriarenata" style={abs(130, 200, 440, 900)} />
        <Movil src="/informedonlay/ref/grid-1b.jpg" alt="Feed de @osteriarenata" style={abs(130, 1280, 440, 900)} />
        <div style={{ ...abs(420, 700, 520), textAlign: "center" }}>
          <p className="d-et">Referencia 01</p>
          <h2 className="d-tit d-tit--m" style={{ marginTop: 20, fontSize: 64 }}>@osteriarenata</h2>
          <p style={{ marginTop: 26, fontSize: 28, opacity: 0.8 }}>Producto, sala y equipo con luz natural y tono editorial</p>
        </div>
      </Diapositiva>
    ),
  },
  {
    id: "ref-02",
    titulo: "@mr.wongsydney",
    contenido: (
      <Diapositiva fondo="negro" parte="propuesta">
        <Movil src="/informedonlay/ref/grid-2a.jpg" alt="Perfil de @mr.wongsydney" style={abs(130, 200, 440, 900)} />
        <Movil src="/informedonlay/ref/grid-2b.jpg" alt="Feed de @mr.wongsydney" style={abs(130, 1280, 440, 900)} />
        <div style={{ ...abs(420, 700, 520), textAlign: "center" }}>
          <p className="d-et">Referencia 02</p>
          <h2 className="d-tit d-tit--m" style={{ marginTop: 20, fontSize: 64 }}>@mr.wongsydney</h2>
          <p style={{ marginTop: 26, fontSize: 28, opacity: 0.8 }}>Cocina cantonesa contemporánea: sala viva, luz cálida y producto</p>
        </div>
      </Diapositiva>
    ),
  },
  {
    id: "video-01",
    titulo: "Vídeos · Personificar",
    contenido: (
      <DiapoVideos
        titulo="Personificar"
        items={[
          "Presentación de la propietaria",
          "Preguntas rápidas y breves",
          "Espontaneidad",
          "Voz superpuesta sobre clips",
          "Historia, tradición familiar y motivaciones",
        ]}
        refs={["video-02", "video-01"]}
      />
    ),
  },
  {
    id: "video-02",
    titulo: "Vídeos · Personificar",
    contenido: (
      <DiapoVideos
        titulo="Personificar"
        items={["Explicar el origen", "La especialidad del restaurante y sus raíces", "Movimiento por el espacio"]}
        refs={["video-03"]}
      />
    ),
  },
  {
    id: "video-03",
    titulo: "Vídeos · Procesos",
    contenido: (
      <DiapoVideos
        titulo="Procesos"
        items={["Capturar la técnica", "Detalles e ingredientes típicos", "Sonidos, texturas y zonas de la cocina"]}
        refs={["video-05", "video-04"]}
      />
    ),
  },
  {
    id: "video-04",
    titulo: "Vídeos · Procesos",
    contenido: (
      <DiapoVideos
        titulo="Procesos"
        items={["Contenido gastronómico orgánico", "Plato estrella", "Emplatado perfecto y limpio", "Corte del pato"]}
        refs={["video-07", "video-06"]}
      />
    ),
  },
  {
    id: "video-05",
    titulo: "Vídeos · El servicio",
    contenido: (
      <DiapoVideos
        titulo="El servicio"
        items={["Contacto con el equipo y cercanía", "Servicio en la mesa", "Disposición del espacio", "Dinámica en las mesas"]}
        refs={["video-08", "video-09"]}
      />
    ),
  },
  {
    id: "video-06",
    titulo: "Vídeos · Propuesta líquida",
    contenido: (
      <DiapoVideos
        titulo="Propuesta líquida"
        items={[
          "Elaboración del cóctel, paso a paso",
          "Texturas y el animal del horóscopo que lo identifica",
          "Movimiento y decoración final",
        ]}
        refs={["video-10", "video-11"]}
      />
    ),
  },
  {
    id: "gracias",
    titulo: "Gracias",
    contenido: (
      <Diapositiva fondo="rojo" parte="propuesta" cabecera={false}>
        <Foto src={FOTO.barArbol} alt="Barra de Don Lay" style={abs(0, 0, 820, 1080)} posicion="40% 50%" />
        <img src="/informedonlay/logo-beige.svg" alt="Don Lay" style={{ ...abs(110, 920), width: 420, height: "auto" }} />
        <h2 className="d-tit d-tit--xl" style={abs(420, 920)}>Gracias</h2>
        <p style={{ ...abs(600, 920), fontSize: 26, opacity: 0.85 }}>Maen Studios · info@maenstudios.com · maenstudios.com</p>
        <p className="d-tit" style={{ ...abs(800, 920, 940), fontSize: 92, lineHeight: 1, textAlign: "right", textTransform: "uppercase" }}>
          The real
          <br />
          cantonese food
        </p>
      </Diapositiva>
    ),
  },
];

