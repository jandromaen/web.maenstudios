/**
 * Landings de servicio y de sector.
 *
 * Complementan a las landings de ciudad de local-data.ts atacando búsquedas de
 * cola larga ("productora audiovisual Barcelona", "community manager Madrid")
 * donde hay mucha menos competencia que en el genérico "agencia de contenido".
 *
 * Regla: cada landing tiene texto propio y un ángulo distinto. Una landing que
 * repite lo que ya dice la de ciudad no posiciona, compite contra ella.
 */

export type ServiceLandingColumn = {
  title: string;
  items: string[];
};

export type ServiceLanding = {
  /** Ruta en la raíz, sin barra: la keyword va en la URL */
  slug: string;
  /** Ciudad, si la landing es local. Ata la ficha de oficina y el enlace cruzado */
  city?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** serviceType del schema Service */
  serviceType: string;
  eyebrow: string;
  h1: string;
  lead: string;
  intro: string[];
  blocks: { title: string; body: string }[];
  columnsEyebrow: string;
  columnsTitle: string;
  columns: ServiceLandingColumn[];
  statement: { before: string; after: string; sub: string };
  /**
   * Proceso de trabajo, si la landing lo explica. Es opcional a propósito: las
   * landings de ciudad se apoyan en el método genérico de /servicios, y las de
   * sector solo lo detallan cuando el proceso es parte de lo que se vende.
   */
  steps?: { n: string; title: string; desc: string }[];
  /** Palabras del marquee: sectores o formatos, según la landing */
  marquee: string[];
  clientSlugs: string[];
  clientsTitle: string;
  clientsIntro: string;
  faqs: { q: string; a: string }[];
  formTitle: string;
};

