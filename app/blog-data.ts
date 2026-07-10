export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string; // ISO (YYYY-MM-DD)
  readingMinutes: number;
  keywords: string[];
  excerpt: string;
  content: Block[];
};

export const posts: Post[] = [
  {
    slug: "cuanto-cuesta-un-reel",
    title: "¿Cuánto cuesta un Reel para redes sociales en 2026?",
    description:
      "Guía de precios para producir Reels y TikToks: qué influye en el coste, modelos de tarifa y qué esperar al contratar una agencia de contenido.",
    category: "Precios",
    date: "2026-06-10",
    readingMinutes: 6,
    keywords: [
      "cuánto cuesta un reel",
      "precio reel instagram",
      "tarifas agencia contenido",
      "presupuesto contenido redes sociales",
    ],
    excerpt:
      "El precio de un Reel puede ir de unos pocos euros a varios cientos. Te explicamos qué influye de verdad en el coste y cómo elegir sin tirar el dinero.",
    content: [
      {
        type: "p",
        text: "Es la primera pregunta que nos hace casi todo el mundo: ¿cuánto cuesta un Reel? La respuesta honesta es «depende», pero eso no ayuda a nadie. Así que vamos a desglosar de qué depende realmente el precio para que puedas comparar presupuestos con criterio.",
      },
      { type: "h2", text: "Qué influye en el precio de un Reel" },
      {
        type: "p",
        text: "No todos los Reels cuestan lo mismo porque no todos requieren el mismo trabajo. Estos son los factores que más mueven el presupuesto:",
      },
      {
        type: "ul",
        items: [
          "Preproducción: idea, guion y planificación. Un Reel con un buen gancho pensado vale mucho más que uno improvisado.",
          "Rodaje: ¿grabas tú y nosotros editamos, o nos desplazamos con equipo, iluminación y dirección?",
          "Edición y motion: ritmo de montaje, subtítulos, grafismos y efectos suman horas de postproducción.",
          "Volumen: producir 12 piezas al mes sale mucho más rentable por unidad que encargar una suelta.",
          "Estrategia: un Reel dentro de un plan de contenido rinde más que uno aislado.",
        ],
      },
      { type: "h2", text: "Modelos de tarifa habituales" },
      {
        type: "p",
        text: "En el mercado conviven tres formas de cobrar contenido: por pieza suelta, por pack mensual y por retainer estratégico. La pieza suelta es cara por unidad y poco eficiente. El pack mensual (por ejemplo, 8-12 Reels al mes) es lo más común porque da consistencia, que es lo que de verdad mueve el algoritmo. El retainer añade estrategia, medición y talento, y es para marcas que quieren tratar las redes como un canal de negocio serio.",
      },
      { type: "h2", text: "¿Freelance o agencia?" },
      {
        type: "p",
        text: "Un freelance suele ser más barato por pieza, pero tú asumes la coordinación, la estrategia y los imprevistos. Una agencia cuesta más, pero tienes un equipo completo (guion, rodaje, edición, talento) y entregas constantes sin que tengas que estar encima. Si publicas poco y esporádico, un freelance puede bastar; si quieres crecer de verdad, la consistencia de una agencia sale a cuenta.",
      },
      { type: "h2", text: "Lo que de verdad importa" },
      {
        type: "p",
        text: "El Reel más barato es carísimo si nadie lo ve. Antes de mirar solo el precio, pregunta qué incluye: ¿hay estrategia detrás? ¿te aseguran una cadencia? ¿optimizan según resultados? En Maen Studios trabajamos con planes mensuales adaptados a cada marca. Si quieres un presupuesto a medida, escríbenos y lo preparamos sin compromiso.",
      },
    ],
  },
  {
    slug: "reels-que-funcionan-estructura",
    title: "Cómo hacer Reels que funcionan: la estructura que retiene",
    description:
      "La anatomía de un Reel que la gente termina de ver: gancho, desarrollo y cierre. Errores frecuentes y cómo mejorar la retención en Instagram y TikTok.",
    category: "Estrategia",
    date: "2026-06-18",
    readingMinutes: 7,
    keywords: [
      "cómo hacer reels que funcionan",
      "gancho reel",
      "retención instagram",
      "estructura reel viral",
    ],
    excerpt:
      "El 80% del rendimiento de un Reel se decide en los 3 primeros segundos. Esta es la estructura que usamos para que la gente no haga scroll.",
    content: [
      {
        type: "p",
        text: "Un buen Reel no es cuestión de suerte ni de que la cámara sea cara. Es estructura. Cuando entiendes cómo funciona la retención, dejas de publicar a ciegas y empiezas a diseñar piezas pensadas para que la gente se quede.",
      },
      { type: "h2", text: "El gancho: los primeros 3 segundos" },
      {
        type: "p",
        text: "En los primeros segundos el espectador decide si sigue o hace scroll. El gancho tiene que prometer valor, generar curiosidad o provocar una emoción inmediata. Puede ser visual (un plano potente), verbal (una frase que interpela) o de texto en pantalla. Si el gancho falla, da igual lo bueno que sea el resto.",
      },
      {
        type: "ul",
        items: [
          "Empieza por el momento más impactante, no por la introducción.",
          "Usa texto en pantalla que resuma la promesa del vídeo.",
          "Evita presentaciones largas: nadie espera a que «vayas al grano».",
        ],
      },
      { type: "h2", text: "El desarrollo: mantener el ritmo" },
      {
        type: "p",
        text: "Una vez tienes la atención, hay que sostenerla. Aquí manda el ritmo de montaje: cortes ágiles, cambios de plano, subtítulos y una progresión clara. Cada segundo tiene que dar una razón para seguir viendo. Si notas que hay un tramo donde el vídeo «se cae», ahí es donde pierdes gente.",
      },
      { type: "h2", text: "El cierre: llamada a la acción" },
      {
        type: "p",
        text: "El final decide qué pasa después: un like, un guardado, un comentario o una visita a tu perfil. Un cierre que invita a interactuar (una pregunta, un «guárdalo para luego», un bucle que reinicia el vídeo) multiplica el alcance porque el algoritmo premia la interacción y el tiempo de visionado.",
      },
      { type: "h2", text: "Errores que matan la retención" },
      {
        type: "ul",
        items: [
          "Introducciones largas antes de aportar valor.",
          "Vídeos sin subtítulos (la mayoría ve sin sonido).",
          "Formato horizontal o mal encuadrado para móvil.",
          "Publicar sin un objetivo claro para cada pieza.",
        ],
      },
      {
        type: "p",
        text: "En Maen Studios diseñamos cada Reel con esta estructura desde el guion. ¿Quieres contenido pensado para retener y no solo para rellenar el feed? Cuéntanos tu proyecto.",
      },
    ],
  },
  {
    slug: "estrategia-contenido-restaurantes",
    title: "Estrategia de contenido para restaurantes: cómo llenar tu local con Reels",
    description:
      "Cómo usar Reels y TikTok para atraer clientes a tu restaurante: tipos de contenido, frecuencia y errores que hacen que tus vídeos no lleguen a nadie.",
    category: "Sectores",
    date: "2026-06-25",
    readingMinutes: 6,
    keywords: [
      "contenido para restaurantes",
      "reels restaurantes",
      "marketing gastronómico redes sociales",
      "cómo promocionar un restaurante en instagram",
    ],
    excerpt:
      "La gente elige dónde comer con el móvil en la mano. Si tu restaurante no aparece en Reels, estás perdiendo mesas. Así se hace bien.",
    content: [
      {
        type: "p",
        text: "Hoy la carta más importante de tu restaurante no está en la mesa: está en Instagram y TikTok. Antes de reservar, la gente busca, mira Reels y decide con los ojos. Trabajamos con varios locales de Barcelona y esto es lo que de verdad funciona.",
      },
      { type: "h2", text: "Qué contenido grabar" },
      {
        type: "ul",
        items: [
          "Plato estrella en primer plano: el clásico que nunca falla. Vapor, textura, el corte perfecto.",
          "Detrás de la barra o la cocina: el proceso genera confianza y deseo.",
          "El ambiente del local: la gente no solo elige comida, elige una experiencia.",
          "Las personas: el equipo, los clientes, las caras. La cercanía vende.",
          "Novedades y temporada: platos nuevos, eventos, cartas de temporada.",
        ],
      },
      { type: "h2", text: "Con qué frecuencia publicar" },
      {
        type: "p",
        text: "La consistencia importa más que la cantidad. Es mejor publicar 3 Reels buenos a la semana de forma sostenida que 10 una semana y nada el mes siguiente. El algoritmo premia a las cuentas activas y constantes, y tu comunidad necesita verte con regularidad para acordarse de ti a la hora de reservar.",
      },
      { type: "h2", text: "Errores habituales" },
      {
        type: "ul",
        items: [
          "Grabar en horizontal o con mala luz: el móvil come de noche.",
          "Vídeos largos sin gancho: en gastronomía el deseo entra por los ojos, rápido.",
          "No usar la ubicación ni los hashtags locales: pierdes el tráfico de gente cercana.",
          "No responder ni aprovechar los comentarios: cada interacción es alcance.",
        ],
      },
      { type: "h2", text: "De los Reels a las mesas" },
      {
        type: "p",
        text: "El objetivo no es acumular visualizaciones, es llenar el local. Por eso cada pieza debe tener intención: dar hambre, mostrar el ambiente y facilitar la reserva. En Maen Studios producimos el contenido de restaurantes y bares de Barcelona de principio a fin. Si quieres que tu local no pare de sonar, hablemos.",
      },
    ],
  },
  {
    slug: "que-es-ugc-como-usarlo",
    title: "Qué es el UGC y cómo usarlo para vender más",
    description:
      "UGC (contenido generado por creadores): qué es, por qué funciona mejor que la publicidad tradicional y cómo integrarlo en la estrategia de tu marca.",
    category: "UGC",
    date: "2026-07-01",
    readingMinutes: 5,
    keywords: [
      "qué es el ugc",
      "ugc marketing",
      "contenido generado por usuarios",
      "creadores de contenido para marcas",
    ],
    excerpt:
      "El UGC parece contenido de un amigo, no un anuncio. Por eso convierte tanto. Te explicamos qué es y cómo aprovecharlo.",
    content: [
      {
        type: "p",
        text: "UGC son las siglas de User Generated Content: contenido generado por usuarios o creadores, con un estilo natural y cercano, como si lo hubiera grabado un amigo con el móvil. Es una de las herramientas más potentes del marketing en redes actual, y no por casualidad.",
      },
      { type: "h2", text: "Por qué funciona tan bien" },
      {
        type: "p",
        text: "La gente confía más en personas que en marcas. Un vídeo donde alguien real prueba un producto y cuenta su experiencia genera mucha más confianza que un anuncio pulido. Además, el UGC encaja de forma natural en el feed: no interrumpe, se integra. Eso reduce el rechazo a la publicidad y aumenta la conversión.",
      },
      { type: "h2", text: "Tipos de UGC" },
      {
        type: "ul",
        items: [
          "Testimonios: alguien cuenta su experiencia con el producto.",
          "Unboxing y reviews: primera impresión y demostración de uso.",
          "Tutoriales: cómo se usa el producto en el día a día.",
          "Contenido de estilo de vida: el producto integrado en una escena real.",
        ],
      },
      { type: "h2", text: "UGC no es lo mismo que influencers" },
      {
        type: "p",
        text: "Un error común: confundir UGC con marketing de influencers. Un influencer publica en su perfil y te aporta su audiencia. El UGC lo publicas tú (en tu perfil o en tus anuncios) y lo que aportan los creadores es el formato auténtico. Son estrategias complementarias, no lo mismo.",
      },
      { type: "h2", text: "Cómo empezar" },
      {
        type: "p",
        text: "Lo ideal es trabajar con creadores que encajen con la voz de tu marca y producir piezas pensadas para tus objetivos. En Maen Studios conectamos marcas con talento y producimos campañas de UGC de principio a fin. Si quieres contenido que genere confianza y venda, escríbenos.",
      },
    ],
  },
  {
    slug: "agencia-vs-freelance-contenido",
    title: "Agencia de contenido vs freelance: ¿qué le conviene a tu marca?",
    description:
      "Diferencias reales entre contratar una agencia de contenido y un freelance: coste, consistencia, capacidad y estrategia. Cómo elegir según tu marca.",
    category: "Negocio",
    date: "2026-07-04",
    readingMinutes: 5,
    keywords: [
      "agencia vs freelance",
      "contratar agencia de contenido",
      "agencia social media",
      "gestión redes sociales marca",
    ],
    excerpt:
      "¿Freelance o agencia? No hay una respuesta universal, pero sí una que encaja mejor con tu momento. Te ayudamos a decidir.",
    content: [
      {
        type: "p",
        text: "Cuando una marca decide tomarse en serio sus redes, aparece la duda: ¿contrato a un freelance o a una agencia? Ambas opciones son válidas, pero resuelven problemas distintos. Vamos a ver las diferencias reales sin humo.",
      },
      { type: "h2", text: "El freelance: agilidad y precio" },
      {
        type: "p",
        text: "Un freelance suele ser más económico y ágil para tareas concretas: editar unos vídeos, grabar un día, sacar adelante una pieza puntual. El inconveniente es la dependencia de una sola persona: su disponibilidad, sus vacaciones y su rango de habilidades marcan tu límite. La estrategia y la coordinación, además, suelen recaer en ti.",
      },
      { type: "h2", text: "La agencia: equipo y consistencia" },
      {
        type: "p",
        text: "Una agencia te da un equipo completo: estrategia, guion, rodaje, edición, motion y talento, coordinados desde un único punto de contacto. Eso se traduce en entregas constantes, más capacidad de producción y una visión de marca a largo plazo. Cuesta más, pero eliminas la gestión y ganas fiabilidad.",
      },
      { type: "h2", text: "Cómo decidir" },
      {
        type: "ul",
        items: [
          "Publicas poco y esporádico → un freelance puede bastar.",
          "Quieres crecer con constancia y sin gestionar tú el día a día → agencia.",
          "Necesitas varias disciplinas (estrategia + rodaje + edición + talento) → agencia.",
          "Tienes un pico puntual de trabajo → freelance.",
        ],
      },
      { type: "h2", text: "Nuestra recomendación" },
      {
        type: "p",
        text: "Si las redes son un canal importante para tu negocio, la consistencia lo es todo, y ahí una agencia marca la diferencia. En Maen Studios funcionamos como tu departamento de contenido externo: un equipo que piensa, produce y publica por ti. Si quieres ver cómo encajaría en tu marca, cuéntanos tu proyecto.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
