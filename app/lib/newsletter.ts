import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "../seo-config";

/**
 * Alta y baja de la newsletter del blog.
 *
 * Los suscriptores viven en una lista de Resend, no en una base de datos: son
 * direcciones de correo y quien las va a usar es Resend, así que meter una base
 * de datos por el medio sería una pieza más que mantener, respaldar y proteger
 * para no ganar nada.
 *
 * El alta es en dos pasos, y no por gusto. En la UE un envío comercial necesita
 * consentimiento expreso y demostrable: cualquiera puede escribir el correo de
 * otro en un formulario, y sin confirmar desde el propio buzón no hay prueba de
 * que el titular quisiera nada. Además protege de que alguien use el formulario
 * para suscribir a terceros por fastidiar.
 */

const NOMBRE_LISTA = "Blog Maen Studios";

/** El enlace de confirmación caduca: un alta de hace meses ya no prueba nada. */
const VALIDEZ_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Clave con la que se firman los enlaces. Cae en CRON_SECRET si no hay una
 * propia, que ya está configurada y sirve igual: lo único que importa es que
 * sea secreta y estable.
 */
function clave() {
  const k = process.env.NEWSLETTER_SECRET ?? process.env.CRON_SECRET;
  if (!k) throw new Error("Falta NEWSLETTER_SECRET o CRON_SECRET");
  return k;
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const deB64 = (s: string) => Buffer.from(s, "base64url").toString("utf8");

/**
 * Un enlace firmado vale por sí solo: lleva dentro el correo y el momento, y
 * la firma impide tocarlos. Así no hace falta guardar altas a medias en ningún
 * sitio a la espera de que alguien confirme.
 */
export function firmar(email: string, proposito: "alta" | "baja") {
  const cuerpo = b64(JSON.stringify({ email, proposito, t: Date.now() }));
  const firma = createHmac("sha256", clave()).update(cuerpo).digest("base64url");
  return `${cuerpo}.${firma}`;
}

export function verificar(token: string, proposito: "alta" | "baja") {
  const [cuerpo, firma] = (token ?? "").split(".");
  if (!cuerpo || !firma) return null;

  const esperada = createHmac("sha256", clave()).update(cuerpo).digest("base64url");
  /* Comparación de tiempo constante: comparar con === filtra el secreto poco a
     poco, porque tarda más cuanto más acierta el atacante. */
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const datos = JSON.parse(deB64(cuerpo)) as {
      email: string;
      proposito: string;
      t: number;
    };
    if (datos.proposito !== proposito) return null;
    /* La baja no caduca nunca: un enlace de hace un año tiene que seguir
       dándote de baja, porque estará al pie de un correo de hace un año. */
    if (proposito === "alta" && Date.now() - datos.t > VALIDEZ_MS) return null;
    return datos.email;
  } catch {
    return null;
  }
}

export const enlaceConfirmacion = (email: string) =>
  `${SITE_URL}/newsletter/confirmar?t=${firmar(email, "alta")}`;

export const enlaceBaja = (email: string) =>
  `${SITE_URL}/newsletter/baja?t=${firmar(email, "baja")}`;

/* ── Lista de Resend ─────────────────────────────────────────────────────── */

async function resend(ruta: string, opciones: RequestInit = {}) {
  const res = await fetch(`https://api.resend.com${ruta}`, {
    ...opciones,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(opciones.headers ?? {}),
    },
    signal: AbortSignal.timeout(15_000),
  });
  return res.json();
}

/**
 * Busca la lista por nombre y la crea si no está. Se resuelve en caliente en
 * vez de guardar el identificador en una variable de entorno: una variable más
 * es un paso más que se olvida al desplegar, y esto se apaña solo.
 */
let listaCache: string | null = null;

async function idLista() {
  if (listaCache) return listaCache;

  const { data } = (await resend("/audiences")) as {
    data?: { id: string; name: string }[];
  };
  const existente = data?.find((a) => a.name === NOMBRE_LISTA);
  if (existente) return (listaCache = existente.id);

  const creada = (await resend("/audiences", {
    method: "POST",
    body: JSON.stringify({ name: NOMBRE_LISTA }),
  })) as { id?: string };
  if (!creada.id) throw new Error("No se pudo crear la lista en Resend");
  return (listaCache = creada.id);
}

export async function darDeAlta(email: string) {
  const lista = await idLista();
  /* Resend trata un alta repetida como actualización, así que volver a
     confirmar un correo que ya estaba no duplica nada: lo reactiva, que es
     justo lo que quiere quien vuelve tras haberse dado de baja. */
  await resend(`/audiences/${lista}/contacts`, {
    method: "POST",
    body: JSON.stringify({ email, unsubscribed: false }),
  });
}

export async function darDeBaja(email: string) {
  const lista = await idLista();
  await resend(`/audiences/${lista}/contacts`, {
    method: "POST",
    body: JSON.stringify({ email, unsubscribed: true }),
  });
}
