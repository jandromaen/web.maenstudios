import Anthropic from "@anthropic-ai/sdk";
import type { Block } from "../blog-data";
import { posts } from "../blog-data";
import { clients } from "../clients";
import { SITE_NAME } from "../seo-config";
import type { Tema } from "./blog-temas";

/**
 * Redacta el borrador de la semana.
 *
 * Borrador, no publicación: el resultado se manda por correo y no se sube a
 * ningún sitio. Google tiene una política —abuso de contenido a escala— que no
 * distingue si escribe una persona o una máquina: mira si el texto está hecho
 * para el lector o para el buscador. Una cadena de artículos que se publican
 * sin que nadie los lea cae ahí por definición, y un dominio sin enlaces
 * entrantes como este no tiene colchón para encajarlo. El paso humano no es
 * burocracia: es lo que separa «asistido» de «a escala».
 */

export type BorradorArticulo = {
  titulo: string;
  descripcion: string;
  extracto: string;
  keywords: string[];
  minutos: number;
  bloques: Block[];
};

/**
 * El modelo devuelve una estructura plana y los bloques se arman aquí. El tipo
 * Block es una unión con tres formas distintas, y describirla como esquema
 * complica la salida sin ganar nada: es más fiable pedir secciones y montarlas.
 */
const ESQUEMA = {
  type: "object" as const,
  additionalProperties: false,
  required: ["titulo", "descripcion", "extracto", "keywords", "entradilla", "secciones"],
  properties: {
    titulo: { type: "string", description: "Titular del artículo, sin la marca" },
    descripcion: {
      type: "string",
      description: "Meta description, entre 140 y 160 caracteres",
    },
    extracto: { type: "string", description: "Una frase para el listado del blog" },
    keywords: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 8,
    },
    entradilla: {
      type: "array",
      items: { type: "string" },
      description: "Uno o dos párrafos de apertura, antes del primer subtítulo",
    },
    secciones: {
      type: "array",
      minItems: 3,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["subtitulo", "parrafos"],
        properties: {
          subtitulo: { type: "string" },
          parrafos: { type: "array", items: { type: "string" }, minItems: 1 },
          lista: {
            type: "array",
            items: { type: "string" },
            description: "Opcional: puntos sueltos que no van en prosa",
          },
        },
      },
    },
  },
};

type Salida = {
  titulo: string;
  descripcion: string;
  extracto: string;
  keywords: string[];
  entradilla: string[];
  secciones: { subtitulo: string; parrafos: string[]; lista?: string[] }[];
};

/**
 * Contexto del estudio. Sin esto el artículo sale genérico —vale para
 * cualquier agencia del mundo— y un artículo genérico no posiciona ni
 * convierte: no lo distingue nadie de los otros cincuenta iguales.
 */
function contexto() {
  const sectores = [...new Set(clients.map((c) => c.sector))].join(", ");
  const marcas = clients
    .filter((c) => c.community)
    .slice(0, 10)
    .map((c) => `${c.name} (${c.tagline})`)
    .join("; ");
  const escritos = posts.map((p) => `- ${p.title}`).join("\n");

  return `${SITE_NAME} es un estudio de creación de contenido para redes sociales con oficina en Barcelona (Carrer del Bruc 61) y Madrid (Calle de Génova 3), en marcha desde 2020.

Hace tres cosas: dirección creativa, producción audiovisual y community management. Rueda en el local del cliente y entrega piezas listas para publicar, normalmente entre 8 y 12 al mes.

Sectores del portfolio: ${sectores}. El más fuerte con diferencia es la hostelería.
Algunas marcas: ${marcas}.

Artículos que YA existen en el blog y que no hay que repetir:
${escritos}`;
}

const INSTRUCCIONES = `Escribes para el blog de un estudio de contenido audiovisual. Tu texto lo va a leer una persona del estudio antes de publicarse, así que escribe para que se pueda publicar tal cual, no para que haya que reescribirlo.

Cómo se escribe aquí:

- En español de España, tuteando al lector, sin florituras.
- Frases cortas. Si una frase se puede partir en dos, se parte.
- Nada de «en el mundo actual», «en la era digital», «sumérgete», «descubre» ni cierres del tipo «en conclusión». Se empieza por lo que importa.
- Concreto siempre que se pueda: cifras, plazos, ejemplos de lo que pasa en un rodaje. Un consejo que valdría para cualquier sector no vale para ninguno.
- Nada de prometer resultados ni dar cifras inventadas. Si no se sabe un dato, se dice de otra forma o no se dice.
- No vendas el estudio dentro del artículo. Que se note el oficio por cómo está escrito, no por los adjetivos.
- Entre 900 y 1.400 palabras.

La meta description tiene que estar entre 140 y 160 caracteres y decir lo que el lector se lleva, no lo que el artículo «trata».`;

export async function redactarBorrador(tema: Tema): Promise<BorradorArticulo> {
  const client = new Anthropic();

  const respuesta = await client.beta.messages.create({
    model: "claude-opus-5",
    max_tokens: 16000,
    /* Si un clasificador de seguridad rechaza la petición, el servidor la
       reintenta solo en otro modelo en la misma llamada. Sin esto, un rechazo
       deja el viernes sin borrador y sin explicación. */
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    thinking: { type: "adaptive" },
    system: [
      { type: "text", text: INSTRUCCIONES },
      /* El contexto del estudio cambia poco entre semanas: va detrás de las
         instrucciones y marcado para caché, que es lo que abarata la llamada
         cuando esto lleve meses ejecutándose. */
      { type: "text", text: contexto(), cache_control: { type: "ephemeral" } },
    ],
    messages: [
      {
        role: "user",
        content: `Escribe el artículo de esta semana.

Tema: ${tema.titulo}
Búsqueda a la que responde: ${tema.keyword}
Por qué este tema: ${tema.motivo}

El titular no tiene por qué ser el que te doy: si se te ocurre uno mejor para esa búsqueda, úsalo.`,
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: ESQUEMA },
    },
  });

  if (respuesta.stop_reason === "refusal") {
    throw new Error(
      `El modelo declinó la petición (${respuesta.stop_details?.category ?? "sin categoría"}).`,
    );
  }

  const texto = respuesta.content.find((b) => b.type === "text");
  if (!texto || texto.type !== "text") {
    throw new Error("La respuesta no traía texto.");
  }

  const salida = JSON.parse(texto.text) as Salida;

  /* De estructura plana a los bloques que pinta el blog */
  const bloques: Block[] = [
    ...salida.entradilla.map((text) => ({ type: "p" as const, text })),
    ...salida.secciones.flatMap((s) => [
      { type: "h2" as const, text: s.subtitulo },
      ...s.parrafos.map((text) => ({ type: "p" as const, text })),
      ...(s.lista?.length ? [{ type: "ul" as const, items: s.lista }] : []),
    ]),
  ];

  /* Minutos de lectura a 200 palabras por minuto, que es la media razonable */
  const palabras = bloques.reduce((n, b) => {
    const texto = b.type === "ul" ? b.items.join(" ") : b.text;
    return n + texto.split(/\s+/).length;
  }, 0);

  return {
    titulo: salida.titulo,
    descripcion: salida.descripcion,
    extracto: salida.extracto,
    keywords: salida.keywords,
    minutos: Math.max(3, Math.round(palabras / 200)),
    bloques,
  };
}

/** Slug a partir del titular, con el formato que ya usan los artículos. */
export function slugDe(titulo: string) {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 8)
    .join("-");
}
