import { auditar, type Punto } from "./auditoria";
import { BUZONES, REMITENTE as DIRECCION } from "./remitente";

/** Compone y envía el informe semanal de pendientes. */
const REMITENTE = `Web de Maen Studios <${DIRECCION}>`;
const DESTINATARIOS = BUZONES;

const ORDEN: Record<Punto["estado"], number> = { bloqueo: 0, aviso: 1, ok: 2 };
const ETIQUETA: Record<Punto["estado"], string> = { bloqueo: "BLOQUEO", aviso: "PENDIENTE", ok: "RESUELTO" };
const COLOR: Record<Punto["estado"], string> = { bloqueo: "#c0392b", aviso: "#b7791f", ok: "#2f855a" };

const FUENTE = "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

/** El correo se lee en clientes que ignoran el CSS externo: todo va en línea. */
function componer(puntos: Punto[]) {
  const orden = [...puntos].sort((a, b) => ORDEN[a.estado] - ORDEN[b.estado]);
  const bloqueos = orden.filter((p) => p.estado === "bloqueo").length;
  const avisos = orden.filter((p) => p.estado === "aviso").length;

  const fecha = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  const asunto = bloqueos
    ? `Web · ${bloqueos} bloqueo${bloqueos > 1 ? "s" : ""} y ${avisos} pendiente${avisos !== 1 ? "s" : ""}`
    : avisos
      ? `Web · todo en pie, ${avisos} pendiente${avisos > 1 ? "s" : ""}`
      : "Web · nada pendiente";

  const resumen = bloqueos
    ? `Hay ${bloqueos} cosa${bloqueos > 1 ? "s" : ""} que alguien está sufriendo ahora mismo.`
    : avisos
      ? "Nada roto de cara al visitante. Lo que queda puede esperar."
      : "Nada pendiente. La web está como debe estar.";

  const fila = (p: Punto) => `
    <tr>
      <td style="padding:16px 14px 16px 0;vertical-align:top;white-space:nowrap">
        <span style="font:600 11px/1 ${FUENTE};letter-spacing:.08em;color:${COLOR[p.estado]}">${ETIQUETA[p.estado]}</span>
      </td>
      <td style="padding:16px 0;border-bottom:1px solid #ededed">
        <div style="font:600 15px/1.4 ${FUENTE};color:#111">${escapar(p.titulo)}</div>
        <div style="font:400 11px/1.4 ${FUENTE};color:#a0a0a0;margin-top:3px;letter-spacing:.04em">${escapar(p.area.toUpperCase())}</div>
        ${p.detalle ? `<div style="font:400 14px/1.55 ${FUENTE};color:#444;margin-top:8px">${escapar(p.detalle)}</div>` : ""}
        ${p.accion ? `<div style="font:400 14px/1.55 ${FUENTE};color:#666;margin-top:5px"><strong style="color:#111">Qué hace falta:</strong> ${escapar(p.accion)}</div>` : ""}
      </td>
    </tr>`;

  const html = `<div style="max-width:640px;margin:0 auto;padding:36px 24px;background:#fff">
    <div style="font:600 11px/1 ${FUENTE};letter-spacing:.16em;color:#a0a0a0">MAEN STUDIOS · ${fecha.toUpperCase()}</div>
    <h1 style="font:700 27px/1.25 ${FUENTE};color:#111;margin:14px 0 8px">Pendientes de la web</h1>
    <p style="font:400 15px/1.55 ${FUENTE};color:#555;margin:0 0 26px">${escapar(resumen)}</p>
    <table style="width:100%;border-collapse:collapse">${orden.map(fila).join("")}</table>
    <p style="font:400 12px/1.55 ${FUENTE};color:#b0b0b0;margin-top:30px">
      Generado comprobando producción, el DNS, Resend y los datos del proyecto. No es una lista escrita a mano:
      cuando algo se arregla, deja de aparecer aquí solo.
    </p>
  </div>`;

  const texto = [
    `PENDIENTES DE LA WEB · ${fecha}`,
    resumen,
    "",
    ...orden.map((p) =>
      [
        `[${ETIQUETA[p.estado]}] ${p.titulo} (${p.area})`,
        p.detalle && `  ${p.detalle}`,
        p.accion && `  Qué hace falta: ${p.accion}`,
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  ].join("\n\n");

  return { asunto, html, texto, bloqueos, avisos };
}

function escapar(valor: string) {
  return valor.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function enviarInforme({ soloComponer = false } = {}) {
  const puntos = await auditar();
  const correo = componer(puntos);

  if (soloComponer) return { ...correo, enviado: false, destinatarios: DESTINATARIOS };

  const clave = process.env.RESEND_API_KEY;
  if (!clave) throw new Error("Falta RESEND_API_KEY");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${clave}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: REMITENTE,
      to: DESTINATARIOS,
      subject: correo.asunto,
      html: correo.html,
      text: correo.texto,
    }),
  });

  const cuerpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend devolvió ${res.status}: ${JSON.stringify(cuerpo)}`);

  return { ...correo, enviado: true, destinatarios: DESTINATARIOS };
}
