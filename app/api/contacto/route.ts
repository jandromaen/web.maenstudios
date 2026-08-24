import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL_PROJECTS } from "../../site-data";
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
    ["Origen", origen],
  ];

  const html = `
    <h2 style="font-family:sans-serif">Nuevo contacto desde la web</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:4px 12px 4px 0"><strong>${label}</strong></td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
    <h3 style="font-family:sans-serif">Proyecto</h3>
    <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(comentarios) || "(sin detalles)"}</p>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `Maen Studios Web <${FROM}>`,
      to: DESTINATARIOS,
      replyTo: email,
      subject: `Nuevo proyecto — ${fullName || "Contacto web"}`,
      html,
      text: [
        `Nombre: ${fullName}`,
        `Email: ${email}`,
        `Teléfono: ${telefono || "—"}`,
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
