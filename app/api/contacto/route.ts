import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL_PROJECTS, PRESUPUESTOS } from "../../site-data";
import { BUZONES, REMITENTE } from "../../lib/remitente";

export const runtime = "nodejs";

/** Ver app/lib/remitente.ts: hasta que el dominio verifique, esto es limitado. */
const FROM = REMITENTE;

/**
 * Todo lo que entra por el formulario se manda en un único correo con todos los
 * destinatarios, no en varios correos: así comparten hilo y al responder uno,
 * el otro ve la respuesta.
 *
 * CONTACT_TO_EMAIL admite varias direcciones separadas por comas y, si está
 * definida, sustituye a esta lista.
 */
const DESTINATARIOS = (
  process.env.CONTACT_TO_EMAIL
    ? process.env.CONTACT_TO_EMAIL.split(",")
    : BUZONES
)
  .map((d) => d.trim())
  .filter(Boolean)
  .filter((d, i, todos) => todos.indexOf(d) === i); // sin repetidos

/** Dirección que se enseña al visitante si el envío falla. */
const TO = DESTINATARIOS[0] ?? EMAIL_PROJECTS;

type ContactPayload = {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  comentarios?: string;
  presupuesto?: string;
  /* Los mandan los formularios del podcast y de creadores; el de contacto no. */
  proyecto?: string;
  enlace?: string;
  ciudad?: string;
  redes?: string;
  origen?: string;
  /** Honeypot: si viene relleno, es un bot */
  empresa?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  // Honeypot: respondemos OK para no dar pistas al bot, pero no enviamos nada.
  if (payload.empresa) {
    return NextResponse.json({ ok: true });
  }

  const nombre = (payload.nombre ?? "").trim();
  const apellido = (payload.apellido ?? "").trim();
  const email = (payload.email ?? "").trim();
  const telefono = (payload.telefono ?? "").trim();
  const comentarios = (payload.comentarios ?? "").trim();
  const origen = (payload.origen ?? "web").trim();

  /* Campo libre: se recorta a una longitud razonable. Nadie escribe su marca
     en 2.000 caracteres, así que un valor largo es basura o un intento de
     inflar el correo. */
  const recortar = (v: string | undefined, max: number) =>
    (v ?? "").trim().slice(0, max);

  const proyecto = recortar(payload.proyecto, 200);
  const enlace = recortar(payload.enlace, 200);

  /* Solo se acepta uno de los tramos que ofrece el formulario. El campo llega
     por HTTP y cualquiera puede mandar lo que quiera: sin esta comprobación,
     el correo se convierte en un hueco donde escribir texto arbitrario. */
  /* Una candidatura al podcast y una petición de presupuesto no se leen igual
     ni se contestan igual: conviene distinguirlas desde el asunto. */
  const esPodcast = origen.startsWith("podcast");
  const esTalento = origen.startsWith("talents");

  const ciudad = recortar(payload.ciudad, 120);
  const redes = recortar(payload.redes, 120);

  const enviado = (payload.presupuesto ?? "").trim();
  const presupuesto = (PRESUPUESTOS as readonly string[]).includes(enviado)
    ? enviado
    : "";

  if (!nombre || !email) {
    return NextResponse.json(
      { error: "Necesitamos al menos tu nombre y tu email." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Ese email no parece válido." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contacto] Falta RESEND_API_KEY en las variables de entorno");
    return NextResponse.json(
      {
        error:
          "No hemos podido enviar el mensaje. Escríbenos a " + TO + ", por favor.",
      },
      { status: 500 },
    );
  }

  const fullName = `${nombre} ${apellido}`.trim();
  const rows: [string, string][] = [
    ["Nombre", fullName],
    ["Email", email],
    ["Teléfono", telefono || "—"],
    ...(esPodcast
      ? ([
          ["A qué se dedica", proyecto || "—"],
          ["Instagram o web", enlace || "—"],
        ] as [string, string][])
      : esTalento
        ? ([
            ["Redes", redes || "—"],
            ["Dónde puede grabar", ciudad || "—"],
            ["Su trabajo", enlace || "—"],
          ] as [string, string][])
        : ([["Presupuesto", presupuesto || "No lo ha indicado"]] as [
            string,
            string,
          ][])),
    ["Origen", origen],
  ];

  const html = `
    <h2 style="font-family:sans-serif">${esPodcast ? "Quiere salir en el podcast" : esTalento ? "Quiere entrar en la red de creadores" : "Nuevo contacto desde la web"}</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:4px 12px 4px 0"><strong>${label}</strong></td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
    <h3 style="font-family:sans-serif">${esPodcast ? "De qué quiere hablar" : esTalento ? "Qué tipo de contenido hace" : "Proyecto"}</h3>
    <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(comentarios) || "(sin detalles)"}</p>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `Maen Studios Web <${FROM}>`,
      to: DESTINATARIOS,
      replyTo: email,
      /* El tramo va en el asunto para poder priorizar desde la bandeja de
         entrada, sin abrir el correo. */
      subject: esPodcast
        ? `Podcast — ${fullName || "Propuesta de invitado"}`
        : esTalento
          ? `Creador UGC — ${fullName || "Candidatura"}`
          : presupuesto
          ? `Nuevo proyecto — ${fullName || "Contacto web"} · ${presupuesto}`
          : `Nuevo proyecto — ${fullName || "Contacto web"}`,
      html,
      text: [
        `Nombre: ${fullName}`,
        `Email: ${email}`,
        `Teléfono: ${telefono || "—"}`,
        ...(esPodcast
          ? [`A qué se dedica: ${proyecto || "—"}`, `Instagram o web: ${enlace || "—"}`]
          : esTalento
            ? [
                `Redes: ${redes || "—"}`,
                `Dónde puede grabar: ${ciudad || "—"}`,
                `Su trabajo: ${enlace || "—"}`,
              ]
            : [`Presupuesto: ${presupuesto || "No lo ha indicado"}`]),
        `Origen: ${origen}`,
        "",
        comentarios,
      ].join("\n"),
    });

    if (error) {
      console.error("[contacto] Resend devolvió un error:", error);
      return NextResponse.json(
        { error: `No hemos podido enviar el mensaje. Escríbenos a ${TO}.` },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contacto] Error inesperado:", err);
    return NextResponse.json(
      { error: `No hemos podido enviar el mensaje. Escríbenos a ${TO}.` },
      { status: 500 },
    );
  }
}