export const serviceLandings: ServiceLanding[] = [
  {
    slug: "productora-audiovisual-barcelona",
    city: "Barcelona",
    metaTitle: "Productora audiovisual en Barcelona",
    metaDescription:
      "Productora audiovisual en Barcelona con oficina en Carrer del Bruc 61. Rodaje y edición de vídeo para marcas: spots, piezas de producto, vídeo corporativo, aftermovies y contenido para redes. Presupuesto cerrado en 24h.",
    keywords: [
      "productora audiovisual Barcelona",
      "productora de vídeo Barcelona",
      "empresa de vídeo Barcelona",
      "grabación de vídeo Barcelona",
      "vídeo corporativo Barcelona",
      "producción audiovisual Barcelona",
      "rodaje Barcelona",
    ],
    serviceType: "Producción audiovisual en Barcelona",
    eyebrow: "Barcelona · Producción audiovisual",
    h1: "Productora audiovisual en Barcelona",
    lead: "Rodamos y montamos el vídeo que tu marca necesita: del spot corto a la pieza de producto, del vídeo corporativo al aftermovie. Equipo propio, oficina en el Eixample y entregas listas para publicar.",
    intro: [
      "Maen Studios es una productora audiovisual con base en el Carrer del Bruc 61, en el Eixample de Barcelona. Llevamos desde 2020 grabando para marcas de la ciudad, y la mayor parte de nuestro trabajo sale de esta oficina: rodajes en local, en plató y en exteriores por toda el área metropolitana.",
      "No trabajamos por encargos sueltos y ya está. Lo habitual es que una jornada de rodaje bien planteada alimente semanas de publicaciones, así que planificamos la producción pensando en todo lo que se va a poder montar después, no solo en la pieza principal que nos has pedido.",
    ],
    blocks: [
      {
        title: "Un equipo, no una cadena de proveedores",
        body: "Dirección, cámara, sonido y edición salen del mismo estudio. Eso significa un solo interlocutor de principio a fin, un criterio visual que no cambia a mitad de proyecto y plazos que no dependen de encadenar tres empresas distintas. Si hay que ampliar el equipo para un rodaje mayor, lo ampliamos nosotros.",
      },
      {
        title: "Preproducción de verdad, no una llamada rápida",
        body: "Antes de encender una cámara cerramos guion, plan de rodaje, localizaciones y qué piezas van a salir de la jornada. Es lo que separa un día de grabación aprovechado de una carpeta de material que luego no se puede montar. Te llega el plan por escrito y lo validas antes de rodar.",
      },
      {
        title: "Rodaje en tu local sin cerrar el negocio",
        body: "Buena parte de lo que grabamos son restaurantes, tiendas y espacios que siguen abiertos mientras rodamos. Trabajamos con equipo ligero y un plan por horas para no interferir con el servicio: entramos, grabamos lo pactado y recogemos.",
      },
      {
        title: "Entrega adaptada a cada sitio donde se publica",
        body: "El mismo rodaje se monta en vertical para Reels y TikTok, en horizontal para web y YouTube, y en versiones cortas para campañas de pago. Entregamos cada formato con su ritmo y sus subtítulos, no un recorte automático del mismo archivo.",
      },
    ],
    columnsEyebrow: "Producción",
    columnsTitle: "Qué rodamos y dónde",
    columns: [
      {
        title: "Tipos de pieza",
        items: [
          "Spots cortos para campaña",
          "Reels, TikToks y Shorts",
          "Vídeo corporativo y de marca",
          "Piezas de producto y bodegón",
          "Entrevistas y testimoniales",
          "Aftermovies de evento",
          "Motion graphics y grafismo",
          "Fotografía de la misma sesión",
        ],
      },
      {
        title: "Dónde rodamos",
        items: [
          "Tu local o tus oficinas",
          "Eixample, Gràcia y Sarrià",
          "Ciutat Vella, el Born y el Raval",
          "Poblenou y Sant Martí",
          "Sants-Montjuïc y Les Corts",
          "Plató y espacios de alquiler",
          "Exteriores y localizaciones",
          "Hospitalet, Badalona y Sant Cugat",
        ],
      },
    ],
    statement: {
      before: "Se rueda una vez",
      after: "se publica meses",
      sub: "Una jornada bien planificada no da una pieza: da un banco de material del que salen semanas de contenido. Producir con esa cabeza es lo que baja el coste por vídeo.",
    },
    marquee: [
      "Spots",
      "Reels",
      "Vídeo corporativo",
      "Producto",
      "Aftermovies",
      "Motion",
      "Testimoniales",
      "Fotografía",
    ],
    clientSlugs: [
      "ultramarinos-marin",
      "mantis",
      "macala",
      "jansana",
    ],
    clientsTitle: "Marcas para las que hemos rodado en Barcelona",
    clientsIntro:
      "Restauración, moda, producto, interiorismo y tecnología. Cada caso enseña las piezas reales que salieron de sus rodajes.",
    faqs: [
      {
        q: "¿Cuánto cuesta un vídeo con una productora en Barcelona?",
        a: "Depende sobre todo de la jornada de rodaje y del montaje: no cuesta lo mismo una pieza de producto en plató que un día entero grabando en local con varias localizaciones. Trabajamos con presupuesto cerrado antes de empezar, y si necesitas contenido de forma continua sale más a cuenta un plan mensual que encargos sueltos.",
      },
      {
        q: "¿Cuánto se tarda desde el briefing hasta la entrega?",
        a: "Para una pieza estándar, entre dos y tres semanas: unos días de preproducción y guion, la jornada de rodaje y el montaje con una ronda de cambios incluida. Si hay urgencia real lo comprimimos, pero preferimos no recortar la preproducción, que es donde se decide si el rodaje sale bien.",
      },
      {
        q: "¿Incluís guion y dirección creativa o solo la grabación?",
        a: "Lo habitual es que hagamos el proceso completo: idea, guion, rodaje y montaje. Si ya tienes la idea cerrada o vienes con una agencia que lleva la creatividad, también entramos solo como productora y ejecutamos su plan.",
      },
      {
        q: "¿Podéis grabar fuera de Barcelona?",
        a: "Sí. Cubrimos toda Cataluña sin problema y también rodamos en Madrid desde nuestra segunda oficina, en Calle de Génova 3. Para rodajes en el resto de España presupuestamos el desplazamiento aparte.",
      },
      {
        q: "¿De quién son los derechos del material grabado?",
        a: "Las piezas finales son tuyas para usarlas en tus canales y en campañas de pago sin límite de tiempo. Los brutos del rodaje los conservamos nosotros; si los quieres, se pactan al cerrar el presupuesto.",
      },
    ],
    formTitle: "Cuéntanos qué necesitas rodar",
  },

  {
    slug: "agencia-de-reels-barcelona",
    city: "Barcelona",
    metaTitle: "Agencia de Reels y TikTok en Barcelona",
    metaDescription:
      "Agencia especializada en Reels y TikTok en Barcelona. Grabamos en tu local y entregamos de 8 a 12 piezas al mes listas para publicar, con gancho, ritmo y subtítulos. Oficina en el Eixample.",
    keywords: [
      "agencia de reels Barcelona",
      "grabar reels Barcelona",
      "agencia TikTok Barcelona",
      "hacer reels para empresas Barcelona",
      "vídeos para Instagram Barcelona",
      "agencia contenido vertical Barcelona",
    ],
    serviceType: "Producción de Reels y TikToks en Barcelona",
    eyebrow: "Barcelona · Reels y TikTok",
    h1: "Agencia de Reels y TikTok en Barcelona",
    lead: "Vídeo vertical, en volumen y con criterio. Vamos a tu local, grabamos una jornada y te entregamos las piezas del mes montadas, subtituladas y listas para publicar.",
    intro: [
      "El vertical no es un formato más pequeño: es otro lenguaje. Los tres primeros segundos deciden si alguien se queda, el montaje va al doble de ritmo y el sonido manda tanto como la imagen. Producimos Reels y TikToks todos los días y ese oficio es lo que estás contratando.",
      "Trabajamos desde el Carrer del Bruc 61, en el Eixample, y grabamos por toda Barcelona. La mayoría de nuestros clientes son negocios con local abierto —restauración, moda y retail— que necesitan publicar de forma constante sin montarse un equipo interno.",
    ],
    blocks: [
      {
        title: "Una jornada de rodaje, el contenido de un mes",
        body: "No vamos a grabar un Reel. Vamos con un plan de piezas y salimos con el material de todas: producto, ambiente, equipo, proceso y los recursos que dan juego para montar más adelante. Es lo que permite mantener 8 o 12 publicaciones al mes sin volver a rodar cada semana.",
      },
      {
        title: "El gancho se trabaja, no se improvisa",
        body: "Cada pieza sale con su primer plano pensado: qué se ve en el segundo cero, qué frase entra, qué promesa se hace. Es la parte que más movemos entre versiones, porque es la que decide el alcance. Lo demás —ritmo, corte, música— viene después.",
      },
      {
        title: "Subtítulos, formato y ficha lista para publicar",
        body: "Entregamos cada pieza subtitulada, en 9:16, con el audio nivelado y una propuesta de copy y hashtags. Puedes publicarla tal cual desde el móvil. Si prefieres que publiquemos nosotros, eso entra en el plan de community management.",
      },
      {
        title: "Se mide y se corrige cada mes",
        body: "Revisamos qué piezas retuvieron y cuáles se cayeron a los dos segundos, y ajustamos el plan del mes siguiente. El formato que funciona para tu cuenta no siempre es el que funciona para el sector, y eso solo se sabe mirando tus datos.",
      },
    ],
    columnsEyebrow: "Cómo trabajamos",
    columnsTitle: "Qué entra en un plan mensual",
    columns: [
      {
        title: "Lo que recibes cada mes",
        items: [
          "De 8 a 12 piezas verticales",
          "Una jornada de rodaje en tu local",
          "Guion y gancho pieza a pieza",
          "Edición, ritmo y sonido",
          "Subtítulos incrustados",
          "Copy y hashtags propuestos",
          "Versiones para Reels, TikTok y Shorts",
          "Revisión de resultados del mes",
        ],
      },
      {
        title: "Formatos que mejor funcionan",
        items: [
          "Producto en movimiento",
          "Proceso y cocina en directo",
          "Antes y después",
          "Recomendaciones a cámara",
          "Contenido con el equipo del local",
          "UGC con creadores",
          "Trends adaptados a la marca",
          "Piezas para campañas de pago",
        ],
      },
    ],
    statement: {
      before: "Publicar mucho no basta",
      after: "hay que parar el scroll",
      sub: "La constancia solo sirve si cada pieza aguanta los tres primeros segundos. Trabajamos el gancho y el ritmo antes que el volumen.",
    },
    marquee: [
      "Reels",
      "TikTok",
      "Shorts",
      "Vertical",
      "Gancho",
      "Ritmo",
      "Subtítulos",
      "Stop the scroll",
    ],
    clientSlugs: [
      "focacha",
      "perritos-calientes",
      "fortuna-tonino",
      "canallita",
      "macala",
      "b-de-bocata",
    ],
    clientsTitle: "Cuentas que alimentamos con vertical cada mes",
    clientsIntro:
      "Locales y marcas de Barcelona que publican de forma continua con piezas producidas por nosotros. Entra en cada caso para ver los Reels reales.",
    faqs: [
      {
        q: "¿Cuánto cuesta un Reel en Barcelona?",
        a: "Suelto y bien producido, un Reel raramente baja de las tres cifras, porque incluye guion, rodaje y montaje. Por eso casi todos nuestros clientes van a plan mensual: al agrupar las piezas en una sola jornada de rodaje, el coste por vídeo baja mucho respecto a encargarlos uno a uno.",
      },
      {
        q: "¿Cuántos Reels al mes debería publicar mi negocio?",
        a: "Entre 8 y 12 es la horquilla en la que vemos que el algoritmo empieza a premiar la constancia sin que la calidad se resienta. Menos de cuatro al mes cuesta que arranque; más de quince solo tiene sentido si tienes material y equipo para sostenerlo.",
      },
      {
        q: "¿Tengo que salir yo a cámara?",
        a: "No es obligatorio. Funciona muy bien cuando el dueño o el equipo salen, porque da cara y confianza, pero tenemos clientes cuyo contenido es solo producto, proceso y ambiente. Si quieres cara sin poner la tuya, montamos las piezas con creadores UGC.",
      },
      {
        q: "¿Vosotros publicáis o solo entregáis las piezas?",
        a: "Como quieras. En el plan de producción te entregamos todo listo y publicas tú. Si contratas también community management, nos encargamos del calendario, de publicar y de responder comentarios y mensajes.",
      },
      {
        q: "¿En cuánto tiempo se notan los resultados?",
        a: "Los datos de alcance y retención se ven desde las primeras semanas, y sirven para corregir rápido. El crecimiento sólido de comunidad y su efecto en reservas o ventas es un trabajo de meses: por eso recomendamos empezar con un mínimo de tres.",
      },
    ],
    formTitle: "Pide tu plan de Reels",
  },

  {
    slug: "community-manager-madrid",
    city: "Madrid",
    metaTitle: "Community manager en Madrid para marcas y negocios",
    metaDescription:
      "Servicio de community manager en Madrid: calendario editorial, publicación diaria, respuesta a comentarios y mensajes, y reporte mensual. Oficina en Calle de Génova 3. Equipo, no un freelance suelto.",
    keywords: [
      "community manager Madrid",
      "gestión redes sociales Madrid",
      "agencia social media Madrid",
      "llevar redes sociales empresa Madrid",
      "community manager para restaurantes Madrid",
      "externalizar redes sociales Madrid",
    ],
    serviceType: "Community management en Madrid",
    eyebrow: "Madrid · Community management",
    h1: "Community manager en Madrid para marcas y negocios",
    lead: "Nos hacemos cargo del día a día de tus redes: calendario, publicación, conversación con tu comunidad y un reporte mensual que se entiende. Oficina en Calle de Génova 3.",
    intro: [
      "Externalizar las redes suele fallar por lo mismo: se contrata a alguien que publica, pero nadie decide qué se cuenta ni responde cuando llega un mensaje un sábado por la noche. Nuestro servicio de community management cubre las dos cosas, con un equipo detrás y un único interlocutor para ti.",
      "Desde nuestra oficina de Génova 3 llevamos cuentas de marcas y locales de Madrid. Estamos a minutos de Chamberí, Salamanca, Chueca y Malasaña, así que cuando hace falta grabar algo o pasarse por el local, nos pasamos.",
    ],
    blocks: [
      {
        title: "Calendario editorial antes de publicar nada",
        body: "Cada mes cerramos qué se publica, qué día y con qué objetivo: producto, novedades, temporada, eventos de la ciudad y las fechas que mueven tu sector. Lo ves y lo apruebas antes de que salga nada. Se acabó el improvisar el post a las once de la noche.",
      },
      {
        title: "Responder también es el trabajo",
        body: "Comentarios, mensajes directos, menciones y reseñas. Contestamos con el tono de la marca y en un plazo razonable, y te escalamos lo que requiere tu decisión: una queja seria, una propuesta de colaboración, un pedido grande. La conversación es donde se convierte, no en el post.",
      },
      {
        title: "Contenido y gestión en el mismo sitio",
        body: "Somos productora además de agencia, así que el calendario no depende de que tú nos mandes fotos. Si el plan pide piezas nuevas, las grabamos nosotros en tu local. Es la diferencia entre un calendario que se cumple y uno que se queda a medias por falta de material.",
      },
      {
        title: "Un reporte que dice algo",
        body: "Cada mes recibes qué se publicó, qué funcionó, qué no y qué vamos a cambiar. Alcance y seguidores están, pero lo que miramos de verdad es retención, guardados, mensajes recibidos y clics: las señales que tienen relación con que entre gente por la puerta.",
      },
    ],
    columnsEyebrow: "El servicio",
    columnsTitle: "Qué incluye y a quién atendemos",
    columns: [
      {
        title: "Qué incluye cada mes",
        items: [
          "Calendario editorial aprobado por ti",
          "Publicación en Instagram y TikTok",
          "Stories y contenido de día a día",
          "Respuesta a comentarios y mensajes",
          "Gestión de menciones y reseñas",
          "Copys y hashtags de cada pieza",
          "Coordinación con el rodaje mensual",
          "Reporte de resultados y ajustes",
        ],
      },
      {
        title: "Zonas y perfiles con los que trabajamos",
        items: [
          "Chamberí y Salamanca",
          "Chueca, Justicia y Malasaña",
          "Centro y Retiro",
          "Chamartín y Moncloa-Aravaca",
          "Alcobendas, Pozuelo y Las Rozas",
          "Restauración y ocio",
          "Moda, retail y ecommerce",
          "Servicios profesionales y startups",
        ],
      },
    ],
    statement: {
      before: "Las redes no se llevan solas",
      after: "se llevan a diario",
      sub: "Publicar es la parte visible. Lo que sostiene una cuenta es el calendario, la respuesta rápida y corregir cada mes con datos delante.",
    },
    marquee: [
      "Calendario",
      "Publicación",
      "Comunidad",
      "Stories",
      "Reseñas",
      "Reporte",
      "Instagram",
      "TikTok",
    ],
    clientSlugs: [
      "burmet",
      "macala",
      "canallita",
      "jansana",
      "aluxe",
    ],
    clientsTitle: "Cuentas que gestionamos a diario",
    clientsIntro:
      "Marcas cuyo día a día en redes llevamos nosotros: calendario, publicación y conversación. Burmet es nuestro cliente con local en Madrid.",
    faqs: [
      {
        q: "¿Cuánto cuesta un community manager en Madrid?",
        a: "Un freelance por horas es la opción más barata y la que más se cae cuando hay volumen. Nuestros planes incluyen equipo, calendario, gestión diaria y producción de contenido, y se ajustan al número de canales y a la frecuencia de publicación. Te preparamos un presupuesto cerrado sin compromiso.",
      },
      {
        q: "¿Qué diferencia hay entre contrataros a vosotros y a un freelance?",
        a: "Con un freelance dependes de una persona: sus vacaciones, su carga de trabajo y su criterio. Con nosotros hay un equipo detrás —dirección creativa, producción y gestión— y un único interlocutor. Además el contenido lo grabamos nosotros, así que el calendario no se queda sin material.",
      },
      {
        q: "¿Gestionáis también los comentarios y los mensajes privados?",
        a: "Sí, entra en el servicio. Respondemos con el tono de la marca y te pasamos lo que necesita tu decisión: quejas serias, propuestas de colaboración o consultas comerciales que no nos corresponde cerrar a nosotros.",
      },
      {
        q: "¿Qué redes lleváis?",
        a: "Instagram y TikTok son el núcleo de casi todos los planes. Añadimos YouTube o LinkedIn cuando tienen sentido para el negocio; no recomendamos abrir canales que luego nadie va a sostener.",
      },
      {
        q: "¿Hay permanencia?",
        a: "Trabajamos por ciclos mensuales sin ataduras largas. Recomendamos un mínimo de tres meses porque antes no hay datos fiables sobre los que decidir, pero no te atamos a un contrato anual.",
      },
    ],
    formTitle: "Hablemos de tus redes en Madrid",
  },

  {
    slug: "agencia-de-contenido-para-restaurantes",
    metaTitle: "Agencia de contenido para restaurantes y hostelería",
    metaDescription:
      "Agencia de contenido especializada en restaurantes, bares y coctelerías. Grabamos en tu local sin cortar el servicio y llenamos tus redes de Reels que traen reservas. Barcelona y Madrid.",
    keywords: [
      "agencia de contenido para restaurantes",
      "marketing para restaurantes redes sociales",
      "reels para restaurantes",
      "community manager para restaurantes",
      "fotografía y vídeo gastronómico",
      "redes sociales para bares",
      "contenido para hostelería",
    ],
    serviceType: "Creación de contenido para restaurantes y hostelería",
    eyebrow: "Hostelería",
    h1: "Agencia de contenido para restaurantes y hostelería",
    lead: "La hostelería es nuestro sector fuerte. Grabamos en tu local sin cortar el servicio y convertimos tu carta, tu cocina y tu ambiente en contenido que llena mesas.",
    intro: [
      "Más de la mitad de nuestro portfolio son bares, restaurantes y coctelerías. Ese oficio se nota en cosas concretas: sabemos rodar en una cocina en plena hora punta, sabemos que la luz del local a las ocho de la tarde no es la de las cuatro, y sabemos qué plato se graba bien y cuál nunca sale como en la mesa.",
      "Trabajamos desde Barcelona y Madrid, y producimos para locales de toda España. El objetivo no es acumular seguidores: es que alguien que está decidiendo dónde cenar esta noche acabe en tu local en vez de en el de al lado.",
    ],
    blocks: [
      {
        title: "Rodamos con el local abierto",
        body: "No te pedimos cerrar ni bloquear la sala. Vamos con equipo ligero, un plan por horas y las localizaciones ya decididas. Grabamos en los huecos del servicio y en el montaje previo, y coordinamos con cocina lo que haya que emplatar para cámara.",
      },
      {
        title: "El plato, el ambiente y la gente",
        body: "Un local no se vende solo con planos de comida. Funciona la mezcla: el producto en movimiento, el proceso en cocina, la barra llena un viernes y el equipo que atiende. Esa combinación es la que transmite cómo se siente estar ahí, que es lo que decide la reserva.",
      },
      {
        title: "Contenido atado a tu temporada",
        body: "Cambio de carta, menú del día, festivos, terraza en verano, Navidad, eventos del barrio. El calendario se monta sobre lo que de verdad pasa en tu negocio, no sobre un plan genérico de marketing que vale igual para una peluquería.",
      },
      {
        title: "Reseñas y mensajes también cuentan",
        body: "En hostelería, la conversación es media venta: mensajes preguntando por reservas, alérgenos o eventos privados, y reseñas que hay que responder. Si contratas community management, eso lo llevamos con el tono del local y te escalamos lo que requiere tu decisión.",
      },
    ],
    columnsEyebrow: "Cobertura",
    columnsTitle: "Qué producimos y para qué tipo de local",
    columns: [
      {
        title: "Contenido que funciona en hostelería",
        items: [
          "Reels de plato y producto",
          "Proceso de cocina y barra",
          "Ambiente de sala en servicio",
          "Presentación de carta nueva",
          "Coctelería y elaboraciones",
          "Contenido con el equipo del local",
          "Fotografía de carta y web",
          "UGC con creadores gastronómicos",
        ],
      },
      {
        title: "Tipos de local con los que trabajamos",
        items: [
          "Restaurantes de carta y menú",
          "Bares y bocaterías",
          "Coctelerías y ocio nocturno",
          "Cafeterías y obradores",
          "Pizzerías y pasta bar",
          "Asadores y brasa",
          "Grupos con varios locales",
          "Aperturas y nuevos conceptos",
        ],
      },
    ],
    statement: {
      before: "No se come con los ojos",
      after: "se reserva con ellos",
      sub: "Quien decide dónde cenar esta noche lo hace mirando el móvil. Si tu local no está bien contado ahí, no entra en la comparación.",
    },
    marquee: [
      "Restaurantes",
      "Bares",
      "Coctelerías",
      "Brasa",
      "Pasta",
      "Bocatería",
      "Obrador",
      "Aperturas",
    ],
    clientSlugs: [
      "ultramarinos-marin",
      "mantis",
      "tram-tram",
      "focacha",
      "burmet",
      "perritos-calientes",
      "b-de-bocata",
      "macchina",
    ],
    clientsTitle: "Locales que ya trabajan con nosotros",
    clientsIntro:
      "Bares, restaurantes y coctelerías de Barcelona y Madrid. Entra en cada caso para ver el contenido real que producimos para ellos.",
    faqs: [
      {
        q: "¿Cuánto cuesta llevar las redes de un restaurante?",
        a: "Depende de si quieres solo producción de contenido o también la gestión diaria. Lo más habitual en hostelería es un plan mensual con una jornada de rodaje en el local y de 8 a 12 piezas al mes. Te preparamos un presupuesto cerrado según el tipo de local y la frecuencia.",
      },
      {
        q: "¿Tenemos que cerrar el local para grabar?",
        a: "No. Rodamos con el negocio abierto: equipo ligero, plan por horas y coordinación con cocina y sala. Solemos aprovechar el montaje previo al servicio y los huecos entre turnos.",
      },
      {
        q: "¿El contenido sirve para traer reservas o solo seguidores?",
        a: "El objetivo del plan es lo primero. Por eso trabajamos formatos que enseñan producto y ambiente, cuidamos que el perfil tenga claro dónde estás y cómo reservar, y miramos guardados, mensajes y clics además del alcance.",
      },
      {
        q: "¿Trabajáis con grupos de varios locales?",
        a: "Sí. En ese caso montamos una línea común de marca y calendarios separados por local, con rodajes agrupados para que salga más eficiente que contratar cada local por su cuenta.",
      },
      {
        q: "¿En qué ciudades grabáis?",
        a: "Tenemos oficina en Barcelona (Carrer del Bruc 61) y en Madrid (Calle de Génova 3), y cubrimos ambas áreas metropolitanas. Para locales en otras ciudades presupuestamos el desplazamiento aparte.",
      },
      {
        q: "¿Hacéis también fotografía para la carta y la web?",
        a: "Sí, y lo recomendamos: se saca en la misma jornada de rodaje, así que aprovechas el montaje de luces y el trabajo de cocina para llevarte también las fotos de carta, web y plataformas de reserva.",
      },
    ],
    formTitle: "Cuéntanos cómo es tu local",
  },
  {
    slug: "creacion-de-contenido-gastronomico",
    metaTitle: "Creación de contenido gastronómico: foto y vídeo",
    metaDescription:
      "Creación de contenido gastronómico en Barcelona y Madrid: fotografía de producto y plato, vídeo y Reels para restaurantes, obradores y marcas de comida. Foto y vídeo de la misma sesión. Presupuesto en 24h.",
    keywords: [
      "creación de contenido gastronómico",
      "contenido gastronómico",
      "fotografía gastronómica",
      "fotografía gastronómica Barcelona",
      "fotografía gastronómica Madrid",
      "vídeo gastronómico",
      "fotografía de producto alimentación",
      "contenido audiovisual para restaurantes",
      "food styling",
      "contenido para marcas de comida",
      "fotografía de carta",
    ],
    serviceType: "Creación de contenido gastronómico: fotografía y vídeo de comida",
    eyebrow: "Gastronomía · Foto y vídeo",
    h1: "Creación de contenido gastronómico",
    lead: "Fotografía y vídeo de comida para restaurantes, obradores y marcas de alimentación. Producimos plato, producto y proceso en una sola sesión, y te lo entregamos listo para redes, carta, web y ecommerce.",
    intro: [
      "La comida es el producto más difícil de grabar bien y el que peor aguanta la improvisación: el brillo se apaga, el helado se derrite, la pasta se seca y el pan pierde el vapor en dos minutos. Por eso el contenido gastronómico no es fotografía de producto con un plato delante, es un oficio propio, con su forma de iluminar, su ritmo de trabajo con cocina y sus trucos para que lo que sale en pantalla se parezca a lo que llega a la mesa.",
      "En Maen Studios llevamos desde 2020 produciendo contenido de comida, y hoy es la especialidad de la casa: más de la mitad de nuestro portfolio es gastronomía. Trabajamos desde Barcelona y Madrid para restaurantes, bares, obradores y marcas de alimentación, con rodajes en toda España.",
    ],
    blocks: [
      {
        title: "Qué producimos: foto y vídeo de la misma sesión",
        body: "Montamos las luces una vez y nos llevamos las dos cosas. En una jornada salen los vídeos verticales para Reels y TikTok, los planos de proceso y ambiente, y la fotografía fija de cada plato para la carta, la web y las plataformas de reserva o delivery. Separar la foto y el vídeo en dos días duplica el coste y, sobre todo, duplica el trabajo que le pides a tu cocina.",
      },
      {
        title: "Para quién trabajamos",
        body: "Restaurantes y bares que necesitan alimentar sus redes y renovar la carta; obradores, panaderías y pastelerías con producto que entra por los ojos; marcas de alimentación y bebidas que venden en tienda o en ecommerce y necesitan bodegón, packaging y contenido social; y grupos con varios locales que quieren una línea visual común. Si lo que buscas es que además gestionemos la cuenta día a día, eso lo cubre nuestra agencia de contenido para restaurantes.",
      },
      {
        title: "Food styling sin trampas",
        body: "No usamos pegamento ni laca: lo que sale en la foto es un plato que se puede comer. Lo que sí hacemos es trabajar con cocina el emplatado para cámara, tener dobles preparados de lo que se estropea rápido y rodar en el orden correcto, empezando por lo que menos aguanta. Un cliente que pide lo que vio en la foto y recibe otra cosa es una reseña mala, no una venta.",
      },
      {
        title: "Por qué elegirnos",
        body: "Porque es nuestro sector, no un encargo suelto: sabemos rodar en una cocina en plena hora punta, sabemos que la luz de un local a las ocho de la tarde no es la de las cuatro y sabemos qué plato nunca sale bien en cámara antes de citar al equipo. Dirección, cámara, estilismo y edición salen del mismo estudio, así que tienes un solo interlocutor y un criterio visual que no cambia a mitad de proyecto.",
      },
      {
        title: "Dónde trabajamos: Barcelona, Madrid y toda España",
        body: "Tenemos oficina en Barcelona, en el Carrer del Bruc 61 (Eixample), y en Madrid, en la Calle de Génova 3 (Chamberí-Justicia), y cubrimos las dos áreas metropolitanas sin coste de desplazamiento. Para producciones fuera de esas zonas presupuestamos el viaje aparte, y en marcas de producto solemos resolverlo rodando en nuestro espacio con el producto enviado.",
      },
    ],
    steps: [
      {
        n: "01",
        title: "Briefing y selección",
        desc: "Vemos tu carta o tu catálogo y elegimos qué se graba: lo que más margen deja, lo que mejor funciona en cámara y lo que quieres empujar esta temporada.",
      },
      {
        n: "02",
        title: "Preproducción",
        desc: "Cerramos guion de planos, atrezo, vajilla y horario. Cocina recibe por escrito qué tiene que emplatar y a qué hora, para que el día del rodaje nadie improvise.",
      },
      {
        n: "03",
        title: "Sesión de foto y vídeo",
        desc: "Una jornada en tu local o en plató, con el negocio abierto si hace falta. Equipo ligero, plan por horas y rodaje en el orden que exige cada plato.",
      },
      {
        n: "04",
        title: "Edición y entrega",
        desc: "Montaje, color y subtítulos. Recibes el vertical para redes, el horizontal para web y las fotos retocadas en los formatos de carta, web y delivery.",
      },
    ],
    columnsEyebrow: "Capacidades",
    columnsTitle: "Tipos de contenido y tipos de cliente",
    columns: [
      {
        title: "Qué producimos",
        items: [
          "Fotografía de plato y carta",
          "Fotografía de producto y bodegón",
          "Reels y TikToks de comida",
          "Vídeo de proceso y cocina",
          "Ambiente de sala y barra",
          "Packaging y producto para ecommerce",
          "Fotografía de equipo y local",
          "UGC con creadores gastronómicos",
        ],
      },
      {
        title: "Para quién",
        items: [
          "Restaurantes de carta y menú",
          "Bares, bodegas y coctelerías",
          "Obradores, panaderías y pastelerías",
          "Marcas de alimentación y bebidas",
          "Food trucks y delivery",
          "Grupos con varios locales",
          "Aperturas y nuevos conceptos",
          "Ferias y eventos gastronómicos",
        ],
      },
    ],
    statement: {
      before: "La foto no vende el plato",
      after: "vende las ganas",
      sub: "Nadie guarda un Reel porque la comida esté enfocada. Lo guarda porque le entra hambre. Ese es el único listón que le ponemos a cada pieza que entregamos.",
    },
    marquee: [
      "Plato",
      "Producto",
      "Bodegón",
      "Proceso",
      "Carta",
      "Reels",
      "Packaging",
      "Food styling",
    ],
    clientSlugs: [
      "jansana",
      "gastroconnect",
      "hijos-de-javier",
      "ultrapaninos-marin",
      "macchina",
    ],
    clientsTitle: "Contenido gastronómico que hemos producido",
    clientsIntro:
      "De marcas de alimentación a bodegas de barrio y pasta bars. Entra en cada caso para ver las piezas reales que salieron de sus sesiones.",
    faqs: [
      {
        q: "¿Cuánto cuesta una sesión de contenido gastronómico?",
        a: "Depende de cuántos platos entren, de si es una sesión suelta o un plan mensual y de si quieres solo fotografía o foto y vídeo. Lo habitual es cerrar una jornada con un número pactado de platos y llevarse las dos cosas, que sale bastante mejor que contratarlas por separado. Cuéntanos tu carta y te pasamos un presupuesto cerrado en 24h.",
      },
      {
        q: "¿Tenemos que cerrar el restaurante para grabar?",
        a: "No. Rodamos con el local abierto: equipo ligero, plan por horas y coordinación previa con cocina. Solemos aprovechar el montaje antes del servicio y los huecos entre turnos, y las fotos de sala se hacen cuando la luz acompaña.",
      },
      {
        q: "¿Cuántos platos se pueden fotografiar en una jornada?",
        a: "Con la preproducción hecha y cocina avisada, una jornada da de sobra para la carta de un restaurante medio, y aun así entran los planos de proceso y ambiente. Lo que marca el ritmo no es el número de platos, es cuántos montajes de luz distintos necesitan.",
      },
      {
        q: "¿Las fotos sirven también para la carta, la web y el delivery?",
        a: "Sí, y las entregamos ya adaptadas. Cada plataforma pide su proporción y su peso: Glovo y Just Eat no admiten lo mismo que tu web ni que un Reel. Te llega cada archivo en el formato que le toca, no un recorte automático del mismo original.",
      },
      {
        q: "¿Trabajáis con marcas de alimentación, no solo con restaurantes?",
        a: "Sí. Con marcas de producto solemos rodar bodegón, packaging y piezas sociales, y en muchos casos ni hace falta que te muevas: nos envías el producto y lo producimos nosotros. Jansana es un ejemplo del portfolio.",
      },
      {
        q: "¿En qué ciudades trabajáis?",
        a: "Tenemos oficina en Barcelona (Carrer del Bruc 61) y en Madrid (Calle de Génova 3), y cubrimos las dos áreas metropolitanas. Producimos en toda España presupuestando el desplazamiento aparte.",
      },
    ],
    formTitle: "Cuéntanos qué tienes que grabar",
  },
  {
    slug: "contenido-moda",
    metaTitle: "Creación de contenido de moda: campaña y lookbook",
    metaDescription:
      "Creación de contenido de moda en Barcelona y Madrid: campañas de temporada, lookbooks, fotografía de ecommerce y Reels para marcas de ropa, streetwear y accesorios. Presupuesto cerrado en 24h.",
    keywords: [
      "creación de contenido de moda",
      "contenido para marcas de moda",
      "fotografía de moda Barcelona",
      "fotografía de moda Madrid",
      "lookbook marca de ropa",
      "campaña de moda",
      "fotografía de ecommerce de ropa",
      "vídeo para marcas de moda",
      "reels marca de ropa",
      "producción de moda Barcelona",
      "contenido para streetwear",
    ],
    serviceType: "Creación de contenido de moda: campaña, lookbook y ecommerce",
    eyebrow: "Moda · Campaña y lookbook",
    h1: "Creación de contenido de moda",
    lead: "Campañas de temporada, lookbooks, fotografía de ecommerce y vídeo para marcas de ropa, calzado y accesorios. Una sola producción de la que sale todo lo que necesitas publicar y vender.",
    intro: [
      "Una marca de ropa necesita dos cosas que casi se contradicen. Por un lado, imágenes de ecommerce fieles, limpias y homogéneas, donde la prenda se vea tal cual va a llegar a casa. Por otro, campañas que generen ganas: contexto, cuerpo, actitud y una idea detrás. Producir cada cosa por su lado sale caro y, sobre todo, acaba dando dos marcas distintas: la del catálogo y la del Instagram.",
      "Nosotros lo planteamos como una sola producción por temporada. De las mismas jornadas salen el lookbook, las piezas de campaña, el vertical para Reels y TikTok y las fotos de ficha de producto. Trabajamos desde Barcelona y Madrid con marcas de moda, streetwear y lifestyle —Macala, Canallita o Aluxe están en el portfolio— y producimos en toda España.",
    ],
    blocks: [
      {
        title: "Qué producimos: campaña, lookbook y ecommerce",
        body: "La campaña es la imagen con la que abres temporada y la que sostiene la publicidad. El lookbook enseña la colección completa y ordenada, prenda a prenda y en combinaciones que se pueden comprar juntas. Y la ficha de producto es la que cierra la venta. Las tres salen del mismo bloque de producción, con la misma dirección de arte, para que tu marca se reconozca igual en una valla, en un Reel y en la página de pago.",
      },
      {
        title: "Para quién trabajamos",
        body: "Marcas de ropa con tienda física, ecommerce o las dos cosas; proyectos de streetwear que viven de los lanzamientos; calzado, accesorios y joyería, donde el detalle manda; concept stores que representan varias marcas; y proyectos que están preparando su primera colección y necesitan estrenar con imagen propia desde el día uno.",
      },
      {
        title: "La ficha de producto también es contenido",
        body: "La foto de ecommerce es la que más se mira y la que peor se suele cuidar. Una prenda mal representada no solo vende menos: vende y vuelve. El color que no corresponde, la caída que no se aprecia o la talla que no se entiende acaban en devoluciones, que en moda es donde se come el margen. Por eso tratamos la ficha con el mismo criterio que la campaña, y no como el descarte de la sesión.",
      },
      {
        title: "Se produce por temporada, no por encargo suelto",
        body: "La moda vive de picos: cambio de temporada, drops, rebajas, campaña de Navidad. El error habitual es empezar a producir cuando el pico ya está encima. Trabajamos con tu calendario comercial por delante, de forma que el material esté montado y aprobado antes de que abra la ventana de venta, y quede banco de imágenes para sostener las semanas valle que vienen después.",
      },
      {
        title: "Por qué una marca de moda nos elige",
        body: "Casi todos los proveedores del sector vienen de un lado o del otro. El estudio de catálogo resuelve volumen pero no aporta mirada, y el fotógrafo de editorial te entrega una imagen preciosa y el ecommerce sin resolver. Nosotros producimos las dos cosas en el mismo bloque y con el mismo equipo, que es justo lo que necesita una marca que vende online y además tiene que publicar cada semana. La dirección de arte no se subcontrata: es nuestra de principio a fin.",
      },
      {
        title: "Dónde producimos: Barcelona, Madrid y envío de colección",
        body: "En moda hay una ventaja que otros sectores no tienen: no siempre hace falta que viaje el equipo, basta con que viaje la ropa. Con marcas de fuera lo más habitual, y lo más barato, es que nos envíes la colección y la produzcamos aquí. Cuando la campaña pide una localización concreta, nos desplazamos y lo presupuestamos aparte. Las oficinas están en el Carrer del Bruc 61 de Barcelona y en la Calle de Génova 3 de Madrid, y en esas dos áreas metropolitanas no cobramos desplazamiento.",
      },
    ],
    steps: [
      {
        n: "01",
        title: "Concepto de temporada",
        desc: "Vemos la colección y tu calendario comercial, y cerramos la idea: qué cuenta la campaña, qué prendas la lideran y qué hace falta para el ecommerce.",
      },
      {
        n: "02",
        title: "Preproducción",
        desc: "Selección de prendas, referencias visuales, estilismo, localización y plan de horas. Te llega por escrito y lo apruebas antes de que nadie se mueva.",
      },
      {
        n: "03",
        title: "Sesión",
        desc: "Rodamos campaña, lookbook y ficha de producto en el mismo bloque, en foto y en vídeo, aprovechando cada montaje de luz al máximo.",
      },
      {
        n: "04",
        title: "Retoque y entrega",
        desc: "Retoque, color y montaje. Recibes cada archivo en el formato de su canal: vertical para redes, horizontal para web y ficha en las medidas de tu tienda online.",
      },
    ],
    columnsEyebrow: "Capacidades",
    columnsTitle: "Tipos de contenido y tipos de marca",
    columns: [
      {
        title: "Qué producimos",
        items: [
          "Campañas de temporada",
          "Lookbooks de colección",
          "Casting y estilismo",
          "Ficha, packshot y maniquí invisible",
          "Bodegón de prenda y accesorio",
          "Reels y TikToks de moda",
          "Vídeo de campaña y teaser de drop",
          "Contenido de tienda y equipo",
          "UGC con creadores de moda",
        ],
      },
      {
        title: "Para quién",
        items: [
          "Marcas de ropa y calzado",
          "Streetwear y marcas de drops",
          "Ecommerce de moda",
          "Tiendas y concept stores",
          "Accesorios y joyería",
          "Moda sostenible y producción local",
          "Primeras colecciones y lanzamientos",
          "Showrooms y ferias",
        ],
      },
    ],
    statement: {
      before: "Una prenda se vende dos veces",
      after: "en la campaña y en la ficha",
      sub: "La campaña crea el deseo y la ficha de producto cierra la compra. Si no salen de la misma producción, tu marca acaba teniendo dos caras y el cliente nota cuál de las dos es la de verdad.",
    },
    marquee: [
      "Campaña",
      "Lookbook",
      "Ecommerce",
      "Streetwear",
      "Editorial",
      "Drops",
      "UGC",
      "Retoque",
    ],
    clientSlugs: [
      "canallita",
      "macala",
      "aluxe",
      "pigili-originals",
      "mimosas",
    ],
    clientsTitle: "Marcas de moda y lifestyle con las que trabajamos",
    clientsIntro:
      "Moda masculina, calzado hecho en España, streetwear y marcas lifestyle. Entra en cada caso para ver las piezas reales que producimos para ellas.",
    faqs: [
      {
        q: "¿Cuánto cuesta una sesión de campaña o de lookbook?",
        a: "Depende del número de prendas, de si hace falta modelo y localización, y de si te llevas solo fotografía o foto y vídeo. Lo que más mueve el presupuesto no son las horas de cámara, son los montajes de luz distintos que pide la colección. Cuéntanos qué tienes que sacar esta temporada y te pasamos un presupuesto cerrado en 24h.",
      },
      {
        q: "¿Ponéis vosotros modelos, estilismo y localización?",
        a: "Sí, las tres cosas. El casting y el estilismo los llevamos nosotros: te proponemos perfiles que encajen con la marca y preparamos el estilismo de cada look antes de la sesión, no sobre la marcha. La localización la cerramos contigo en preproducción. Así el día del rodaje no se decide nada, solo se ejecuta lo que ya está aprobado.",
      },
      {
        q: "¿Cuántas prendas entran en una jornada?",
        a: "Con la selección hecha y las prendas preparadas por adelantado, una jornada cunde mucho más de lo que suele pensarse. Lo que marca el ritmo es cuántos cambios de luz, de modelo o de localización pide la colección: veinte prendas con el mismo montaje salen antes que seis repartidas en tres escenarios.",
      },
      {
        q: "¿Hacéis también las fotos de ficha para el ecommerce?",
        a: "Sí, y lo recomendamos sacarlo en la misma producción que la campaña: aprovechas el estilismo, el planchado y la prenda ya preparada. Hacemos ficha con modelo, packshot sobre fondo blanco de catálogo y maniquí invisible, que es la que enseña la caída y el interior de la prenda sin cuerpo dentro. Entregamos cada imagen en las medidas y el peso que pide tu tienda online.",
      },
      {
        q: "¿Con cuánta antelación hay que producir una campaña de temporada?",
        a: "Lo ideal es tener el material aprobado antes de que abra la ventana de venta, no durante. Contando preproducción, sesión, retoque y una ronda de cambios, conviene arrancar con varias semanas de margen sobre la fecha de lanzamiento. Si vas justo, dínoslo y ajustamos el plan a lo que dé tiempo a hacer bien.",
      },
      {
        q: "¿Trabajáis con marcas de fuera de Barcelona y Madrid?",
        a: "Sí. Tenemos oficina en Barcelona (Carrer del Bruc 61) y en Madrid (Calle de Génova 3), y en las dos áreas metropolitanas no hay coste de desplazamiento. Para marcas de otras ciudades, lo más habitual y lo más económico es que nos envíes las prendas y produzcamos aquí; si la campaña necesita una localización concreta, presupuestamos el viaje aparte.",
      },
    ],
    formTitle: "Cuéntanos qué colección tienes que sacar",
  },
];

export function getServiceLanding(slug: string): ServiceLanding | undefined {
  return serviceLandings.find((l) => l.slug === slug);
}

/** Landings de servicio de una ciudad: alimenta los enlaces cruzados. */
export function serviceLandingsForCity(city: string): ServiceLanding[] {
  return serviceLandings.filter(
    (l) => l.city?.toLowerCase() === city.toLowerCase(),
  );
}
