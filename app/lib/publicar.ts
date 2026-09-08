import { posts, type Post } from "../blog-data";
import type { BorradorArticulo } from "./borrador";
import { slugDe } from "./borrador";
import type { Tema } from "./blog-temas";

/**
 * Publica el artículo de la semana escribiéndolo en app/blog-data.ts.
 *
 * El blog no tiene base de datos: los artículos viven en un fichero del repo y
 * el sitio se compila a partir de él. Así que «publicar» aquí significa hacer
 * un commit, y el despliegue lo dispara Vercel al ver la rama.
 *
 * Se hace por la API de GitHub y no clonando nada: la función corre en un
 * entorno efímero sin git, y una llamada de lectura y otra de escritura es
 * todo lo que hace falta para cambiar un fichero.
 *
 * ── Por qué esto va con red de seguridad ──────────────────────────────────
 *
 * Hasta ahora este cron mandaba un borrador por correo y lo publicaba una
 * persona. Jandro pidió el 8 de septiembre de 2026 que se publique solo. El
 * riesgo de quitar al humano no es teórico: Google tiene una política de abuso
 * de contenido a escala que no mira quién escribe sino para quién está escrito,
 * y una cadena de artículos publicados sin que nadie los lea cae ahí por
 * definición. Un dominio sin enlaces entrantes no tiene colchón para encajarlo.
 *
 * Así que el humano sale del camino pero no la revisión: lo que antes hacía
 * Jandro leyendo, lo hacen ahora las comprobaciones de `revisar()`. Ninguna
 * sustituye a un lector, pero todas paran los fallos que de verdad se dan —un
 * artículo a medias, un duplicado, un tema que se pisa con otro ya escrito—.
 * Si alguna salta, se manda el correo de siempre y no se publica nada.
 */

const REPO = "jandromaen/web.maenstudios";
const FICHERO = "app/blog-data.ts";
const RAMA = "main";

/** Mínimos por debajo de los cuales un artículo no está terminado. */
const MINIMO_SECCIONES = 3;
const MINIMO_PALABRAS = 450;

export type Veredicto = { ok: true } | { ok: false; motivo: string };

function palabrasDe(b: BorradorArticulo) {
  return b.bloques.reduce((n, bl) => {
    const texto = bl.type === "ul" ? bl.items.join(" ") : bl.text;
    return n + texto.trim().split(/\s+/).length;
  }, 0);
}

/**
 * Las palabras con peso de un texto, para comparar de qué habla.
 *
 * Es la misma idea que el `yaCubierto` de blog-temas, pero aplicada al
 * artículo ya redactado y no al tema: el modelo puede afinar el titular y
 * acabar escribiendo sobre algo que ya teníamos, aunque el tema de partida
 * estuviera libre.
 */
const VACIAS = new Set([
  "de", "la", "el", "en", "y", "para", "un", "una", "con", "los", "las",
  "que", "por", "del", "al", "es", "se", "como", "cómo", "qué", "más",
  "tu", "su", "lo", "sin", "sobre", "eso", "esto",
]);

function clave(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((p) => p.length > 2 && !VACIAS.has(p));
}

/**
 * ¿Se puede publicar esto sin que lo lea nadie?
 *
 * Exportada para poder probarla sin llamar ni al modelo ni a GitHub.
 */
export function revisar(b: BorradorArticulo, existentes: Post[] = posts): Veredicto {
  const slug = slugDe(b.titulo);

  if (existentes.some((p) => p.slug === slug)) {
    return { ok: false, motivo: `Ya hay un artículo con el slug «${slug}».` };
  }

  const secciones = b.bloques.filter((bl) => bl.type === "h2").length;
  if (secciones < MINIMO_SECCIONES) {
    return {
      ok: false,
      motivo: `Solo ${secciones} secciones; se esperan ${MINIMO_SECCIONES} o más.`,
    };
  }

  const palabras = palabrasDe(b);
  if (palabras < MINIMO_PALABRAS) {
    return {
      ok: false,
      motivo: `Solo ${palabras} palabras; por debajo de ${MINIMO_PALABRAS} no compite con nada.`,
    };
  }

  if (!b.descripcion || b.descripcion.length > 175) {
    return { ok: false, motivo: "La meta description falta o se pasa de largo." };
  }

  /* El solape se mide contra el artículo ya redactado: dos tercios de sus
     palabras clave dentro de un artículo existente significa que van a la
     misma búsqueda, y publicarlo sería enfrentarlos entre ellos. */
  const suyas = new Set(b.keywords.flatMap(clave));
  for (const p of existentes) {
    const otras = new Set([...clave(p.title), ...p.keywords.flatMap(clave)]);
    const comunes = [...suyas].filter((w) => otras.has(w)).length;
    if (suyas.size && comunes / suyas.size >= 0.66) {
      return {
        ok: false,
        motivo: `Se pisa con «${p.title}»: irían a la misma búsqueda.`,
      };
    }
  }

  return { ok: true };
}

