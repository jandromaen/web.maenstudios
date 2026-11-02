/**
 * Cifras y contenido de la propuesta para CGLU (UCLG).
 *
 * Todo lo negociable vive aquí y no repartido por el JSX: si Jandro cambia un
 * precio o una fecha, se toca un sitio y la página entera cuadra.
 *
 * Sale de los Términos de Referencia «Video Interview Editing Services» de la
 * iniciativa WYDE Women's Leadership (ONU Mujeres + UE, implementada por CGLU)
 * y del correo con el que pidieron presupuesto el 2 de noviembre de 2026.
 *
 * ⚠️ LOS PRECIOS SON UNA PROPUESTA, NO TARIFAS CERRADAS. Revisar antes de
 * enviar el enlace. Lo mismo el calendario: depende de que el material en
 * bruto llegue antes del 13 de noviembre.
 *
 * ⚠️ Los ToR dicen «Contract duration: November-December 2027»; el correo
 * habla de la segunda quincena de noviembre de 2026. Aquí va 2026, que es lo
 * que piden en el correo. Confirmarlo con ellos.
 */

export const CLIENTE = {
  nombre: "CGLU",
  nombreLargo: "Ciudades y Gobiernos Locales Unidos",
  iniciativa: "WYDE Women's Leadership",
  socios: "ONU Mujeres y la Unión Europea",
};

export const LO_QUE_PIDEN = [
  "Editar 8 entrevistas grabadas a alcaldesas, líderes locales y expertas",
  "Una versión completa de 6–8 minutos de cada una",
  "Una cápsula o teaser de 60–90 segundos de cada una",
  "Idioma original (inglés, francés, español o portugués) con subtítulos",
  "Identidad común para toda la serie, lista para web, redes y eventos",
  "Versiones finales en la segunda quincena de noviembre",
];

/**
 * Desglose del presupuesto, por partida.
 *
 * El total se calcula sumando esto y no se escribe aparte: dos cifras que
 * deberían cuadrar acaban descuadrando el día que se toca una.
 */
export const DESGLOSE = [
  {
    concepto: "Paquete gráfico de la serie",
    unidades: 1,
    precio: 450,
    detalle: "Intro y outro animadas, rótulos, estilo de subtítulos, miniatura y look de color",
  },
  {
    concepto: "Entrevista completa · 6–8 min",
    unidades: 8,
    precio: 390,
    detalle: "Montaje, etalonaje, limpieza y mezcla de audio, música",
  },
  {
    concepto: "Cápsula · 60–90 s",
    unidades: 8,
    precio: 160,
    detalle: "Selección del momento más fuerte y montaje propio",
  },
  {
    concepto: "Subtítulos de entrevista · 2 idiomas",
    unidades: 8,
    precio: 120,
    detalle: "Transcripción, traducción revisada, .SRT y versión quemada",
  },
  {
    concepto: "Subtítulos de cápsula · 3 idiomas",
    unidades: 8,
    precio: 40,
    detalle: "Inglés, francés y español",
  },
  {
    concepto: "Cápsulas en 9:16 y 1:1",
    unidades: 8,
    precio: 40,
    detalle: "Reencuadre para Instagram, LinkedIn y TikTok",
  },
  {
    concepto: "Miniaturas",
    unidades: 16,
    precio: 15,
    detalle: "Dos por entrevista, para YouTube y redes",
  },
] as const;

const BASE = DESGLOSE.reduce((t, l) => t + l.unidades * l.precio, 0);

export const PRECIO = {
  /** Suma del desglose. No se escribe a mano para que no pueda descuadrar. */
  base: BASE,
  ivaPct: 21,
  iva: Math.round(BASE * 0.21 * 100) / 100,
  total: Math.round(BASE * 1.21 * 100) / 100,
  /** Lo que cuesta cada entrevista con sus dos piezas, sin el paquete gráfico. */
  porEntrevista: (BASE - DESGLOSE[0].precio) / 8,
  revisiones: 2,
  horaExtra: 50,
};

