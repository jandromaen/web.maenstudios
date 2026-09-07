/**
 * Cifras y contenido de la propuesta para Tinto.
 *
 * Todo lo negociable vive aquí y no repartido por el JSX: si Jandro cambia el
 * precio o el número de piezas, se toca un sitio y la página entera cuadra.
 *
 * ✅ ESTO NO ES UNA PROPUESTA ABIERTA: Tinto la aprobó el 7 de septiembre de
 * 2026. Las cifras salen del deck de Canva «Propuesta Comunicación Social
 * Media x Tinto» (DAHT-UWU4Qo), que es el documento que ellos dijeron que sí.
 * No se tocan sin hablarlo con ellos: aquí ya no se negocia, se ejecuta.
 *
 * ⚠️ EL DECK APROBADO DEJA TRES COSAS SIN DECIR, y por eso no salen en ninguna
 * diapositiva. Inventarlas aquí sería enseñarle a un cliente un compromiso que
 * nadie ha acordado. Están recogidas abajo, en SIN_CERRAR.
 */

export const CLIENTE = {
  nombre: "Tinto",
  zona: "Mandri",
  ciudad: "Barcelona",
  /* No es «un restaurante» a secas: es uno que acaba de abrir. Todo el
     contenido depende de entender eso — no hay clientela hecha todavía. */
  momento: "recién abierto",
};

/**
 * Lo que el deck de Canva NO cierra.
 *
 * A propósito no se renderiza en ninguna diapositiva: es una nota para Jandro,
 * no para Tinto. Ponerle un número inventado a cualquiera de las tres sería
 * peor que dejarlo fuera, porque el cliente lo leería como acordado.
 */
export const SIN_CERRAR = [
  "Canales: el deck no nombra ni uno. Reels y stories apuntan a Instagram, pero no está escrito. Si va también TikTok, hay que añadirlo a CANALES antes de enseñar esto.",
  "Jornadas de rodaje al mes: no aparecen. Con ocho reels mensuales es lo que decide si la cuenta es rentable.",
  "Permanencia: no hay plazo mínimo escrito en el deck aprobado.",
];

/**
 * Canales que gestionamos.
 *
 * ⚠️ Solo Instagram, y no porque lo hayamos acordado: es el único que se
 * deduce del deck, donde hay reels y stories. En cuanto se confirme con Tinto,
 * añadir aquí los que falten — las frases que hablan de «los N canales» se
 * corrigen solas.
 */
export const CANALES = ["Instagram"];

/** El número escrito con letra, para las frases que hablan de «los N canales». */
const EN_LETRA = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis"];
export const CUANTOS_CANALES = EN_LETRA[CANALES.length] ?? String(CANALES.length);

export const PACK = {
  /**
   * El volumen se cuenta por semana porque es como está en el deck aprobado y
   * como se vive de verdad en un restaurante: «dos reels cada semana» se
   * entiende al instante, «ocho al mes» obliga a dividir.
   */
  reelsSemana: 2,
  postsSemana: 2,
  /** Mensual, para las frases que hablan del mes. No se teclea: se calcula. */
  get reelsMes() {
    return this.reelsSemana * 4;
  },
  get postsMes() {
    return this.postsSemana * 4;
  },
  canales: CANALES,
  /**
   * 800 € al mes, IVA INCLUIDO. Es la única cifra del deck de Canva y no lleva
   * desglose por partidas, al contrario que la de Defendoor.
   *
   * Que el IVA vaya dentro no es un detalle: si en la web pusiera «+ IVA», a
   * Tinto le llegaría una factura un 21 % más alta que lo que aprobó.
   */
  precioMes: 800,
  ivaIncluido: true,
};

/** Lo que se acordó, tal y como está en el deck que aprobaron. */
export const LO_ACORDADO = [
  "Dos reels y dos publicaciones cada semana",
  "Stories según el calendario del mes",
  "Rodaje de foto y de vídeo, con la postproducción incluida",
  "Calendario de contenido cerrado a un mes vista",
  "Copys, publicación y respuesta a la comunidad",
  "Informe mensual de métricas",
];

/**
 * Las cinco fases del método, que es como Maen lo cuenta siempre.
 *
 * Salen de los tres bloques del deck aprobado —dirección creativa, producción
 * y community management— abiertos por donde de verdad se separan: el rodaje y
 * la postproducción no son el mismo día ni la misma persona, y los reportes no
 * son publicar.
 */
