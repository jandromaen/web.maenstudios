/**
 * Datos para las páginas legales.
 *
 * Estos textos son borradores técnicos, no asesoramiento jurídico: describen
 * con exactitud qué hace la web, que es la parte que las plantillas genéricas
 * se inventan. La revisión legal sigue siendo necesaria.
 */
export const LEGAL = {
  razonSocial: "Maen Marketing And Advertising, S.L.",
  nif: "B22788806",
  /**
   * Domicilio social, que no coincide con las oficinas comerciales de Bruc 61
   * y Génova 3. El art. 10 de la LSSI pide el domicilio de la sociedad, así
   * que se publican por separado y etiquetados: confundirlos induce a error.
   */
  domicilio: "Carrer Fastenrath, 9, 2º-2ª, 08035 Barcelona, España",
  /** Datos del Registro Mercantil, si la sociedad está inscrita */
  registro: "",
  nombreComercial: "Maen Studios",
  /** Fecha de la última revisión, visible al pie de cada página legal */
  actualizado: "agosto de 2026",
};

/** Encargados del tratamiento con acceso real a datos personales. */
export const ENCARGADOS = [
  {
    nombre: "Vercel Inc.",
    funcion: "Alojamiento del sitio y ejecución del formulario",
    ubicacion: "EE. UU., con cláusulas contractuales tipo",
    politica: "https://vercel.com/legal/privacy-policy",
  },
  {
    nombre: "Resend (Plus Five Five, Inc.)",
    funcion: "Envío del correo generado por el formulario de contacto",
    ubicacion: "EE. UU., con cláusulas contractuales tipo",
    politica: "https://resend.com/legal/privacy-policy",
  },
  {
    nombre: "Google Ireland Ltd.",
    funcion: "Google Analytics 4, solo si aceptas el aviso de cookies",
    ubicacion: "UE, con transferencias a EE. UU. bajo el Data Privacy Framework",
    politica: "https://policies.google.com/privacy",
  },
  {
    nombre: "Google Ireland Ltd. (YouTube)",
    funcion: "Reproductor incrustado en la página de podcast",
    ubicacion: "UE, con transferencias a EE. UU. bajo el Data Privacy Framework",
    politica: "https://policies.google.com/privacy",
  },
];

/** Lo que el navegador guarda. Ninguna de las dos primeras es una cookie. */
export const ALMACENAMIENTO = [
  {
    nombre: "maen-cookie-consent",
    tipo: "localStorage",
    finalidad: "Recordar si aceptaste o cerraste el aviso de cookies",
    plazo: "Hasta que borres los datos del navegador",
    consentimiento: false,
  },
  {
    nombre: "maen-theme",
    tipo: "localStorage",
    finalidad: "Recordar si prefieres el modo claro u oscuro",
    plazo: "Hasta que borres los datos del navegador",
    consentimiento: false,
  },
  {
    nombre: "_ga, _ga_*",
    tipo: "Cookie de Google Analytics 4",
    finalidad: "Medir visitas de forma agregada, con la IP anonimizada",
    plazo: "Hasta 2 años",
    consentimiento: true,
  },
  {
    nombre: "Cookies de YouTube",
    tipo: "Cookie de terceros",
    finalidad:
      "Solo en /podcast, si reproduces un episodio incrustado. Las gestiona Google",
    plazo: "Según la política de Google",
    consentimiento: true,
  },
];
