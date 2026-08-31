/**
 * Cifras y contenido de la propuesta para Defendoor Abogados.
 *
 * Todo lo negociable vive aquí y no repartido por el JSX: si Jandro cambia el
 * precio o el número de piezas, se toca un sitio y la página entera cuadra.
 *
 * ⚠️ EL PRECIO ESTÁ SIN CONFIRMAR. Sale del propio formulario de la web
 * (tramo «1.500 – 3.000 € al mes») y de lo que implica el encargo: doce piezas
 * mensuales, dos jornadas de rodaje en Granollers y cuatro canales gestionados.
 * No es una tarifa publicada de Maen. Revisar antes de enviar el enlace.
 */

export const CLIENTE = {
  nombre: "Defendoor Abogados",
  contacto: "José",
  web: "https://defendoor.es/",
  ciudad: "Granollers",
  /* Su producto real: no son «abogados» genéricos, son Ley de Segunda
     Oportunidad. Todo el contenido depende de entender eso. */
  especialidad: "Ley de Segunda Oportunidad",
};

/**
 * Desglose del presupuesto, por partida.
 *
 * ⚠️ EL REPARTO ESTÁ SIN CONFIRMAR, igual que el total. Es una distribución
 * defendible del trabajo que hay detrás -la jornada de rodaje y la edición se
 * llevan lo grueso-, no las tarifas internas de Maen. Revisar antes de enviar.
 *
 * El total del pack se calcula sumando esto y no se escribe aparte: dos
 * cifras que deberían cuadrar acaban descuadrando el día que se toca una.
 */
/**
 * Canales que gestionamos. Ojo: no son exactamente los que pidieron —ellos
 * hablaban de Instagram, Facebook y YouTube—. TikTok lo añadimos nosotros.
 */
export const CANALES = ["Instagram", "TikTok", "Facebook", "YouTube"];

/**
 * El número escrito con letra, para las frases que hablan de «los N canales».
 *
 * Estaban escritas a mano y decían «tres» cuando la lista pasó a cuatro. Es el
 * mismo problema que ya se resuelve con el precio y las horas, que se suman en
 * vez de teclearse: si mañana entra otro canal, estas frases se corrigen solas.
 */
const EN_LETRA = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis"];
export const CUANTOS_CANALES = EN_LETRA[CANALES.length] ?? String(CANALES.length);

export const DESGLOSE = [
  {
    concepto: "Dirección creativa",
    importe: 320,
    horas: 8,
    perfil: "Brand Manager",
    detalle: "Briefing mensual, enfoque y guiones de las doce piezas",
  },
  {
    concepto: "Producción audiovisual",
    importe: 560,
    horas: 4,
    perfil: "Camarógrafo",
    detalle: "Media jornada en Granollers, con montaje y desmontaje",
  },
  {
    concepto: "Edición del contenido",
    importe: 480,
    horas: 12,
    perfil: "Editor",
    detalle: "Una hora por pieza: montaje, subtítulos y versiones",
  },
  {
    concepto: "Calendario social media",
    importe: 200,
    horas: 5,
    perfil: "Brand Manager",
    detalle: "Qué sale, dónde y qué día, con los copys escritos",
  },
  {
    concepto: "Programación y publicación",
    importe: 190,
    horas: 8,
    perfil: "Community Manager",
    detalle: `Publicación en los ${CUANTOS_CANALES} canales y respuesta a la comunidad`,
  },
  {
    concepto: "Análisis de reportes y métricas",
    importe: 140,
    horas: 3,
    perfil: "Brand Manager",
    detalle: "Informe mensual y decisiones para el mes siguiente",
  },
] as const;

