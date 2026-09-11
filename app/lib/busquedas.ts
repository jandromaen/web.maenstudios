import { createSign } from "node:crypto";
import { SITE_URL } from "../seo-config";

/**
 * Qué busca la gente en Google para acabar en la web, leído de Search Console.
 *
 * Es el dato que el tráfico no puede dar. Vercel dice CUÁNTA gente entra; esto
 * dice POR QUÉ: qué escribieron, cuántas veces salimos y en qué puesto. Sin
 * ello, decidir sobre qué escribir en el blog es adivinar.
 *
 * ── Por qué hay aquí un JWT a mano ───────────────────────────────────────
 * La API pide OAuth. La librería oficial de Google son varios megas de
 * dependencia para hacer exactamente esto: firmar un JWT, canjearlo por un
 * token y llamar a un endpoint. Node ya sabe firmar RS256, así que se hace
 * aquí y el proyecto no engorda.
 *
 * ── El retraso, que importa al leer los números ───────────────────────────
 * Search Console va con dos o tres días de retraso. Pedir «los últimos 7 días»
 * a secas devuelve una semana con el final vacío y hace parecer que el tráfico
 * se ha hundido. Por eso la ventana termina hace TRES días y no hoy.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://searchconsole.googleapis.com/webmasters/v3/sites";
const ALCANCE = "https://www.googleapis.com/auth/webmasters.readonly";

/** Los datos de hace menos de esto todavía no están completos. */
const RETRASO_DIAS = 3;

export type Consulta = {
  termino: string;
  clics: number;
  impresiones: number;
  posicion: number;
};

export type Mes = {
  /** "2026-09" */
  mes: string;
  clics: number;
  impresiones: number;
  /** Porcentaje de veces que salir acabó en clic. */
  ctr: number;
  posicion: number;
};

export type Busquedas = {
  clics: number;
  impresiones: number;
  posicionMedia: number;
  clicsPrevios: number;
  impresionesPrevias: number;
  /** Las que más tráfico traen. */
  top: Consulta[];
  /**
   * Las que están cerca de la primera página pero no llegan.
   *
   * Es la lista más accionable de todo el informe: ahí un artículo o un ajuste
   * de copy mueve la aguja de verdad, porque ya se compite. Empezar por una
   * consulta en la que sales el 60º no sirve de nada.
   */
  aTiro: Consulta[];
  /** Serie mensual, la más reciente primero. */
  meses: Mes[];
};

function dia(atras: number) {
  return new Date(Date.now() - atras * 86_400_000).toISOString().slice(0, 10);
}

/**
 * Token de acceso a partir de un refresh token de usuario.
 *
 * Es la vía que acabamos usando. La de cuenta de servicio (más abajo) requiere
 * descargar una clave JSON, y la organización de Google Workspace de Maen lo
 * tiene bloqueado por política: una clave así no caduca nunca y si se filtra da
 * acceso indefinido. Con OAuth de usuario no existe ningún fichero que filtrar,
 * y el permiso se revoca desde la cuenta de Google cuando se quiera.
 */
async function tokenDeUsuario() {
  const id = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const secreto = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refresco = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!id || !secreto || !refresco) return null;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: id,
      client_secret: secreto,
      refresh_token: refresco,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`OAuth refresco ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return (await res.json()).access_token as string;
}

/** Credenciales de la cuenta de servicio, si están puestas. */
function credenciales() {
  const bruto = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!bruto) return null;
  try {
    const j = JSON.parse(bruto);
    if (!j.client_email || !j.private_key) return null;
    return { correo: j.client_email as string, clave: j.private_key as string };
  } catch {
    /* Un JSON roto es un fallo de configuración, no un caso normal: que se vea
       en los registros en vez de convertirse en un silencio. */
    console.error("[busquedas] GOOGLE_SERVICE_ACCOUNT_JSON no es JSON válido");
    return null;
  }
}

const base64url = (v: string | Buffer) =>
  Buffer.from(v).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Firma un JWT y lo canjea por un token de acceso. */
async function token(correo: string, clave: string) {
  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const cuerpo = base64url(
    JSON.stringify({
      iss: correo,
      scope: ALCANCE,
      aud: TOKEN_URL,
      iat: ahora,
      exp: ahora + 3600,
    }),
  );

  const firma = createSign("RSA-SHA256")
    .update(`${cabecera}.${cuerpo}`)
    .sign(clave.replace(/\\n/g, "\n"));

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${cabecera}.${cuerpo}.${base64url(firma)}`,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`OAuth ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return (await res.json()).access_token as string;
}

type Fila = { keys?: string[]; clicks: number; impressions: number; position: number };

async function consultar(
  acceso: string,
  desde: string,
  hasta: string,
  dimensions: string[],
  rowLimit = 25,
): Promise<Fila[]> {
  /* La propiedad es de tipo «prefijo de URL», así que el identificador lleva
     barra final. Sin ella la API responde 403 y parece un problema de
     permisos cuando en realidad es la dirección. */
  const propiedad = encodeURIComponent(`${SITE_URL}/`);

  const res = await fetch(`${API}/${propiedad}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${acceso}`, "content-type": "application/json" },
    body: JSON.stringify({ startDate: desde, endDate: hasta, dimensions, rowLimit }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    throw new Error(`Search Console ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return (await res.json()).rows ?? [];
}

