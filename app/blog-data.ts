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
  /** Fecha de última revisión (ISO). Google la usa como señal de frescura. */
  updated?: string;
  readingMinutes: number;
  /**
   * Imagen que acompaña al artículo en los listados. Es distinta de la imagen
   * social de /blog/[slug]/opengraph-image: aquella lleva el título porque se
   * ve fuera del sitio, al compartir. Aquí el título ya está al lado, así que
   * repetirlo no aporta nada.
   */
  image?: string;
  keywords: string[];
  excerpt: string;
  content: Block[];
};

export const posts: Post[] = [
  {
    slug: "cuanto-cuesta-un-reel",
    image: "/clients/pigili-originals/poster.jpg",
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
    image: "/clients/canallita/poster.jpg",
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
    image: "/clients/ultramarinos-marin/poster.jpg",
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
    image: "/clients/macala/poster.jpg",
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
    image: "/podcast/reel-1-poster.jpg",
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
  {
    slug: "agencia-de-contenido-madrid-como-elegir",
    image: "/clients/burmet/poster.jpg",
    title: "Cómo elegir una agencia de contenido en Madrid (guía 2026)",
    description:
      "Qué mirar antes de contratar una agencia de contenido en Madrid: qué debe incluir la propuesta, qué precios son realistas, qué preguntas hacer y las señales de alarma.",
    category: "Guías",
    date: "2026-07-02",
    updated: "2026-08-13",
    readingMinutes: 7,
    keywords: [
      "agencia de contenido Madrid",
      "elegir agencia redes sociales Madrid",
      "agencia social media Madrid precios",
      "productora audiovisual Madrid",
    ],
    excerpt:
      "En Madrid hay cientos de agencias que prometen lo mismo. Estas son las preguntas que separan a las que producen de las que solo venden powerpoints.",
    content: [
      {
        type: "p",
        text: "Buscar «agencia de contenido en Madrid» devuelve cientos de resultados que dicen casi lo mismo: creatividad, estrategia, resultados. El problema es que la propuesta solo se distingue cuando ya has firmado. Esta guía es lo que nosotros miraríamos si estuviéramos al otro lado de la mesa.",
      },
      { type: "h2", text: "1. Que produzcan de verdad, no solo que planifiquen" },
      {
        type: "p",
        text: "Hay dos tipos de agencia: la que diseña una estrategia y subcontrata el rodaje, y la que graba y edita con equipo propio. La primera te cobra un intermediario y multiplica los plazos; la segunda responde de la pieza final. Pregunta siempre quién sostiene la cámara y quién monta: si la respuesta es «un colaborador», sabrás qué esperar cuando haya que repetir un plano.",
      },
      { type: "h2", text: "2. Pide ver piezas, no un dosier de logos" },
      {
        type: "p",
        text: "Un portfolio con veinte marcas conocidas no dice nada si el trabajo fue una campaña puntual de hace tres años. Pide tres cuentas que lleven gestionando ahora mismo y míralas en Instagram o TikTok: ¿publican con constancia?, ¿las piezas mantienen una línea reconocible?, ¿los primeros segundos enganchan? Eso es lo que vas a recibir tú.",
      },
      { type: "h2", text: "3. Que la propuesta diga qué recibes cada mes" },
      {
        type: "p",
        text: "Una buena propuesta se lee en un minuto y responde a cuatro cosas: cuántas piezas al mes, de qué tipo, cuántas jornadas de rodaje incluye y quién publica. Si alguna de esas cuatro está en modo «según necesidades», acabarás discutiéndolo cada mes.",
      },
      {
        type: "ul",
        items: [
          "Número de piezas mensuales cerrado y por escrito.",
          "Jornadas de rodaje incluidas y coste de las adicionales.",
          "Quién escribe los guiones y quién aprueba antes de publicar.",
          "Plazo de entrega desde el rodaje y número de revisiones incluidas.",
          "Qué pasa con los brutos: si son tuyos y si te los entregan.",
        ],
      },
      { type: "h2", text: "4. Precios realistas en el mercado de Madrid" },
      {
        type: "p",
        text: "Madrid tiene precios algo por encima de la media española por coste de estructura y competencia por el talento. Un plan mensual serio con dirección creativa, jornada de rodaje y de 8 a 12 piezas editadas rara vez baja de la franja media de mercado. Si alguien te ofrece 20 vídeos al mes por un precio de saldo, o graba todo en una tarde sin guion, o está usando plantillas. Ninguna de las dos cosas construye marca.",
      },
      { type: "h2", text: "5. Cercanía: no es un detalle menor" },
      {
        type: "p",
        text: "Si tu negocio necesita rodajes recurrentes —restauración, retail, servicios con local—, que la agencia esté en la ciudad importa. Se traduce en poder grabar el mismo día que surge una oportunidad, en visitas para entender el sitio antes de rodar y en no pagar desplazamientos en cada factura. Nuestra oficina de Madrid está en Calle de Génova 3, a minutos de Chamberí, Salamanca y Chueca.",
      },
      { type: "h2", text: "Señales de alarma" },
      {
        type: "ul",
        items: [
          "Prometen viralidad o un número concreto de seguidores.",
          "No enseñan trabajo actual, solo casos antiguos.",
          "El presupuesto no detalla piezas ni rodajes.",
          "Permanencias largas sin salida antes del primer ciclo de resultados.",
          "Nadie del equipo que te atiende va a tocar tu cuenta después.",
        ],
      },
      {
        type: "p",
        text: "Si quieres contrastar una propuesta que ya tienes sobre la mesa, escríbenos: te decimos con franqueza si el precio y el alcance tienen sentido, aunque acabes contratando a otros.",
      },
    ],
  },
  {
    slug: "cuanto-cuesta-community-manager",
    image: "/podcast/reel-2-poster.jpg",
    title: "¿Cuánto cuesta un community manager en 2026?",
    description:
      "Precios reales de un community manager en España: freelance, agencia o interno. Qué incluye cada opción y cómo saber cuál le conviene a tu negocio.",
    category: "Precios",
    date: "2026-07-09",
    updated: "2026-08-13",
    readingMinutes: 6,
    keywords: [
      "cuánto cuesta un community manager",
      "precio community manager",
      "tarifas community manager España",
      "community manager freelance o agencia",
    ],
    excerpt:
      "Freelance, agencia o interno: las tres opciones cuestan cosas distintas y resuelven problemas distintos. Te contamos qué esperar de cada una.",
    content: [
      {
        type: "p",
        text: "«Community manager» significa cosas muy distintas según quién lo diga: desde alguien que programa publicaciones hasta un equipo que produce el contenido, lo publica y responde a la comunidad. Por eso los precios que encuentras van de cien euros a varios miles. Vamos a ordenarlo.",
      },
      { type: "h2", text: "Qué incluye realmente el servicio" },
      {
        type: "ul",
        items: [
          "Calendario editorial: qué se publica, cuándo y con qué objetivo.",
          "Publicación y programación en cada plataforma.",
          "Interacción: responder comentarios y mensajes directos.",
          "Escucha y moderación: gestionar críticas y menciones.",
          "Informe mensual con métricas y decisiones para el mes siguiente.",
        ],
      },
      {
        type: "p",
        text: "Ojo con un matiz que cambia el precio por completo: ¿el community manager crea el contenido o solo lo publica? Publicar material que ya existe es una parte del trabajo. Producir los vídeos y las fotos es otra muy distinta, y es donde está el grueso del coste.",
      },
      { type: "h2", text: "Freelance" },
      {
        type: "p",
        text: "Es la opción más económica y la más habitual para negocios que empiezan. Funciona bien si ya tienes material que publicar y necesitas orden y constancia. El límite aparece cuando hay que producir vídeo: pocos freelances cubren guion, rodaje y edición con el nivel que exigen hoy Reels y TikTok, y las vacaciones o una baja dejan la cuenta parada.",
      },
      { type: "h2", text: "Agencia" },
      {
        type: "p",
        text: "Cuesta más al mes, pero incluye el equipo entero: dirección creativa, producción, edición y gestión. Tiene sentido cuando el contenido es un canal de venta y no un adorno, cuando necesitas volumen constante o cuando no quieres depender de una sola persona. En Maen Studios trabajamos así: un punto de contacto y un equipo detrás.",
      },
      { type: "h2", text: "Interno (en plantilla)" },
      {
        type: "p",
        text: "Un perfil junior en plantilla parece barato hasta que sumas salario, seguridad social, equipo, licencias de software y el tiempo de alguien que lo dirija. Sale a cuenta cuando el volumen es alto y continuo, y sobre todo cuando el contenido es el núcleo del negocio. Para la mayoría de pymes, un interno solo cubre la parte de gestión y sigue necesitando producción externa.",
      },
      { type: "h2", text: "Cómo decidir sin equivocarte" },
      {
        type: "p",
        text: "Haz una pregunta sencilla: ¿el problema es que no publico, o que lo que publico no es lo bastante bueno? Si es lo primero, con gestión basta. Si es lo segundo, necesitas producción. Contratar gestión cuando el problema es el contenido es la forma más rápida de gastar doce meses sin mover una sola métrica.",
      },
      {
        type: "p",
        text: "¿Quieres saber qué necesita tu caso? Cuéntanos qué publicas ahora y te decimos qué encaja, sin compromiso.",
      },
    ],
  },
  {
    slug: "precio-video-corporativo-empresa",
    image: "/reel-proyecto-poster.jpg",
    title: "Cuánto cuesta un vídeo corporativo para una empresa",
    description:
      "Qué influye en el precio de un vídeo corporativo o de marca: preproducción, equipo, jornada de rodaje, postproducción y derechos. Con rangos orientativos.",
    category: "Precios",
    date: "2026-07-16",
    updated: "2026-08-13",
    readingMinutes: 6,
    keywords: [
      "precio vídeo corporativo",
      "cuánto cuesta un vídeo de empresa",
      "presupuesto vídeo marca",
      "productora vídeo corporativo",
    ],
    excerpt:
      "Un vídeo de marca no se cotiza por minutos, se cotiza por jornadas y por equipo. Desglosamos las partidas para que sepas leer cualquier presupuesto.",
    content: [
      {
        type: "p",
        text: "Cuando pides presupuesto para un vídeo corporativo, la primera pregunta que recibes suele ser «¿de cuánto tiempo?». Es la pregunta equivocada: un vídeo de un minuto puede costar más que uno de cinco. Lo que se cotiza es el trabajo que hay detrás, no la duración del archivo final.",
      },
      { type: "h2", text: "Las partidas de cualquier presupuesto" },
      {
        type: "ul",
        items: [
          "Preproducción: reunión, concepto, guion, guion técnico y plan de rodaje.",
          "Equipo humano: dirección, cámara, sonido, iluminación y producción.",
          "Equipo técnico: cámaras, ópticas, luces, audio y, si hace falta, dron.",
          "Jornada de rodaje: la unidad real de coste; media jornada o jornada completa.",
          "Postproducción: montaje, etalonaje, grafismo, mezcla de sonido y música.",
          "Derechos: música licenciada, actores, locutor y usos publicitarios.",
        ],
      },
      { type: "h2", text: "Qué dispara el precio" },
      {
        type: "p",
        text: "Cuatro cosas: rodar en varias localizaciones (cada cambio cuesta horas), necesitar actores o talento, exigir motion graphics elaborados y pedir versiones en varios idiomas o formatos. Nada de eso es caprichoso, pero conviene saber cuál de las cuatro estás activando cuando pides «algo cinematográfico».",
      },
      { type: "h2", text: "El error más común: un solo vídeo" },
      {
        type: "p",
        text: "Muchas empresas invierten todo el presupuesto anual en una pieza institucional de tres minutos que ve poca gente y envejece en un año. Con esa misma jornada de rodaje se pueden sacar la pieza principal y una decena de cortes verticales para redes, anuncios y web. Planificar el rodaje pensando en todos los formatos desde el guion es lo que multiplica el retorno.",
      },
      { type: "h2", text: "Cómo pedir presupuesto y comparar bien" },
      {
        type: "p",
        text: "Dile a la productora qué quieres conseguir y dónde se va a ver la pieza, no cómo quieres que se haga. Y compara siempre lo mismo: jornadas incluidas, número de entregables y versiones, rondas de revisión y qué pasa con el material bruto. Dos presupuestos con precios muy distintos suelen estar cotizando trabajos muy distintos.",
      },
      {
        type: "p",
        text: "En Maen Studios producimos tanto la pieza de marca como todo el contenido derivado para redes. Cuéntanos qué necesitas y te preparamos un presupuesto desglosado por partidas.",
      },
    ],
  },
  {
    slug: "cada-cuanto-publicar-redes-sociales",
    image: "/clients/mimosas/poster.jpg",
    title: "¿Cada cuánto hay que publicar en redes sociales?",
    description:
      "Frecuencia recomendada de publicación en Instagram, TikTok y YouTube según el tamaño de tu marca, y por qué la constancia importa más que el volumen.",
    category: "Estrategia",
    date: "2026-07-23",
    updated: "2026-08-13",
    readingMinutes: 5,
    keywords: [
      "cada cuánto publicar en instagram",
      "frecuencia publicación redes sociales",
      "cuántos reels al mes",
      "calendario de publicación marca",
    ],
    excerpt:
      "Publicar más no siempre es mejor. Publicar irregular siempre es peor. Esta es la frecuencia que recomendamos según el momento de cada marca.",
    content: [
      {
        type: "p",
        text: "Es la pregunta que más nos hacen después del precio. La respuesta corta: la frecuencia que puedas sostener seis meses seguidos sin bajar la calidad. La larga necesita algún matiz más.",
      },
      { type: "h2", text: "Por qué la constancia gana al volumen" },
      {
        type: "p",
        text: "Los algoritmos de Instagram y TikTok necesitan datos para entender a quién enseñar tu contenido. Una cuenta que publica dos veces por semana durante seis meses acumula mucha más información útil que una que publica quince piezas un mes y desaparece dos. Además, tu audiencia aprende cuándo esperarte. Un parón de tres semanas cuesta más de lo que suma una semana de publicar cada día.",
      },
      { type: "h2", text: "Frecuencia recomendada por plataforma" },
      {
        type: "ul",
        items: [
          "Instagram: de 3 a 5 piezas por semana entre Reels y carruseles, más stories casi a diario.",
          "TikTok: de 3 a 7 vídeos por semana; es la plataforma que más premia el volumen.",
          "YouTube Shorts: de 2 a 4 por semana, normalmente reaprovechando lo vertical.",
          "LinkedIn: de 2 a 3 publicaciones por semana si vendes a empresas.",
        ],
      },
      { type: "h2", text: "Según el momento de tu marca" },
      {
        type: "p",
        text: "Si estás empezando, prioriza encontrar qué formatos funcionan: 8 piezas al mes bien pensadas te dan señales claras. Si ya tienes una comunidad activa, sube a 12 o 16 para aprovechar el alcance. Y si estás en campaña —una apertura, un lanzamiento, una temporada fuerte—, concentra el esfuerzo esas semanas en lugar de repartirlo de forma plana todo el año.",
      },
      { type: "h2", text: "Cómo sostener el ritmo sin morir en el intento" },
      {
        type: "p",
        text: "Casi nadie puede grabar cada día. Lo que sí funciona es concentrar la producción: una jornada de rodaje bien planificada da material para tres o cuatro semanas de publicaciones. Ese es exactamente el modelo con el que trabajamos con nuestros clientes: rodamos por bloques, editamos por lotes y entregamos con calendario.",
      },
      {
        type: "p",
        text: "Si te cuesta mantener la cadencia, probablemente el problema no sea la disciplina sino el sistema de producción. Escríbenos y lo montamos.",
      },
    ],
  },
  {
    slug: "tiktok-para-marcas-guia",
    image: "/clients/besmaya/poster.jpg",
    title: "TikTok para marcas: guía práctica para empezar bien",
    description:
      "Cómo debe entrar una marca en TikTok en 2026: qué contenido funciona, qué tono usar, cómo reaprovechar los Reels y los errores que hunden una cuenta nueva.",
    category: "Estrategia",
    date: "2026-07-30",
    updated: "2026-08-13",
    readingMinutes: 7,
    keywords: [
      "tiktok para marcas",
      "estrategia tiktok empresa",
      "cómo empezar en tiktok marca",
      "contenido tiktok negocio",
    ],
    excerpt:
      "TikTok no es Instagram con otro logo. Estas son las diferencias que de verdad cambian cómo tienes que producir.",
    content: [
      {
        type: "p",
        text: "Muchas marcas abren TikTok subiendo los mismos Reels que ya publican en Instagram y concluyen a los dos meses que «TikTok no funciona para nosotros». El problema no es la plataforma: es que se comporta de otra manera y exige otra forma de producir.",
      },
      { type: "h2", text: "La diferencia clave: descubrimiento, no seguidores" },
      {
        type: "p",
        text: "En Instagram tu contenido llega sobre todo a quien ya te sigue. En TikTok, el «Para ti» reparte casi todo entre gente que no te conoce. Eso tiene dos consecuencias: una cuenta nueva puede tener alcance desde el primer día, y cada vídeo tiene que entenderse sin contexto previo. Nada de «como os contaba la semana pasada».",
      },
      { type: "h2", text: "Qué contenido funciona" },
      {
        type: "ul",
        items: [
          "Proceso: cómo se hace tu producto, con detalle real y sin pulir de más.",
          "Personas: caras del equipo hablando a cámara; la marca sin cara rinde peor.",
          "Utilidad concreta: algo que el espectador pueda aplicar hoy mismo.",
          "Formatos de la plataforma: audios del momento, cortes rápidos, texto en pantalla.",
          "Respuesta a comentarios en vídeo: alimenta la conversación y el alcance.",
        ],
      },
      { type: "h2", text: "El tono: menos anuncio, más conversación" },
      {
        type: "p",
        text: "TikTok castiga lo que parece publicidad. Un plano de producto perfectamente iluminado con música épica se salta en medio segundo. Lo que retiene es alguien contando algo con naturalidad, aunque el encuadre sea imperfecto. Esto no significa bajar la calidad: significa que la producción tiene que trabajar para que no se note.",
      },
      { type: "h2", text: "Reaprovechar sí, copiar y pegar no" },
      {
        type: "p",
        text: "Puedes usar el mismo rodaje para Instagram y TikTok, pero el montaje debe cambiar: en TikTok el gancho es más directo, el ritmo más rápido y el texto en pantalla más presente. Y quita siempre la marca de agua de otra plataforma: la propia app reduce el alcance de lo que reconoce como importado.",
      },
      { type: "h2", text: "Errores que hunden una cuenta nueva" },
      {
        type: "ul",
        items: [
          "Publicar solo promociones y ofertas.",
          "Abandonar a las tres semanas porque «no despega».",
          "No responder comentarios, que es donde se construye la comunidad.",
          "Cambiar de línea visual cada mes y no ser reconocible.",
        ],
      },
      {
        type: "p",
        text: "Producimos TikTok y Reels para marcas de restauración, moda y producto desde Barcelona y Madrid. Si quieres entrar bien, cuéntanos tu proyecto.",
      },
    ],
  },
  {
    slug: "preparar-local-dia-de-rodaje",
    image: "/reel-cocina-poster.jpg",
    title: "Cómo preparar tu negocio para un día de rodaje de contenido",
    description:
      "Checklist para que una jornada de grabación en tu local salga bien: qué preparar, cuándo grabar, qué necesita el equipo y cómo sacar contenido para semanas.",
    category: "Producción",
    date: "2026-08-06",
    readingMinutes: 5,
    keywords: [
      "día de rodaje contenido",
      "preparar grabación local negocio",
      "cómo grabar reels en mi negocio",
      "jornada de rodaje redes sociales",
    ],
    excerpt:
      "Una jornada bien preparada da material para un mes. Una improvisada da tres vídeos y un mal recuerdo. Esta es nuestra checklist.",
    content: [
      {
        type: "p",
        text: "El día de rodaje es donde se decide casi todo. Si llega bien preparado, salen de él tres o cuatro semanas de contenido; si se improvisa, se va la mañana en resolver cosas que se podían haber previsto por WhatsApp. Esto es lo que pedimos a nuestros clientes antes de cada jornada.",
      },
      { type: "h2", text: "Antes del rodaje" },
      {
        type: "ul",
        items: [
          "Elige la franja horaria con menos afluencia: normalmente media mañana o antes de abrir.",
          "Avisa al equipo: quién sale a cámara y quién puede ayudar si hace falta.",
          "Ten el producto listo y en buen estado; si es comida, calcula raciones extra.",
          "Revisa el espacio: orden, luz natural disponible y enchufes accesibles.",
          "Confirma qué se puede mostrar y qué no (zonas privadas, proveedores, precios).",
        ],
      },
      { type: "h2", text: "Qué necesita el equipo al llegar" },
      {
        type: "p",
        text: "Poca cosa, pero importa: un sitio donde dejar el material, acceso a corriente y alguien del negocio disponible para decisiones rápidas. Los rodajes se atascan cuando hay que esperar a que alguien apruebe si se puede mover una mesa o abrir una persiana.",
      },
      { type: "h2", text: "Sacar el máximo a la jornada" },
      {
        type: "p",
        text: "Grabamos por bloques pensando ya en el calendario del mes: piezas de producto, piezas de proceso, planos de ambiente, alguna a cámara y recursos sueltos para montar más adelante. Ese banco de recursos es lo que permite que las semanas flojas no queden vacías y que se pueda reaccionar a una novedad sin volver a montar un rodaje.",
      },
      { type: "h2", text: "Después: el material no se queda parado" },
      {
        type: "p",
        text: "Cuando termina el rodaje empieza el montaje por lotes. Entregamos las piezas con la cadencia acordada, no todas de golpe, para que la publicación siga un calendario y podamos ajustar según lo que funcione. Si un formato rinde, se le da más recorrido en la siguiente tanda.",
      },
      {
        type: "p",
        text: "Rodamos en Barcelona y Madrid cada semana. Si quieres ver cómo sería una jornada en tu local, escríbenos.",
      },
    ],
  },
  {
    slug: "contenido-redes-sociales-tiendas-moda",
    image: "/clients/aluxe/poster.jpg",
    title: "Contenido en redes para marcas de moda y tiendas de ropa",
    description:
      "Cómo debe comunicar una marca de moda en Instagram y TikTok: tipos de pieza que venden, calendario por temporada y errores frecuentes en retail.",
    category: "Sectores",
    date: "2026-08-11",
    readingMinutes: 6,
    keywords: [
      "contenido para marcas de moda",
      "instagram tienda de ropa",
      "marketing redes moda",
      "reels marca de ropa",
    ],
    excerpt:
      "En moda el producto entra por los ojos, pero lo que vende es el contexto: quién lo lleva, cómo y para qué momento.",
    content: [
      {
        type: "p",
        text: "La moda parte con ventaja en redes: el producto es visual y la gente ya busca inspiración. El problema es que casi todas las marcas publican lo mismo —producto sobre fondo neutro y algún flatlay— y el feed acaba siendo intercambiable.",
      },
      { type: "h2", text: "Las piezas que de verdad funcionan" },
      {
        type: "ul",
        items: [
          "Prenda en movimiento: cómo cae, cómo se ajusta, cómo se ve al andar.",
          "Estilismo: la misma prenda en tres looks distintos.",
          "Detalle y calidad: costuras, tejido, acabados; justifica el precio sin decirlo.",
          "Detrás del proceso: taller, materiales, quién lo fabrica.",
          "Comunidad: clientes reales llevando la marca (UGC).",
        ],
      },
      { type: "h2", text: "El contexto vende más que el producto" },
      {
        type: "p",
        text: "Una camisa sobre una percha es un catálogo. La misma camisa en alguien que sale a cenar un jueves es una decisión de compra. Cuando el espectador se imagina usándola, el producto deja de competir solo por precio. Por eso rodamos con personas y en situaciones reconocibles siempre que podemos.",
      },
      { type: "h2", text: "Calendario por temporada" },
      {
        type: "p",
        text: "El retail de moda vive de picos: cambio de temporada, rebajas, campaña navideña, vuelta al cole. El error habitual es empezar a producir cuando el pico ya ha llegado. El contenido de una campaña se graba con semanas de antelación, se publica en la ventana buena y deja recursos para sostener las semanas valle que vienen después.",
      },
      { type: "h2", text: "UGC: la palanca más rentable del sector" },
      {
        type: "p",
        text: "En moda, el contenido de creadores y de clientes rinde especialmente bien porque aporta la prueba social que la marca no puede darse a sí misma. Funciona mejor con varios perfiles medianos y bien elegidos que con un solo nombre grande: más formatos, más públicos y un coste más razonable.",
      },
      { type: "h2", text: "Errores frecuentes" },
      {
        type: "ul",
        items: [
          "Publicar solo cuando hay descuento.",
          "Cambiar la línea visual en cada campaña y no ser reconocible.",
          "Fotos preciosas y vídeo inexistente: hoy el alcance está en vertical.",
          "No responder los mensajes donde preguntan talla, stock o envío.",
        ],
      },
      {
        type: "p",
        text: "Trabajamos con marcas de moda y streetwear como Macala, Canallita o Aluxe. Si quieres contenido que se sostenga toda la temporada, cuéntanos tu proyecto.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
