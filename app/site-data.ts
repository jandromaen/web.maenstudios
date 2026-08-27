export const EMAIL_PROJECTS = "jandro@maenstudios.com";
export const EMAIL_ADMIN = "info@maenstudios.com";

/** Proyectos / formulario de contacto */
export const EMAIL = EMAIL_PROJECTS;

/**
 * Horquillas de presupuesto del formulario de contacto.
 *
 * Van aquí y no dentro del formulario porque son una decisión de negocio, no
 * de maquetación: cambiarlas es editar esta lista y nada más. El texto se
 * guarda tal cual en el correo, así que lo que se escriba aquí es lo que se
 * lee al recibir el aviso.
 *
 * ATENCIÓN: estos tramos son una propuesta. La web no publica precios en
 * ningún sitio, así que no hay de dónde deducirlos; ajústalos a lo que
 * cobráis de verdad antes de darlos por buenos.
 *
 * El último no es un tramo: es la salida para quien todavía no lo sabe. Sin
 * ella, esa persona o miente o abandona el formulario.
 */
export const PRESUPUESTOS = [
  "Menos de 750 € al mes",
  "750 – 1.500 € al mes",
  "1.500 – 3.000 € al mes",
  "Más de 3.000 € al mes",
  "Es un proyecto puntual, no mensual",
  "Aún no lo tengo claro",
] as const;

/**
 * Dónde puede grabar un creador. Va aquí por lo mismo que los tramos de
 * presupuesto: es una decisión de negocio —dónde hay rodajes— y no de
 * maquetación.
 *
 * «En remoto» no sobra: buena parte del UGC se graba en casa del creador con
 * el producto enviado por correo, así que la ciudad no siempre importa.
 */
export const CIUDADES_CREADOR = [
  "Barcelona",
  "Madrid",
  "Área metropolitana de Barcelona",
  "Comunidad de Madrid",
  "Otra ciudad de España",
  "En remoto, desde donde esté",
] as const;

export const navLinks = [
  { label: "Work", href: "/clientes" },
  { label: "Services", href: "/servicios" },
  { label: "News", href: "/blog" },
  { label: "Podcast", href: "/podcast" },
  { label: "Talents", href: "/talents" },
  { label: "Contact", href: "/contacto" },
];

export const steps = [
  {
    n: "01",
    title: "Briefing",
    desc: "Nos cuentas qué contenido necesitas, tus objetivos y la frecuencia a la que quieres publicar.",
  },
  {
    n: "02",
    title: "Plan de contenido",
    desc: "Definimos qué vamos a producir: formatos, mensajes, enfoque y estrategia creativa.",
  },
  {
    n: "03",
    title: "Equipo asignado",
    desc: "Seleccionamos el equipo adecuado para tu proyecto: guionistas, editores y talento según lo que necesites.",
  },
  {
    n: "04",
    title: "Producción",
    desc: "Grabamos y editamos el contenido —guion, rodaje, edición y motion— según los objetivos pactados.",
  },
  {
    n: "05",
    title: "Entrega",
    desc: "Recibes el contenido final listo para publicar con la cadencia acordada: semanal, quincenal o la que necesites.",
  },
  {
    n: "06",
    title: "Medición y optimización",
    desc: "Analizamos el rendimiento y optimizamos para mejorar alcance, comunidad y resultados en cada ciclo.",
  },
];

export const services = [
  {
    icon: "01",
    title: "Dirección Creativa",
    sub: "Concepto, tono y mirada de marca",
    desc: "Definimos la idea, el lenguaje visual y la línea editorial de tu contenido. Conceptos de campaña, guiones y dirección creativa para que cada pieza se sienta coherente, reconocible y con intención.",
  },
  {
    icon: "02",
    title: "Producción Audiovisual",
    sub: "Del rodaje al montaje final",
    desc: "Grabamos y editamos el contenido que tu marca necesita en redes: Reels, spots cortos, piezas de producto y motion. Ritmo, sonido y acabado profesional, listos para publicar.",
  },
  {
    icon: "03",
    title: "Community Management",
    sub: "Presencia activa y conversación",
    desc: "Gestionamos tu día a día en redes: calendario, publicación, interacción y seguimiento. Mantenemos la comunidad viva y alineada con los objetivos de la marca.",
  },
];

export const perks = [
  {
    big: "01",
    title: "Un solo equipo",
    desc: "Todo tu contenido gestionado desde un mismo punto de contacto. Sin descoordinación.",
  },
  {
    big: "02",
    title: "Entregas constantes",
    desc: "Contenido listo para publicar con la cadencia que acordemos. Nunca te quedas sin material.",
  },
  {
    big: "03",
    title: "Escalable y flexible",
    desc: "Empezamos a tu ritmo y crecemos según tus necesidades. Sin ataduras innecesarias.",
  },
];

// Reels del hero (arrastrables). Sustituye estas rutas por los .mp4 reales en /public.
export const heroReels = [
  "/reel-hero.mp4",
  "/reel-focacha.mp4",
  "/reel-proyecto.mp4",
  "/reel-cocina.mp4",
];

