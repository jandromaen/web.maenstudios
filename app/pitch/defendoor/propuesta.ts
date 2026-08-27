/**
 * Cifras y contenido de la propuesta para Defendoor Abogados.
 *
 * Todo lo negociable vive aquí y no repartido por el JSX: si Jandro cambia el
 * precio o el número de piezas, se toca un sitio y la página entera cuadra.
 *
 * ⚠️ EL PRECIO ESTÁ SIN CONFIRMAR. Sale del propio formulario de la web
 * (tramo «1.500 – 3.000 € al mes») y de lo que implica el encargo: doce piezas
 * mensuales, dos jornadas de rodaje en Granollers y tres canales gestionados.
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
  jornadasMes: 2,
  canales: ["Instagram", "Facebook", "YouTube"],
  /** ⚠️ Sin confirmar por Jandro */
  precioMes: 1890,
  permanencia: 3,
};

export const LO_QUE_PIDEN = [
  "Tres vídeos cortos por semana, de forma recurrente",
  "Grabados en sus oficinas de Granollers",
  "Preparación, grabación y edición incluidas",
  "Gestión de Instagram, Facebook y YouTube",
  "Saber si podemos aportar nosotros al presentador",
];

/** Lo que entra en el pack, agrupado por bloque de trabajo. */
export const INCLUYE = [
  {
    bloque: "Antes del rodaje",
    puntos: [
      "Reunión mensual de contenido: qué dudas está recibiendo el despacho y cuáles merecen vídeo",
      "Guion de las doce piezas, con el gancho de los primeros tres segundos escrito",
      "Teleprónter en el rodaje: nadie tiene que memorizar nada",
      "Plan de jornada cerrado para que ningún abogado pierda más de dos horas",
    ],
  },
  {
    bloque: "Los dos días de rodaje",
    puntos: [
      "Dos jornadas al mes en vuestras oficinas de Granollers",
      "Equipo completo: cámara, sonido de solapa e iluminación propia",
      "Seis piezas por jornada, rodadas del tirón",
      "Dirección en plató: la persona que sale se limita a hablar",
    ],
  },
  {
    bloque: "Después",
    puntos: [
      "Edición vertical con subtítulos incrustados, que es como se ve sin sonido",
      "Versión horizontal para YouTube de las piezas que lo aguanten",
      "Portadas y títulos pensados para búsqueda, no para quedar bonitos",
      "Publicación y calendario en Instagram, Facebook y YouTube",
      "Respuesta a comentarios y mensajes en horario laboral",
    ],
  },
  {
    bloque: "Cada mes",
    puntos: [
      "Informe de qué ha funcionado y qué no, con la decisión que tomamos a partir de ahí",
      "Ajuste del plan del mes siguiente según lo que haya rendido",
    ],
  },
];

/** Preguntas que hacen los despachos y que conviene contestar sin que las hagan. */
export const DUDAS = [
  {
    q: "¿Y si un abogado no puede el día del rodaje?",
    a: "Se rueda varias semanas por delante precisamente para tener colchón. Si falla alguien, se reordena el guion en el momento y se graba lo que sí se puede: nunca se queda una semana sin publicar.",
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
  "te-pone",
  "gran-tonino",
  "pigili-originals",
  "canallita",
  "ultramarinos-marin",
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
  "mantis",
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
      "Vamos a Granollers y rodamos de una tirada varias semanas de contenido. Unas dos horas de vuestro abogado, no más.",
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