/** El artículo con la forma exacta que tiene el fichero, listo para insertar. */
export function comoEntrada(b: BorradorArticulo, tema: Tema, hoy: string) {
  const cita = (s: string) => JSON.stringify(s);
  const bloques = b.bloques
    .map((bl) =>
      bl.type === "ul"
        ? `      { type: "ul", items: [\n${bl.items.map((i) => `        ${cita(i)},`).join("\n")}\n      ] },`
        : `      { type: ${cita(bl.type)}, text: ${cita(bl.text)} },`,
    )
    .join("\n");

  return `  {
    slug: ${cita(slugDe(b.titulo))},
    title: ${cita(b.titulo)},
    description: ${cita(b.descripcion)},
    category: ${cita(tema.categoria)},
    date: ${cita(hoy)},
    readingMinutes: ${b.minutos},
    keywords: [${b.keywords.map(cita).join(", ")}],
    excerpt: ${cita(b.extracto)},
    content: [
${bloques}
    ],
  },
`;
}

/**
 * Mete la entrada justo antes del cierre del array.
 *
 * El orden dentro del fichero da igual —el listado ordena por fecha— así que
 * se añade al final, que es donde menos ruido hace en el diff.
 *
 * Exportada aparte de la llamada a GitHub para poder comprobarla en local con
 * el fichero de verdad, sin tocar el repositorio.
 */
export function insertar(fuente: string, entrada: string) {
  const inicio = fuente.indexOf("export const posts: Post[] = [");
  if (inicio === -1) throw new Error("No se encuentra el array de posts.");
  const cierre = fuente.indexOf("\n];", inicio);
  if (cierre === -1) throw new Error("No se encuentra el cierre del array.");
  return fuente.slice(0, cierre + 1) + entrada + fuente.slice(cierre + 1);
}

async function github(ruta: string, init: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${ruta}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return res.json();
}

export type Publicacion = { slug: string; commit: string };

/**
 * Escribe el artículo en el repo. Devuelve el slug y el commit.
 *
 * Sin GITHUB_TOKEN no se llama a esto: quien decide si el sistema publica solo
 * o sigue mandando borradores es la presencia de esa variable, no una bandera
 * suelta que se pueda quedar a medias.
 */
export async function publicarEnRepo(
  b: BorradorArticulo,
  tema: Tema,
  hoy: string,
): Promise<Publicacion> {
  const actual = await github(
    `/repos/${REPO}/contents/${encodeURIComponent(FICHERO)}?ref=${RAMA}`,
  );
  const fuente = Buffer.from(actual.content, "base64").toString("utf8");
  const slug = slugDe(b.titulo);

  /* Segunda comprobación de duplicado, ahora contra el fichero de verdad: el
     `posts` que importa esta función es el del despliegue, y puede ser más
     viejo que la rama si alguien publicó a mano esta misma semana. */
  if (fuente.includes(`slug: ${JSON.stringify(slug)}`)) {
    throw new Error(`La rama ya tiene un artículo con el slug «${slug}».`);
  }

  const nuevo = insertar(fuente, comoEntrada(b, tema, hoy));

  const commit = await github(
    `/repos/${REPO}/contents/${encodeURIComponent(FICHERO)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: `Publicar «${b.titulo}»\n\nArtículo de la semana, redactado y publicado por el cron de los martes.\nTema de partida: ${tema.titulo} (${tema.keyword}).`,
        content: Buffer.from(nuevo, "utf8").toString("base64"),
        sha: actual.sha,
        branch: RAMA,
      }),
    },
  );

  return { slug, commit: commit.commit?.sha?.slice(0, 7) ?? "?" };
}