export const faqs = [
  {
    q: "¿Cuánto cuesta contratar una agencia de creación de contenido?",
    a: "Depende del alcance del proyecto. En Maen Studios trabajamos con planes mensuales que combinan dirección creativa, producción audiovisual y community management según lo que necesite tu marca. Escríbenos y te preparamos un presupuesto a medida sin compromiso.",
  },
  {
    q: "¿Qué incluye el servicio de producción audiovisual?",
    a: "Nos encargamos del proceso completo: idea y guion, grabación, edición, motion y adaptación a cada plataforma. Entregamos las piezas listas para publicar con la cadencia que acordemos.",
  },
  {
    q: "¿Dónde estáis y trabajáis en toda España?",
    a: "Tenemos oficina en Barcelona (Carrer del Bruc 61, Eixample) y en Madrid (Calle de Génova 3), y producimos contenido para marcas de toda España. Para rodajes nos desplazamos desde la oficina más cercana y, para dirección creativa, edición y community management, trabajamos en remoto sin problema.",
  },
  {
    q: "¿Podéis grabar en Madrid?",
    a: "Sí. Desde nuestra oficina de Madrid (Génova 3) cubrimos rodajes en la ciudad y en toda la Comunidad de Madrid: local, producto, eventos y contenido con creadores. El mismo equipo y el mismo estándar de producción que en Barcelona.",
  },
  {
    q: "¿Cuál es la diferencia entre contratar una agencia y un freelance?",
    a: "Con una agencia tienes un equipo completo (dirección creativa, producción audiovisual y community) coordinado desde un único punto de contacto y con entregas constantes. Ganas consistencia, capacidad de producción y una visión de marca a largo plazo.",
  },
  {
    q: "¿Qué incluye el community management?",
    a: "Gestionamos la presencia diaria de tu marca en redes: calendario editorial, publicación, interacción con la comunidad y seguimiento de resultados. El objetivo es mantener la conversación activa y alineada con tu estrategia de contenido.",
  },
  {
    q: "¿En cuánto tiempo se ven resultados?",
    a: "Los primeros datos de alcance y engagement suelen verse en las primeras semanas, pero el crecimiento sólido de comunidad y marca es un trabajo continuo. Por eso medimos y optimizamos cada ciclo de contenido.",
  },
  {
    q: "¿Cuántos vídeos al mes produce Maen Studios para una marca?",
    a: "Lo habitual es entre 8 y 12 piezas mensuales, que es la cadencia con la que las redes premian la constancia. Ajustamos el volumen a tus objetivos y a tu presupuesto: hay marcas con 4 piezas al mes y otras con producción semanal continua.",
  },
  {
    q: "¿Hay permanencia o puedo cancelar cuando quiera?",
    a: "Trabajamos con ciclos mensuales sin ataduras innecesarias. Recomendamos un mínimo de tres meses porque es el tiempo en el que el contenido empieza a mostrar datos fiables, pero no te atamos a contratos largos.",
  },
];

/** Métricas del estudio. "Marcas" no se calcula desde app/clients.ts: la web
    enseña una selección, no el total con el que hemos trabajado. */
export const studioStats = [
  {
    label: "Marcas",
    value: "+100",
    note: "Restauración, moda, lifestyle, producto y tecnología.",
  },
  {
    label: "Comunidad",
    value: "+250k",
    note: "Seguidores acumulados de las cuentas que gestionamos.",
  },
  {
    label: "Oficinas",
    value: "02",
    note: "Barcelona y Madrid, con rodajes en toda España.",
  },
  {
    /* Sin contar los años: "cinco" se escribió en 2025 y ya iban seis.
       Con la fecha sola, el dato no caduca. */
    label: "Desde",
    value: "2020",
    note: "Produciendo contenido para marcas de forma continuada.",
  },
];

/** Formatos y plataformas: listas de capacidades al estilo editorial. */
export const capabilities = [
  {
    title: "Formatos que producimos",
    items: [
      "Reels y TikToks",
      "Spots cortos para campaña",
      "Piezas de producto",
      "Contenido UGC con creadores",
      "Motion graphics y grafismo",
      "Entrevistas y testimoniales",
      "Aftermovies de evento",
      "Fotografía para redes",
      "Carruseles y formatos estáticos",
    ],
  },
  {
    title: "Dónde se publica",
    items: [
      "Instagram",
      "TikTok",
      "YouTube y Shorts",
      "LinkedIn",
      "Meta y TikTok Ads",
      "Web y ecommerce",
      "Email y newsletters",
      "Pantallas en local",
      "Presentaciones y prensa",
    ],
  },
];

export const marqueeWords = [
  "Dirección Creativa",
  "Producción Audiovisual",
  "Community Management",
  "Campañas",
  "Social media",
  "Motion",
  "Contenido",
  "Stop the scroll",
];