export const METODOLOGIA = [
  {
    nombre: "Dirección creativa",
    resumen:
      "Un briefing al mes con vosotros. Sale de aquí todo lo que se rueda después.",
    puntos: [
      "Qué plato entra, qué se va de carta y qué merece contarse este mes",
      "Enfoque de cada pieza, con el gancho de los primeros tres segundos escrito",
      "Fechas de rodaje cerradas, encajadas fuera del servicio",
    ],
  },
  {
    nombre: "Rodaje",
    resumen:
      "Foto y vídeo en la misma visita. De una tirada sale el contenido del mes.",
    puntos: [
      "Equipo completo: cámara, luz propia y sonido",
      "Plato a plato, con el tiempo que necesita cada uno antes de enfriarse",
      "Sala y equipo cuando toca: un restaurante nuevo también se enseña vacío",
    ],
  },
  {
    nombre: "Postproducción",
    resumen:
      "Montaje, color y acabado. Aquí es donde una grabación se convierte en una pieza.",
    puntos: [
      "Edición vertical con subtítulos incrustados, que es como se ve sin sonido",
      "Retoque de las fotos, que aguantan mucho más que un fotograma",
      "Portadas pensadas para que la cuadrícula del perfil se sostenga entera",
    ],
  },
  {
    nombre: "Calendario y publicación",
    resumen:
      "Qué sale, dónde y qué día. Lo veis cerrado antes de que se publique nada.",
    puntos: [
      `Dos reels y dos publicaciones por semana en ${CUANTOS_CANALES === "un" ? "el canal" : `los ${CUANTOS_CANALES} canales`}`,
      "Stories del día a día: servicio, fuera de carta y lo que pasa en sala",
      "Copys escritos por nosotros y respuesta a comentarios y mensajes",
    ],
  },
  {
    nombre: "Reportes y métricas",
    resumen: "Qué ha funcionado, qué no, y qué cambiamos por eso.",
    puntos: [
      "Informe mensual sin florituras: alcance, guardados y perfiles nuevos",
      "Qué piezas han traído reservas y no solo likes",
      "El briefing del mes siguiente sale de aquí, no de una lluvia de ideas",
    ],
  },
];

/**
 * El equipo que toca la cuenta. Se enseña porque es la diferencia real entre
 * contratar un estudio y contratar a alguien con buena cámara: cuatro oficios
 * distintos, y ninguno haciendo el trabajo del otro a medias.
 *
 * La foto va con nombre propio y no metida dentro de «producción» porque en el
 * deck aprobado el rodaje fotográfico es una línea aparte del videográfico: en
 * un restaurante la carta y la sala se venden en foto tanto como en vídeo.
 */
export const EQUIPO = [
  {
    rol: "Brand Manager",
    hace: "Lleva la cuenta. Decide qué se cuenta cada mes, escribe los copys y os presenta los resultados.",
  },
  {
    rol: "Fotógrafo y cámara",
    hace: "Rueda la visita: plato, sala y equipo, con luz propia. Y sabe cuánto aguanta un plato antes de dejar de apetecer.",
  },
  {
    rol: "Editor",
    hace: "Monta los reels, subtitula, corrige color y retoca las fotos.",
  },
  {
    rol: "Community Manager",
    hace: "Publica, programa y contesta. Es quien está al otro lado cuando alguien pregunta si hay mesa el sábado.",
  },
];

/**
 * Preguntas que hace un restaurante y que conviene contestar sin que las haga.
 *
 * ⚠️ Las respuestas son un borrador de Jandro: son la forma de trabajar de
 * Maen, no cláusulas negociadas con Tinto. Repasarlas antes de enseñar esto.
 */
export const DUDAS = [
  {
    q: "¿El rodaje nos va a cortar el servicio?",
    a: "No. La fecha se cierra en el briefing con margen y se rueda fuera de las horas de servicio o en el cambio de turno. Un restaurante lleno es un plató imposible, y además a nadie le interesa una foto con prisa.",
  },
  {
    q: "¿Tiene que salir alguien delante de la cámara?",
    a: "No hace falta. Manda el plato y la sala. Ahora bien, cuando sale el equipo el contenido rinde bastante más: la gente vuelve a los sitios por las personas, no por la carta.",
  },
  {
    q: "¿De quién son las fotos y los vídeos?",
    a: "Vuestros, sin límite de uso ni de tiempo. Los entregamos también en bruto, por si un día queréis reeditarlos o usarlos en carta, web o publicidad.",
  },
  {
    q: "¿Y si cambia la carta a mitad de mes?",
    a: "Se rehace el calendario. Está pensado a un mes vista precisamente para poder moverlo: si entra un plato nuevo, se cuela en el siguiente rodaje y las stories lo cuentan el mismo día.",
  },
];

/**
 * Los cinco reels de la portada, que se pueden arrastrar.
 *
 * Todos de hostelería y todos distintos de los de las otras dos diapositivas:
 * entre las tres se enseñan trece marcas sin repetir ni una, que es lo que
 * demuestra catálogo. Repetir el mismo reel dos veces demuestra lo contrario.
 *
 * Se cargan con prioridad porque están en la primera pantalla, así que aquí
 * pesan los más ligeros: 2,5 MB los cinco.
 */
export const PORTADA = [
  "burmet",
  "perritos-calientes",
  "gran-tonino",
  "macchina",
  "ultramarinos-marin",
];

/**
 * Los dos casos del barrio.
 *
 * Es el argumento más fuerte que tenemos con Tinto y por eso va en una
 * diapositiva propia y a doble tamaño, no perdido en una rejilla de seis:
 * Tram-Tram e Hijos de Javier están en Sarrià, a diez minutos de Mandri. No
 * es «hacemos restaurantes», es «ya trabajamos en tu barrio».
 */
export const BARRIO = ["tram-tram", "hijos-de-javier"];

/**
 * Las seis piezas de la diapositiva de trabajo.
 *
 * Todas de hostelería, pero de seis casas distintas —cocina de autor,
 * focaccia, bocatería, bar de barrio, sin gluten y sector gastronómico—: se ve
 * de un vistazo que el oficio aguanta desde un bocadillo hasta un omakase.
 */
export const MUESTRA = [
  "mantis",
  "focacha",
  "b-de-bocata",
  "ultrapaninos-marin",
  "jansana",
  "gastroconnect",
];
