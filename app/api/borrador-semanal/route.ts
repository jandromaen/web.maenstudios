import { NextResponse } from "next/server";
import { BUZONES, REMITENTE } from "../../lib/remitente";
import { temaDeLaSemana, temasPendientes } from "../../lib/blog-temas";
import { redactarBorrador, slugDe, type BorradorArticulo } from "../../lib/borrador";
import type { Tema } from "../../lib/blog-temas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/* Redactar un artículo entero con razonamiento adaptativo puede pasar del
   minuto largo; el máximo por defecto se quedaría corto. */
export const maxDuration = 300;

const FUENTE = "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

function escapar(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * El artículo, ya con la forma exacta de app/blog-data.ts.
 *
 * Se manda el bloque de código listo para pegar y no el texto suelto a
 * propósito: si hay que reformatearlo a mano, el borrador semanal deja de
 * ahorrar tiempo y se abandona a las tres semanas.
 */
function comoCodigo(b: BorradorArticulo, tema: Tema) {
  const hoy = new Date().toISOString().slice(0, 10);
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
  },`;
}

/** Vista legible del artículo, para poder juzgarlo sin leer código. */
function comoTexto(b: BorradorArticulo) {
  return b.bloques
    .map((bl) => {
      if (bl.type === "h2") return `\n## ${bl.text}\n`;
      if (bl.type === "ul") return bl.items.map((i) => `  · ${i}`).join("\n");
      return bl.text;
    })
    .join("\n");
}

function componer(tema: Tema, b: BorradorArticulo | null, fallo?: string) {
  const fecha = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });
  const pendientes = temasPendientes();

  const asunto = b
    ? `Borrador de blog · ${b.titulo}`
    : `Borrador de blog · tema propuesto (sin redactar)`;

  const cabecera = `<div style="font:600 11px/1 ${FUENTE};letter-spacing:.16em;color:#a0a0a0">MAEN STUDIOS · BORRADOR DEL ${fecha.toUpperCase()}</div>`;

  const bloqueTema = `
    <table style="font:400 14px/1.6 ${FUENTE};color:#444;border-collapse:collapse;margin:0 0 24px">
      <tr><td style="padding:3px 12px 3px 0"><strong>Tema</strong></td><td>${escapar(tema.titulo)}</td></tr>
      <tr><td style="padding:3px 12px 3px 0"><strong>Búsqueda</strong></td><td>${escapar(tema.keyword)}</td></tr>
      <tr><td style="padding:3px 12px 3px 0;vertical-align:top"><strong>Por qué</strong></td><td>${escapar(tema.motivo)}</td></tr>
    </table>`;

  const cuerpo = b
    ? `
    <h2 style="font:700 22px/1.3 ${FUENTE};color:#111;margin:0 0 6px">${escapar(b.titulo)}</h2>
    <p style="font:400 14px/1.55 ${FUENTE};color:#666;margin:0 0 20px">${escapar(b.descripcion)}</p>
    ${bloqueTema}
    <div style="font:400 15px/1.65 ${FUENTE};color:#222;white-space:pre-wrap;border-top:1px solid #ededed;padding-top:20px">${escapar(comoTexto(b))}</div>
    <h3 style="font:600 13px/1.4 ${FUENTE};color:#111;margin:28px 0 8px">Para pegar en app/blog-data.ts</h3>
    <pre style="font:400 11px/1.5 ui-monospace,Menlo,monospace;background:#f6f6f4;border:1px solid #e4e4e0;padding:14px;overflow-x:auto;white-space:pre">${escapar(comoCodigo(b, tema))}</pre>`
    : `
    <h2 style="font:700 20px/1.3 ${FUENTE};color:#111;margin:0 0 10px">Esta semana solo hay tema, no borrador</h2>
    ${bloqueTema}
    <p style="font:400 14px/1.6 ${FUENTE};color:#b7791f;margin:0">${escapar(fallo ?? "")}</p>`;

  const html = `<div style="max-width:680px;margin:0 auto;padding:36px 24px;background:#fff">
    ${cabecera}
    ${cuerpo}
    <p style="font:400 12px/1.55 ${FUENTE};color:#b0b0b0;margin-top:30px;border-top:1px solid #ededed;padding-top:18px">
      Esto es un borrador: no se ha publicado nada. Léelo, corrígelo y pégalo si te convence.
      Quedan ${pendientes} temas sin cubrir en la cola.
    </p>
  </div>`;

  const texto = b
    ? [`BORRADOR · ${b.titulo}`, "", b.descripcion, "", comoTexto(b)].join("\n")
    : `Tema propuesto: ${tema.titulo} (${tema.keyword})\n\n${fallo ?? ""}`;

  return { asunto, html, texto };
}

/**
 * Borrador semanal del blog. Lo dispara el cron declarado en vercel.json.
 *
 * Mismo candado que el informe: manda correo, así que sin secreto cualquiera
 * que diera con la dirección podría dispararlo en bucle. Y aquí además cada
 * llamada cuesta dinero en la API del modelo.
 */
export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) {
    return NextResponse.json(
      { error: "Falta CRON_SECRET en las variables de entorno." },
      { status: 503 },
    );
  }
  if (request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const tema = temaDeLaSemana();
  if (!tema) {
    return NextResponse.json({
      ok: true,
      nota: "No queda ningún tema sin cubrir. No se manda correo.",
    });
  }

  let borrador: BorradorArticulo | null = null;
  let fallo: string | undefined;

  /* Sin clave, el correo sale igual con el tema propuesto. Es peor no mandar
     nada: el tema ya es la mitad del trabajo y así se ve que el sistema vive. */
  if (!process.env.ANTHROPIC_API_KEY) {
    fallo =
      "Falta ANTHROPIC_API_KEY en las variables de entorno de Vercel. Con ella, este correo llegaría con el artículo redactado.";
  } else {
    try {
      borrador = await redactarBorrador(tema);
    } catch (err) {
      fallo = `No se pudo redactar: ${err instanceof Error ? err.message : String(err)}`;
      console.error("[borrador-semanal]", err);
    }
  }

  const correo = componer(tema, borrador, fallo);
  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    return NextResponse.json(
      { error: "Falta RESEND_API_KEY." },
      { status: 500 },
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${clave}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: `Blog de Maen Studios <${REMITENTE}>`,
      to: BUZONES,
      subject: correo.asunto,
      html: correo.html,
      text: correo.texto,
    }),
  });

  if (!res.ok) {
    const cuerpo = await res.text().catch(() => "");
    console.error("[borrador-semanal] Resend:", res.status, cuerpo);
    return NextResponse.json({ error: `Resend devolvió ${res.status}` }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    tema: tema.titulo,
    redactado: Boolean(borrador),
    fallo,
  });
}