export const PACK = {
  /**
   * El volumen se cuenta por semana, que es como lo pidió José y como se vive
   * de verdad: «tres vídeos cada semana» se entiende al instante, «doce al
   * mes» obliga a dividir y suena a paquete de agencia.
   *
   * El mensual solo se usa para dividir el precio entre piezas.
   */
  piezasSemana: 3,
  piezasMes: 12,
  jornadasMes: 1,
  /**
   * Lo único que les pedimos: las cuatro horas del rodaje más una de briefing
   * y repaso de reportes. Coincide con las cuatro del camarógrafo porque son
   * la misma media jornada, con ellos delante.
   */
  horasMes: 5,
  canales: CANALES,
  /** Suma del desglose. No se escribe a mano para que no pueda descuadrar. */
  precioMes: DESGLOSE.reduce((t, l) => t + l.importe, 0),
  /**
   * Coste de aportar nosotros a la persona que sale en los vídeos: casting,
   * caché y su presencia en la jornada de rodaje.
   *
   * Va aparte del pack a propósito. Es la opción que les desaconsejamos, y
   * meterla dentro del precio base sería cobrarles por algo que les hemos
   * dicho que no les conviene.
   */
  presentadorMes: 500,
  /** Horas de trabajo nuestro al mes. Sale del desglose, no se escribe. */
  horasNuestras: DESGLOSE.reduce((t, l) => t + l.horas, 0),
  permanencia: 3,
};

export const LO_QUE_PIDEN = [
  "Tres vídeos cortos por semana, de forma recurrente",
  "Grabados en sus oficinas de Granollers",
  "Preparación, grabación y edición incluidas",
  "Gestión de Instagram, Facebook y YouTube",
  "Saber si podemos aportar nosotros al presentador",
];

/**
 * Las cinco fases del método, que es como Maen lo cuenta siempre.
 *
 * Sustituyen al antiguo «qué incluye» por bloques sueltos: un cliente que va a
 * pagar todos los meses no quiere una lista de la compra, quiere saber por
 * dónde pasa su contenido y en qué momento le toca a él decidir algo.
 */
export const METODOLOGIA = [
  {
    nombre: "Briefing creativo",
    resumen: "Una hora con vosotros al mes. Es lo único que os pedimos además del rodaje.",
    puntos: [
      "Qué dudas está recibiendo el despacho este mes",
      "Cuáles merecen vídeo y con qué enfoque",
      "Guiones cerrados, con el gancho de los primeros tres segundos escrito",
    ],
  },
  {
    nombre: "Rodaje",
    resumen: "Una jornada al mes en vuestras oficinas. Sale todo el contenido del mes de una tirada.",
    puntos: [
      "Equipo completo: cámara, sonido de solapa e iluminación propia",
      "Teleprónter, para que nadie tenga que memorizar",
      "Dirección en plató: quien sale se limita a hablar",
    ],
  },
  {
    nombre: "Postproducción",
    resumen: "Montaje, ritmo y acabado. Aquí es donde una grabación se convierte en una pieza.",
    puntos: [
      "Edición vertical con subtítulos incrustados, que es como se ve sin sonido",
      "Versión horizontal para YouTube de lo que lo aguante",
      "Portadas y títulos pensados para búsqueda, no para quedar bonitos",
    ],
  },
  {
    nombre: "Calendario de contenido",
    resumen: "Qué sale, dónde y qué día. Vosotros lo veis antes de que se publique nada.",
    puntos: [
      `Tres publicaciones por semana repartidas entre los ${CUANTOS_CANALES} canales`,
      "Copys y hashtags escritos por nosotros",
      "Respuesta a comentarios y mensajes en horario laboral",
    ],
  },
  {
    nombre: "Reportes y métricas",
    resumen: "Qué ha funcionado, qué no, y qué cambiamos por eso.",
    puntos: [
      "Informe mensual sin florituras: alcance, guardados y mensajes recibidos",
      "Qué temas han traído consultas reales al despacho",
      "El briefing del mes siguiente sale de aquí, no de una lluvia de ideas",
    ],
  },
];

