/**
 * Cifras y contenido de la propuesta para Marta Balada (marca nueva de joyería
 * de diseño contemporáneo, todavía sin lanzar).
 *
 * Todo lo negociable vive aquí y no repartido por el JSX: si Jandro cambia el
 * precio o el número de piezas, se toca un sitio y la página entera cuadra.
 *
 * ⚠️ PRECIOS SIN CONFIRMAR. Son una propuesta de partida, no tarifas cerradas:
 * prelanzamiento 1.200 € pago único, gestión 1.800 €/mes y paid media 300 €/mes
 * de gestión. Revisar antes de enviar el enlace.
 *
 * Reglas de Maen que esta propuesta respeta aunque Marta las pida:
 * - No gestionamos colaboraciones con creadoras/influencers.
 * - El community cubre la publicación; no respondemos comentarios ni DMs.
 * - Máximo dos reels por semana.
 */

export const CLIENTE = {
  contacto: "Marta",
  nombre: "Marta Balada",
  /* Aún no sabemos el nombre de la marca: el correo no lo dice. Se habla de
     «vuestra marca» en todas partes hasta que lo tengamos. */
  marca: "vuestra marca",
};

/** Canales que gestionamos. Pinterest queda para después de los tres meses. */
export const CANALES = ["Instagram", "TikTok"];

/** Lo que pidió Marta, tal cual, para que vea que lo hemos leído. */
export const LO_QUE_PIDEN = [
  "Estrategia de comunicación y prelanzamiento",
  "Gestión de Instagram, valorando TikTok y Pinterest",
  "Contenido propio: publicaciones, reels, stories y vídeo",
  "Crecer con comunidad real e interacción",
  "Publicidad digital, con honorarios separados de la inversión",
  "Seguimiento de resultados periódico",
  "Una primera etapa de tres meses",
];

/**
 * Fase 0. Pago único. Se cobra aparte porque es trabajo que se hace una vez:
 * cuando la marca ya existe en redes, esto no se repite.
 */
export const PRELANZAMIENTO = {
  semanas: 6,
  partidas: [
    {
      concepto: "Estrategia y plan de prelanzamiento",
      importe: 450,
      detalle: "Público, tono, pilares de contenido y la cuenta atrás semana a semana",
    },
    {
      concepto: "Dirección de arte en redes",
      importe: 300,
      detalle: "Línea visual del feed, portadas, plantillas de stories y bio",
    },
    {
      concepto: "Rodaje teaser",
      importe: 450,
      detalle: "Sesión de foto y vídeo de las piezas para la campaña de expectativa",
    },
  ],
  get precio() {
    return this.partidas.reduce((t, p) => t + p.importe, 0);
  },
};

/**
 * Gestión mensual. El total se calcula sumando el desglose: dos cifras que
 * deberían cuadrar acaban descuadrando el día que se toca una.
 */
export const DESGLOSE = [
  {
    concepto: "Dirección estratégica y creativa",
    importe: 360,
    horas: 9,
    perfil: "Brand Manager",
    detalle: "Briefing mensual, enfoque de cada pieza y guiones",
  },
  {
    concepto: "Producción de foto y vídeo",
    importe: 560,
    horas: 4,
    perfil: "Cámara y fotógrafo",
    detalle: "Una sesión al mes con luz de producto y macro",
  },
  {
    concepto: "Edición y retoque",
    importe: 520,
    horas: 13,
    perfil: "Editor",
    detalle: "Reels, stories y retoque fotográfico de joya",
  },
  {
    concepto: "Calendario y copys",
    importe: 200,
    horas: 5,
    perfil: "Brand Manager",
    detalle: "Qué sale, dónde y qué día, con los textos escritos",
  },
  {
    concepto: "Programación y publicación",
    importe: 80,
    horas: 3,
    perfil: "Community Manager",
    detalle: "Publicación en Instagram y TikTok",
  },
  {
    concepto: "Informe de resultados",
    importe: 80,
    horas: 2,
    perfil: "Brand Manager",
    detalle: "Informe mensual y ajustes para el mes siguiente",
  },
] as const;

export const PACK = {
  reelsSemana: 2,
  postsSemana: 2,
  get reelsMes() {
    return this.reelsSemana * 4;
  },
  get postsMes() {
    return this.postsSemana * 4;
  },
  storiesSemana: "3–5",
  sesionesMes: 1,
  canales: CANALES,
  precioMes: DESGLOSE.reduce((t, l) => t + l.importe, 0),
  horasNuestras: DESGLOSE.reduce((t, l) => t + l.horas, 0),
  permanencia: 3,
  /** Gestión de campañas. La inversión la paga la marca directamente a Meta/TikTok. */
  paidGestionMes: 300,
  paidInversionMinima: 500,
};

/** Total de la primera etapa: prelanzamiento + tres meses. Se calcula. */
export const PRIMERA_ETAPA =
  PRELANZAMIENTO.precio + PACK.precioMes * PACK.permanencia;

/** Las semanas antes del lanzamiento. */
export const CUENTA_ATRAS = [
  {
    semana: "−6",
    titulo: "Estrategia",
    texto: "Una reunión con vosotras. Público, tono, qué hace distinta a la marca y cómo se va a contar.",
  },
  {
    semana: "−5",
    titulo: "Dirección de arte",
    texto: "Línea visual del perfil, plantillas y bio. El perfil se deja listo antes de publicar nada.",
  },
  {
    semana: "−4",
    titulo: "Rodaje teaser",
    texto: "Primera sesión de foto y vídeo de las piezas. Sale el material de toda la cuenta atrás.",
  },
  {
    semana: "−3",
    titulo: "Expectativa, hasta el lanzamiento",
    texto: "Detalles, proceso, manos y materiales sin enseñar la colección entera. El día del lanzamiento ya hay gente esperando.",
  },
];

