import { auditar, type Punto } from "./auditoria";
import { traficoSemanal, variacion, type Trafico } from "./trafico";
import { busquedasSemanales, type Busquedas, type Consulta } from "./busquedas";
import { BUZONES, REMITENTE as DIRECCION } from "./remitente";

/** Compone y envía el informe semanal de pendientes. */
const REMITENTE = `Web de Maen Studios <${DIRECCION}>`;
const DESTINATARIOS = BUZONES;

const ORDEN: Record<Punto["estado"], number> = { bloqueo: 0, aviso: 1, ok: 2 };
const ETIQUETA: Record<Punto["estado"], string> = { bloqueo: "BLOQUEO", aviso: "PENDIENTE", ok: "RESUELTO" };
const COLOR: Record<Punto["estado"], string> = { bloqueo: "#c0392b", aviso: "#b7791f", ok: "#2f855a" };

const FUENTE = "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

/** El correo se lee en clientes que ignoran el CSS externo: todo va en línea. */
function componer(puntos: Punto[], trafico: Trafico | null, busquedas: Busquedas | null) {
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


  /* El tráfico va ARRIBA de los pendientes, y no al final como un anexo: es lo
     primero que Jandro quiere ver el viernes, y una lista de pendientes leída
     sin saber si entra gente no permite priorizar nada. */
  const numero = (n: number) => n.toLocaleString("es-ES");

  const listita = (titulo: string, filas: { clave: string; visitas: number }[]) =>
    filas.length
      ? `<div style="margin-top:14px">
          <div style="font:600 11px/1 ${FUENTE};letter-spacing:.08em;color:#a0a0a0">${escapar(titulo.toUpperCase())}</div>
          ${filas
            .map(
              (f) =>
                `<div style="font:400 13px/1.6 ${FUENTE};color:#444;display:flex;justify-content:space-between;gap:12px">
                   <span>${escapar(f.clave)}</span><b style="color:#111">${numero(f.visitas)}</b>
                 </div>`,
            )
            .join("")}
        </div>`
      : "";

  const bloqueTrafico = !trafico
    ? ""
    : `<div style="background:#fafaf8;border:1px solid #ededed;padding:18px 20px;margin:0 0 26px">
        <div style="font:600 11px/1 ${FUENTE};letter-spacing:.14em;color:#a0a0a0">TRÁFICO DE LOS ÚLTIMOS 7 DÍAS</div>
        <div style="font:700 30px/1.15 ${FUENTE};color:#111;margin:10px 0 2px">
          ${numero(trafico.visitantes)} <span style="font:400 15px/1 ${FUENTE};color:#666">visitantes</span>
          <span style="color:#ddd">·</span>
          ${numero(trafico.paginas)} <span style="font:400 15px/1 ${FUENTE};color:#666">páginas vistas</span>
        </div>
        <div style="font:400 13px/1.5 ${FUENTE};color:#666">${escapar(variacion(trafico.visitantes, trafico.visitantesPrevios))}</div>
        ${listita("Páginas más vistas", trafico.topPaginas)}
        ${listita("De dónde llegan", trafico.topOrigenes)}
        ${listita("Dispositivo", trafico.dispositivos)}
        <div style="font:400 11px/1.5 ${FUENTE};color:#b0b0b0;margin-top:14px">
          Medido en el navegador, así que subcuenta: quien use bloqueador no aparece. Sirve para ver tendencia.
        </div>
      </div>`;


  /* Las búsquedas van justo debajo del tráfico: el tráfico dice cuánta gente
     entra y esto dice por qué. Separarlos obligaría a leer dos veces. */
  const consultas = (titulo: string, filas: Consulta[], pie?: string) =>
    filas.length
      ? `<div style="margin-top:16px">
          <div style="font:600 11px/1 ${FUENTE};letter-spacing:.08em;color:#a0a0a0">${escapar(titulo.toUpperCase())}</div>
          ${pie ? `<div style="font:400 11px/1.5 ${FUENTE};color:#b0b0b0;margin:2px 0 6px">${escapar(pie)}</div>` : ""}
          ${filas
            .map(
              (c) =>
                `<div style="font:400 13px/1.6 ${FUENTE};color:#444;display:flex;justify-content:space-between;gap:12px">
                   <span>${escapar(c.termino)}</span>
                   <span style="white-space:nowrap;color:#888">${numero(c.impresiones)} veces · pos. ${c.posicion}${c.clics ? ` · ${numero(c.clics)} clic${c.clics > 1 ? "s" : ""}` : ""}</span>
                 </div>`,
            )
            .join("")}
        </div>`
      : "";

  const bloqueBusquedas = !busquedas
    ? ""
    : `<div style="background:#fafaf8;border:1px solid #ededed;padding:18px 20px;margin:0 0 26px">
        <div style="font:600 11px/1 ${FUENTE};letter-spacing:.14em;color:#a0a0a0">QUÉ BUSCA LA GENTE PARA ENCONTRARTE</div>
        <div style="font:700 30px/1.15 ${FUENTE};color:#111;margin:10px 0 2px">
          ${numero(busquedas.clics)} <span style="font:400 15px/1 ${FUENTE};color:#666">clics desde Google</span>
          <span style="color:#ddd">·</span>
          ${numero(busquedas.impresiones)} <span style="font:400 15px/1 ${FUENTE};color:#666">veces que saliste</span>
        </div>
        <div style="font:400 13px/1.5 ${FUENTE};color:#666">
          Posición media ${busquedas.posicionMedia} · ${escapar(variacion(busquedas.clics, busquedas.clicsPrevios))}
        </div>
        ${consultas("Lo que más te trae", busquedas.top)}
        ${consultas("A tiro de primera página", busquedas.aTiro, "Posiciones 8 a 20: aquí un artículo o un retoque de copy sí mueve la aguja.")}
        <div style="font:400 11px/1.5 ${FUENTE};color:#b0b0b0;margin-top:14px">
          Google publica estos datos con dos o tres días de retraso, así que la semana termina hace tres días.
        </div>
      </div>`;

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
    ${bloqueTrafico}
    ${bloqueBusquedas}
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
    trafico
      ? `TRÁFICO (7 días): ${trafico.visitantes} visitantes, ${trafico.paginas} páginas vistas · ${variacion(trafico.visitantes, trafico.visitantesPrevios)}`
      : "",
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
  /* Si la analítica falla, el informe sale igual sin el bloque de tráfico: los
     pendientes son la razón de ser de este correo y no deben caerse porque
     Vercel tarde en responder o falte el token. */
  const [puntos, trafico, busquedas] = await Promise.all([
    auditar(),
    traficoSemanal().catch((err) => {
      console.error("[informe] tráfico:", err);
      return null;
    }),
    busquedasSemanales().catch((err) => {
      console.error("[informe] búsquedas:", err);
      return null;
    }),
  ]);
  const correo = componer(puntos, trafico, busquedas);

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