/**
 * La serie mes a mes.
 *
 * Se pide por días y se agrupa aquí en vez de hacer una consulta por mes: son
 * doce llamadas contra una, y la API tiene cuota. Search Console guarda unos
 * 16 meses, así que un año entero cabe de sobra.
 *
 * La posición del mes es la media PONDERADA por impresiones, no la media de
 * las medias: un día con tres impresiones no puede pesar lo mismo que uno con
 * trescientas, y con la media simple un día flojo hunde el mes entero.
 */
async function porMeses(acceso: string, meses: number): Promise<Mes[]> {
  const filas = await consultar(acceso, dia(RETRASO_DIAS + meses * 31), dia(RETRASO_DIAS), ["date"], 600);

  const cubos = new Map<string, { clics: number; impresiones: number; posPorImpr: number }>();
  for (const f of filas) {
    const mes = (f.keys?.[0] ?? "").slice(0, 7);
    if (!mes) continue;
    const c = cubos.get(mes) ?? { clics: 0, impresiones: 0, posPorImpr: 0 };
    c.clics += f.clicks;
    c.impresiones += f.impressions;
    c.posPorImpr += f.position * f.impressions;
    cubos.set(mes, c);
  }

  return [...cubos.entries()]
    .map(([mes, c]) => ({
      mes,
      clics: c.clics,
      impresiones: c.impresiones,
      ctr: c.impresiones ? Math.round((c.clics / c.impresiones) * 1000) / 10 : 0,
      posicion: c.impresiones ? Math.round((c.posPorImpr / c.impresiones) * 10) / 10 : 0,
    }))
    .sort((a, b) => b.mes.localeCompare(a.mes));
}

const aConsulta = (f: Fila): Consulta => ({
  termino: f.keys?.[0] ?? "—",
  clics: f.clicks,
  impresiones: f.impressions,
  posicion: Math.round(f.position * 10) / 10,
});

/**
 * El resumen de la semana. Devuelve null si no hay credenciales: es mejor que
 * el informe diga que no puede mirar a que enseñe ceros que parecen un desastre.
 */
export async function busquedasSemanales(): Promise<Busquedas | null> {
  /* Primero el token de usuario, que es el que está en uso; la cuenta de
     servicio se queda como alternativa por si algún día se desbloquea. */
  const cred = credenciales();
  const acceso = (await tokenDeUsuario()) ?? (cred ? await token(cred.correo, cred.clave) : null);
  if (!acceso) return null;

  const finSemana = dia(RETRASO_DIAS);
  const inicioSemana = dia(RETRASO_DIAS + 7);
  const finPrevia = dia(RETRASO_DIAS + 8);
  const inicioPrevia = dia(RETRASO_DIAS + 15);

  const [totales, previos, porConsulta, meses] = await Promise.all([
    consultar(acceso, inicioSemana, finSemana, [], 1),
    consultar(acceso, inicioPrevia, finPrevia, [], 1),
    consultar(acceso, inicioSemana, finSemana, ["query"], 100),
    porMeses(acceso, 12),
  ]);

  const t = totales[0];
  const p = previos[0];
  const consultas = porConsulta.map(aConsulta);

  return {
    clics: t?.clicks ?? 0,
    impresiones: t?.impressions ?? 0,
    posicionMedia: t ? Math.round(t.position * 10) / 10 : 0,
    clicsPrevios: p?.clicks ?? 0,
    impresionesPrevias: p?.impressions ?? 0,
    top: [...consultas].sort((a, b) => b.clics - a.clics || b.impresiones - a.impresiones).slice(0, 8),
    /* De la 8 a la 20: se compite pero no se entra en la primera pantalla.
       Se ordenan por impresiones porque ahí está el volumen que se gana. */
    aTiro: consultas
      .filter((c) => c.posicion >= 8 && c.posicion <= 20 && c.impresiones > 0)
      .sort((a, b) => b.impresiones - a.impresiones)
      .slice(0, 8),
    meses,
  };
}