/** Preguntas que hacen los despachos y que conviene contestar sin que las hagan. */
export const DUDAS = [
  {
    q: "¿Y si un abogado no puede el día del rodaje?",
    a: "La fecha se cierra en el briefing, con dos semanas de margen, y se puede mover mientras aviséis con antelación. Si el día falla alguien, se rueda con quien esté: por eso conviene tener dos caras preparadas y no una.",
  },
  {
    q: "¿Quién decide qué se cuenta?",
    a: "Vosotros tenéis la última palabra sobre el fondo legal, siempre. Nosotros decidimos cómo se cuenta. Ningún vídeo se publica sin que lo hayáis visto.",
  },
  {
    q: "¿Podemos usar los vídeos en publicidad?",
    a: "Sí. Las piezas son vuestras, sin límite de uso ni de tiempo, y las entregamos también en bruto por si un día queréis reeditarlas.",
  },
  {
    q: "¿Qué pasa si queremos parar?",
    a: `Los tres primeros meses son el compromiso mínimo: antes de ese plazo no hay datos suficientes para saber si funciona. A partir del cuarto, un mes de preaviso y sin penalización.`,
  },
];

/**
 * Los cinco reels de la portada, que se pueden arrastrar.
 *
 * Van aparte de los de la tira y sin repetir ninguno: entre las dos
 * diapositivas se enseñan once marcas distintas, que es lo que demuestra
 * catálogo. Repetir el mismo reel dos veces demuestra lo contrario.
 *
 * Se cargan con prioridad porque están en la primera pantalla, así que aquí
 * pesan los más ligeros: 2,3 MB los cinco.
 */
export const PORTADA = [
  "ultramarinos-marin",
  "mantis",
  "focacha",
  "te-pone",
  "gran-tonino",
];

/**
 * Las seis piezas de la diapositiva de trabajo: un sector distinto cada una.
 *
 * Antes había dos de gastronomía y dos de moda, y de lejos parecían la misma
 * marca repetida. Ahora van gastronomía, moda, ocio nocturno, música,
 * lifestyle y alimentación: se ve de un vistazo que el oficio es el mismo en
 * seis mundos distintos, que es justo el argumento para un despacho que sería
 * el séptimo.
 *
 * Mantis va la primera a propósito: es el cliente de la presentación que Jandro
 * puso como referencia.
 */
export const MUESTRA = [
  "burmet",
  "aluxe",
  "fortuna-tonino",
  "besmaya",
  "mimosas",
  "jansana",
];

/** El mes de trabajo, contado semana a semana. */
export const MES = [
  {
    semana: "01",
    titulo: "Reunión y guiones",
    texto:
      "Una hora con vosotros para sacar las preguntas que más os repiten. Salimos de ahí con todos los guiones escritos.",
  },
  {
    semana: "02",
    titulo: "Primera jornada",
    texto:
      "Una jornada en Granollers y sale el contenido del mes entero. Unas tres horas de vuestro abogado, no más.",
  },
  {
    semana: "03",
    titulo: "Publicación y segunda jornada",
    texto:
      "Ya salen tres vídeos por semana mientras rodamos el resto.",
  },
  {
    semana: "04",
    titulo: "Números y ajuste",
    texto:
      "Qué se ha visto, qué se ha guardado y qué preguntas ha traído. Con eso se escribe el mes siguiente.",
  },
];

/**
 * El equipo que toca la cuenta. Se enseña porque es la diferencia real entre
 * contratar una agencia y contratar a un freelance: cuatro oficios distintos,
 * y ninguno haciendo el trabajo del otro a medias.
 */
export const EQUIPO = [
  {
    rol: "Brand Manager",
    hace: "Lleva la cuenta. Decide qué se cuenta cada mes, escribe los guiones y os presenta los resultados.",
  },
  {
    rol: "Camarógrafo",
    hace: "Rueda la jornada en vuestras oficinas: cámara, luz y sonido. Y dirige a quien sale, para que no tenga que actuar.",
  },
  {
    rol: "Editor",
    hace: "Monta las doce piezas, subtitula y saca las versiones para cada canal.",
  },
  {
    rol: "Community Manager",
    hace: "Publica, programa y contesta. Es quien está al otro lado cuando alguien pregunta algo en un comentario.",
  },
];