export const CIFRAS = {
  entrevistas: 8,
  capsulas: 8,
  piezas: 16,
  idiomas: 3,
  entrega: "30 nov",
};

/** Lo que lleva cada pieza, tal como lo piden los ToR. */
export const INCLUYE = [
  "Intro y outro animadas con los logos de CGLU, ONU Mujeres y la UE",
  "Rótulos con nombre, cargo y ciudad de cada entrevistada",
  "Etalonaje, nivelación de audio y limpieza de ruido",
  "Música de fondo suave, con licencia incluida",
  "Subtítulos quemados y archivos .SRT por idioma",
  "Miniaturas para YouTube y redes",
  "MP4 Full HD 1080p y archivos fuente de Premiere Pro",
];

/** Las fases del encargo, con su fecha. */
export const FASES = [
  {
    fecha: "Hasta 13 nov",
    nombre: "Arranque",
    resumen:
      "Una llamada y nos pasáis el material en bruto, logos, guía de marca y los datos de los rótulos.",
  },
  {
    fecha: "17 nov",
    nombre: "Piloto",
    resumen:
      "Paquete gráfico y una primera entrevista montada. Se valida el estilo una vez y ya vale para las ocho.",
  },
  {
    fecha: "24 nov",
    nombre: "Primeras versiones",
    resumen:
      "Las 8 entrevistas y las 8 cápsulas, subtituladas, en un enlace de revisión.",
  },
  {
    fecha: "26 nov",
    nombre: "Vuestro feedback",
    resumen:
      "Un documento consolidado por pieza. Dos días hábiles para que nadie vaya con prisas.",
  },
  {
    fecha: "30 nov",
    nombre: "Entrega final",
    resumen:
      "Versiones finales, formatos de redes, miniaturas, .SRT y archivos fuente.",
  },
];

/** Por qué la serie se piensa entera y no pieza a pieza. */
export const LECTURA = {
  frase:
    "Ocho voces, ocho ciudades, cuatro idiomas. Tiene que verse como una sola serie.",
};

export const EQUIPO = [
  {
    rol: "Project Manager",
    hace: "Vuestro único interlocutor. Recoge el feedback, cuida el calendario y responde en el día.",
  },
  {
    rol: "Editor principal",
    hace: "Monta las ocho entrevistas: escoge qué se queda, da ritmo y cuida que cada voz se entienda.",
  },
  {
    rol: "Motion y color",
    hace: "Diseña el paquete gráfico, etalona y deja las dieciséis piezas con el mismo acabado.",
  },
  {
    rol: "Subtítulos y traducción",
    hace: "Transcribe, traduce y revisa en inglés, francés y español, con los nombres y cargos bien escritos.",
  },
];

export const DUDAS = [
  {
    q: "¿Y si el material llega más tarde?",
    a: "El calendario se mueve los mismos días que se retrase el material, dentro de los 20 días hábiles que marcan los ToR. Si llega por tandas, empezamos con lo que haya.",
  },
  {
    q: "¿Quién hace las traducciones?",
    a: "Nosotros, con revisión profesional. Si preferís que vuestro equipo valide los textos, os los pasamos antes de quemarlos en el vídeo.",
  },
  {
    q: "¿Cómo se paga?",
    a: "Por tandas, tras la aprobación de cada entrega, tal como piden los ToR. Factura con pago a 30 días.",
  },
  {
    q: "¿Qué queda fuera?",
    a: `Grabar material nuevo, locuciones y subtítulos en idiomas distintos de inglés, francés y español. Cambios más allá de las ${PRECIO.revisiones} rondas, a ${PRECIO.horaExtra} €/h + IVA.`,
  },
];

/** Los cinco reels de la portada, que se pueden arrastrar. */
export const PORTADA = ["tram-tram", "focacha", "mantis", "macchina", "te-pone"];

/**
 * Las seis piezas de la diapositiva de trabajo, sin repetir las de la
 * portada. Gastroconnect va la primera porque es formato de conversación,
 * lo más parecido a una entrevista.
 */
export const MUESTRA = ["gastroconnect", "gota", "besmaya", "jansana", "aluxe", "fortuna-tonino"];