export const METODOLOGIA = [
  {
    nombre: "Dirección estratégica y creativa",
    resumen: "Un briefing al mes con vosotras. De aquí sale todo lo que se rueda.",
    puntos: [
      "Qué pieza o colección se cuenta este mes y con qué enfoque",
      "Guion de cada reel, con el gancho de los primeros tres segundos",
      "Fecha de sesión cerrada con margen",
    ],
  },
  {
    nombre: "Producción",
    resumen: "Foto y vídeo en la misma sesión. Lo grabamos nosotros, no trabajamos con material prestado.",
    puntos: [
      "Luz de producto y macro: en joyería el brillo se ilumina o no existe",
      "Piezas puestas, en mano y en cuello, además de bodegón",
      "Proceso y taller si lo hay: es lo que da valor al diseño",
    ],
  },
  {
    nombre: "Postproducción",
    resumen: "Montaje, color y retoque. Aquí la grabación se convierte en pieza.",
    puntos: [
      "Reels verticales con subtítulos, pensados para verse sin sonido",
      "Retoque fotográfico de joya: metal, piedra y reflejos",
      "Versiones para Instagram y TikTok",
    ],
  },
  {
    nombre: "Calendario y publicación",
    resumen: "Qué sale, dónde y qué día. Lo veis cerrado antes de que se publique nada.",
    puntos: [
      "Calendario mensual con cada pieza enlazada para que la uséis también en web o newsletter",
      "Copys escritos por nosotros",
      "Programación y publicación en los dos canales",
    ],
  },
  {
    nombre: "Resultados",
    resumen: "Qué ha funcionado, qué no y qué cambiamos por eso.",
    puntos: [
      "Informe mensual: alcance, seguidores nuevos, guardados y clics a la tienda",
      "Qué piezas venden y no solo gustan",
      "El briefing siguiente sale de aquí",
    ],
  },
];

/** Las siete preguntas del correo de Marta, contestadas en orden. */
export const PREGUNTAS = [
  {
    q: "¿Qué entra y qué va aparte?",
    a: "Entra todo el ciclo de contenido: estrategia, rodaje, edición, calendario, publicación e informe. Van aparte el prelanzamiento (pago único) y la gestión de publicidad, si la queréis.",
  },
  {
    q: "¿Cuántas publicaciones al mes?",
    a: `${PACK.reelsMes} reels, ${PACK.postsMes} publicaciones de foto o carrusel y ${PACK.storiesSemana} stories por semana.`,
  },
  {
    q: "¿Grabáis vosotros?",
    a: "Sí. Fotografía, vídeo y edición son nuestros. Si tenéis material vuestro, lo integramos también.",
  },
  {
    q: "¿Gestionáis comentarios y mensajes?",
    a: "Publicamos y programamos; los comentarios y mensajes directos los lleváis vosotras. Es lo que recomendamos en una marca que empieza: las primeras clientas quieren hablar con la marca, no con una agencia.",
  },
  {
    q: "¿Cuánto cuesta el prelanzamiento?",
    a: `${PRELANZAMIENTO.precio.toLocaleString("es-ES", { useGrouping: "always" } as Intl.NumberFormatOptions)} € + IVA, pago único. Se presupuesta aparte porque solo se hace una vez.`,
  },
  {
    q: "¿Honorarios y permanencia?",
    a: `${PACK.precioMes.toLocaleString("es-ES", { useGrouping: "always" } as Intl.NumberFormatOptions)} € + IVA al mes, con ${PACK.permanencia} meses de compromiso mínimo, que coincide con la primera etapa que proponíais. Después, mes a mes con un mes de preaviso.`,
  },
  {
    q: "¿Experiencia en joyería o moda?",
    a: "En moda, complementos y producto sí: Macala, Canallita, Aluxe o Gota, entre otras. Joyería como tal, seríais la primera, y es un producto que pide justo lo que hacemos: rodar bien de cerca.",
  },
];

/** Lo que no incluimos, dicho claro. */
export const FUERA = [
  {
    que: "Colaboraciones con influencers",
    porque: "No gestionamos creadoras ni colaboraciones. Lo nuestro es el contenido de marca, que es la base de todo lo demás.",
  },
  {
    que: "Respuesta a comentarios y mensajes",
    porque: "Publicamos nosotros; la conversación con vuestras clientas la lleváis vosotras.",
  },
  {
    que: "Pinterest",
    porque: "Lo dejamos para después de los tres primeros meses, cuando haya catálogo de imágenes suficiente.",
  },
];

export const EQUIPO = [
  {
    rol: "Brand Manager",
    hace: "Lleva la cuenta. Decide qué se cuenta cada mes, escribe guiones y copys y os presenta los resultados.",
  },
  {
    rol: "Cámara y fotógrafo",
    hace: "Rueda la sesión del mes: producto, piezas puestas y proceso, con luz propia.",
  },
  {
    rol: "Editor",
    hace: "Monta los reels, corrige color y retoca las fotos de joya.",
  },
  {
    rol: "Community Manager",
    hace: "Programa y publica en Instagram y TikTok, en el día y la hora que toca.",
  },
];

/** Portada: los cinco más ligeros de moda y producto. */
export const PORTADA = [
  "te-pone",
  "pigili-originals",
  "gota",
  "macala",
  "canallita",
];

/** Muestra: moda, complementos y producto. Sin repetir los de portada. */
export const MUESTRA = [
  "aluxe",
  "gozice",
  "daddies",
  "jansana",
  "mimosas",
  "besmaya",
];
