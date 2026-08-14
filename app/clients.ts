export type ClientVideo = {
  src: string; // ruta en /public (ej: "/clients/jansana/reel1.mp4")
  title?: string;
};

export type Client = {
  slug: string;
  name: string;
  logo?: string; // ruta en /public; si no hay, se muestra el nombre como texto
  tagline: string;
  description: string;
  url: string; // web o Instagram, "" si todavía no hay
  /** Handle de Instagram sin la @. Sin esto no se pinta el botón. */
  instagram?: string;
  /** Sector de la marca: agrupa casos relacionados y alimenta las keywords. */
  sector: string;
  videos: ClientVideo[];
  /** Seguidores en redes (portfolio Canva) */
  community?: string;
  /** Crecimiento desde que llevamos la cuenta, ej. "+320%". Dato real o nada. */
  growth?: string;
  /** Preview corto y ligero (10s, 540px) para las rejillas */
  previewVideo?: string;
  /** Primer fotograma: pinta la tarjeta antes de que baje un solo byte de vídeo */
  poster?: string;
};

/**
 * Todos los clientes contratan el servicio completo del estudio, así que esto
 * no se guarda marca a marca: es una constante, no un dato por cliente.
 */
export const CORE_SERVICES = [
  "Dirección Creativa",
  "Producción Audiovisual",
  "Community Management",
];

// NOTA: previewVideo alineado con Portfolio Canva (y9j1nbo6190zkc0) cuando hay asset local.
// Ya están todas las marcas del Canva. Las siete últimas se añadieron sin assets
// (logo ni reel), así que salen en el índice de /clientes, no en la rejilla de vídeo.
export const clients: Client[] = [
  {
    slug: "macala",
    name: "Macala",
    logo: "/clients/macala.png",
    community: "+10,4k",
    previewVideo: "/clients/macala/preview.mp4",
    poster: "/clients/macala/poster.jpg",
    tagline: "Alpargatas hechas en España",
    description:
      "Creamos el contenido en redes de Macala, marca de alpargatas y ropa sostenible hecha en España. Reels, UGC y estrategia con su sello: tradición y producto de calidad.",
    url: "https://macala.es/",
    sector: "Moda",
    videos: [{ src: "/clients/macala/reel.mp4", title: "Reel Macala" }],
  },
  {
    slug: "fortuna-tonino",
    name: "Fortuna Tonino",
    logo: "/clients/fortuna-tonino/logo.png",
    previewVideo: "/clients/fortuna-tonino/preview.mp4",
    poster: "/clients/fortuna-tonino/poster.jpg",
    tagline: "Good luck, better vibes · Barcelona",
    description:
      "Contenido para Fortuna Tonino, coctelería y ambiente nocturno en Barcelona. Reels que transmiten la energía del local y llenan sus noches.",
    url: "https://www.fortunatonino.com/",
    instagram: "fortuna_tonino",
    sector: "Ocio nocturno",
    videos: [{ src: "/clients/fortuna-tonino/reel.mp4", title: "Reel Fortuna" }],
  },
  {
    slug: "gran-tonino",
    name: "Gran Tonino",
    community: "+14,5k",
    previewVideo: "/clients/gran-tonino/preview.mp4",
    poster: "/clients/gran-tonino/poster.jpg",
    tagline: "Piano bar · Barcelona",
    description:
      "Contenido para Gran Tonino Piano Club: cenas, cócteles y música en directo con un piano de cola como protagonista. Piezas que capturan la experiencia del local.",
    url: "https://www.grantonino.com/",
    instagram: "gran_tonino_club",
    sector: "Ocio nocturno",
    videos: [{ src: "/clients/gran-tonino/reel.mp4", title: "Reel Gran Tonino" }],
  },
  {
    slug: "canallita",
    name: "Canallita",
    community: "+63k",
    previewVideo: "/clients/canallita/preview.mp4",
    poster: "/clients/canallita/poster.jpg",
    tagline: "Moda para machos",
    description:
      "Producción de contenido y reels para Canallita, marca de moda masculina con una personalidad muy marcada.",
    url: "https://canallita.com/",
    instagram: "canallita.es",
    sector: "Moda",
    videos: [{ src: "/clients/canallita/reel.mp4", title: "Reel Canallita" }],
  },
  {
    slug: "tram-tram",
    name: "Tram-Tram",
    community: "+15k",
    previewVideo: "/clients/tram-tram/preview.mp4",
    poster: "/clients/tram-tram/poster.jpg",
    tagline: "Restaurante familiar · Sarrià, Barcelona",
    description:
      "Contenido gastronómico para Tram-Tram, restaurante familiar de la zona alta de Barcelona con 35 años de historia. Piezas que ponen en valor su cocina y sus platos.",
    url: "https://tram-tram.com/",
    instagram: "restaurant_tramtram",
    sector: "Gastronomía",
    videos: [{ src: "/clients/tram-tram/reel.mp4", title: "Reel Tram-Tram" }],
  },
  {
    slug: "besmaya",
    name: "Besmaya",
    community: "+26k",
    previewVideo: "/clients/besmaya/preview.mp4",
    poster: "/clients/besmaya/poster.jpg",
    tagline: "Proyecto musical",
    description:
      "Contenido audiovisual para el proyecto musical Besmaya: piezas para redes que acompañan su música y su gira.",
    url: "https://www.somosbesmaya.com/",
    instagram: "somosbesmaya",
    sector: "Música",
    videos: [{ src: "/clients/besmaya/reel.mp4", title: "Reel Besmaya" }],
  },
  {
    slug: "focacha",
    name: "Focacha BCN",
    community: "+6k",
    previewVideo: "/clients/focacha/preview.mp4",
    poster: "/clients/focacha/poster.jpg",
    tagline: "Focaccia · Barcelona",
    description:
      "Focacha BCN es el speakeasy de focaccia del que todo el mundo habla en Barcelona. Creamos sus Reels y contenido en redes: piezas con ritmo y estética que transmiten el ambiente del local y despiertan las ganas de ir.",
    url: "https://www.instagram.com/focacha.bcn/",
    instagram: "focacha.bcn",
    sector: "Gastronomía",
    videos: [{ src: "/clients/focacha/reel.mp4", title: "Reel Focacha" }],
  },
  {
    slug: "pigili-originals",
    name: "Pigili Originals",
    community: "+44k",
    previewVideo: "/clients/pigili-originals/preview.mp4",
    poster: "/clients/pigili-originals/poster.jpg",
    tagline: "Marca con carácter propio",
    description:
      "Producimos el contenido en redes de Pigili Originals. Reels y piezas sociales que refuerzan su identidad de marca y conectan con su comunidad con un estilo reconocible.",
    url: "https://www.instagram.com/pigili.originals/",
    instagram: "pigili.originals",
    sector: "Lifestyle",
    videos: [{ src: "/clients/pigili-originals/reel.mp4", title: "Reel Pigili" }],
  },
  {
    slug: "jansana",
    name: "Jansana",
    logo: "/clients/jansana.png",
    tagline: "Gluten freedom",
    description:
      "Creamos y gestionamos todo el contenido de Jansana en redes: reels, fotografía de producto y estrategia para conectar con su comunidad.",
    url: "",
    sector: "Alimentación",
    videos: [],
  },
  {
    slug: "prototipalo",
    name: "Prototipalo",
    logo: "/clients/prototipalo.png",
    tagline: "Producto e innovación",
    description:
      "Producción de contenido audiovisual y social media para Prototipalo. Piezas para redes que comunican su propuesta de forma clara, atractiva y con una estética a la altura del producto.",
    url: "",
    sector: "Tecnología",
    videos: [],
  },
  {
    slug: "macchina",
    name: "Macchina Pasta Bar",
    logo: "/clients/macchina.png",
    previewVideo: "/clients/macchina/preview.mp4",
    poster: "/clients/macchina/poster.jpg",
    tagline: "Pasta bar",
    description:
      "Contenido gastronómico para Macchina Pasta Bar: reels apetecibles que llevan gente al local.",
    url: "",
    sector: "Gastronomía",
    videos: [{ src: "/clients/macchina/reel.mp4", title: "Reel Macchina" }],
  },
  {
    slug: "ultramarinos-marin",
    name: "Ultramarinos Marín",
    logo: "/clients/ultramarinos.png",
    community: "+55,3k",
    previewVideo: "/clients/ultramarinos-marin/preview.mp4",
    poster: "/clients/ultramarinos-marin/poster.jpg",
    tagline: "Bar-asador · Barcelona",
    description:
      "Contenido para Ultramarinos Marín, bar-asador de producto en Balmes. Reels y piezas que transmiten la cocina honesta y artesanal del local.",
    url: "https://www.ultramarinosmarin.com/",
    instagram: "ultramarinosmarin",
    sector: "Gastronomía",
    videos: [
      { src: "/clients/ultramarinos-marin/reel.mp4", title: "Reel Ultramarinos" },
    ],
  },
  {
    slug: "ultrapaninos-marin",
    name: "Ultrapaninos Marín",
    tagline: "Bar de bocadillos · Barcelona",
    description:
      "Contenido para Ultrapaninos Marín, el brazo de bocadillos de alta gastronomía del grupo Marín. Piezas apetecibles que ponen en valor su pan, embutidos y producto de obrador.",
    url: "https://www.timeout.es/barcelona/es/restaurantes/ultrapaninos-marin",
    sector: "Gastronomía",
    videos: [],
  },
  {
    slug: "hijos-de-javier",
    name: "Hijos de Javier",
    previewVideo: "/clients/hijos-de-javier/preview.mp4",
    poster: "/clients/hijos-de-javier/poster.jpg",
    tagline: "Bodega · Sarrià, Barcelona",
    description:
      "Contenido para Hijos de Javier, bodega con personalidad en Sarrià. Reels y piezas que capturan su humor, tapas y ambiente de bar de toda la vida.",
    url: "https://www.instagram.com/hijosdejavier/",
    instagram: "hijosdejavier",
    sector: "Gastronomía",
    videos: [
      { src: "/clients/hijos-de-javier/reel.mp4", title: "Reel Hijos de Javier" },
    ],
  },
  {
    slug: "mimosas",
    name: "Mimosas",
    previewVideo: "/clients/mimosas/preview.mp4",
    poster: "/clients/mimosas/poster.jpg",
    tagline: "Marca lifestyle",
    description:
      "Creamos el contenido audiovisual de Mimosas: Reels y piezas para redes pensadas para destacar su producto y su estilo, con una estética cuidada y coherente en cada publicación.",
    url: "",
    sector: "Lifestyle",
    videos: [{ src: "/clients/mimosas/reel.mp4", title: "Reel Mimosas" }],
  },
  {
    slug: "mantis",
    name: "Mantis",
    community: "+22,6k",
    previewVideo: "/clients/mantis/preview.mp4",
    poster: "/clients/mantis/poster.jpg",
    tagline: "Cocina ecléctica · Barcelona",
    description:
      "Contenido para Mantis, restaurante de cocina ecléctica con influencia asiática y raíces catalanas. Piezas que reflejan su omakase y su cocina a la vista.",
    url: "https://www.restaurantemantis.com/",
    instagram: "mantisbcn",
    sector: "Gastronomía",
    videos: [{ src: "/clients/mantis/reel.mp4", title: "Reel Mantis" }],
  },
  {
    slug: "b-de-bocata",
    name: "B de Bocata",
    logo: "/clients/bdebocata.png",
    previewVideo: "/clients/b-de-bocata/preview.mp4",
    poster: "/clients/b-de-bocata/poster.jpg",
    tagline: "Bocatería · Barcelona",
    description:
      "Reels y contenido para redes de B de Bocata, con un estilo fresco y apetecible que pone el producto en el centro y despierta las ganas de visitarlos.",
    url: "",
    sector: "Gastronomía",
    videos: [{ src: "/clients/b-de-bocata/reel.mp4", title: "Reel B de Bocata" }],
  },
  {
    slug: "gozice",
    name: "Gozice",
    logo: "/clients/gozice.png",
    community: "+2k",
    tagline: "Marca de producto",
    description:
      "Contenido audiovisual y social media para Gozice: Reels y piezas para redes que mantienen la marca activa, reconocible y bien posicionada en su sector.",
    url: "",
    sector: "Producto",
    videos: [],
  },
  {
    slug: "perritos-calientes",
    name: "Perritos Calientes",
    logo: "/clients/perritos.png",
    tagline: "Hot dog & cocktails · Barcelona",
    description:
      "Reels y contenido para Perritos Calientes, capturando el ambiente nocturno y su producto —hot dogs y cócteles— con piezas dinámicas pensadas para redes.",
    url: "",
    sector: "Gastronomía",
    videos: [],
  },
  {
    slug: "thinking-home",
    name: "Thinking Home",
    logo: "/clients/thinkinghome.png",
    tagline: "Estudio de interiorismo",
    description:
      "Contenido audiovisual para el estudio de interiorismo Thinking Home: piezas que muestran sus proyectos con elegancia.",
    url: "",
    sector: "Interiorismo",
    videos: [],
  },
  {
    slug: "soccer-solver",
    name: "Soccer Solver",
    tagline: "IA para clubes de fútbol",
    description:
      "Contenido para Soccer Solver, software de inteligencia artificial que ayuda a clubes a tomar mejores decisiones en el mercado de fichajes.",
    url: "https://soccersolver.com/",
    instagram: "soccersolver",
    sector: "Tecnología",
    videos: [],
  },
  {
    slug: "aluxe",
    name: "Aluxe",
    community: "+1,1k",
    previewVideo: "/clients/aluxe/preview.mp4",
    poster: "/clients/aluxe/poster.jpg",
    tagline: "Streetwear · arte · diseño",
    description:
      "Contenido para ALUXE, concept store de streetwear, arte y diseño nacido en Barcelona. Piezas que reflejan su universo visual y sus lanzamientos.",
    url: "https://aluxestore.com/",
    instagram: "aluxe.store",
    sector: "Moda",
    videos: [{ src: "/clients/aluxe/reel.mp4", title: "Reel Aluxe" }],
  },
  {
    slug: "burmet",
    name: "Burmet",
    community: "+34,9k",
    tagline: "Hamburguesas a la brasa · Madrid",
    description:
      "Contenido gastronómico para Burmet, referencia en Madrid de hamburguesas y carnes a la brasa con locales en Chamartín, Arganzuela y Moncloa. Reels que ponen el producto y el horno de brasa en el centro.",
    url: "https://burmet.es/",
    instagram: "burmetmadrid",
    sector: "Gastronomía",
    videos: [],
  },
  // ── Pendientes de copy real ────────────────────────────────────────────────
  // Estas cuatro fichas siguen el patrón genérico de la casa porque no hay
  // fuente pública que confirme sector, claim ni servicios contratados.
  // Sustituir tagline / description / services por los datos reales.
  {
    slug: "gastroconnect",
    name: "Gastroconnect",
    tagline: "Sector gastronómico",
    description:
      "Producimos el contenido audiovisual y de social media de Gastroconnect: reels y piezas para redes que mantienen la marca activa y reconocible entre su audiencia.",
    url: "",
    sector: "Gastronomía",
    videos: [],
  },
  {
    slug: "te-pone",
    name: "Té Pone",
    tagline: "Marca de producto",
    description:
      "Contenido audiovisual y social media para Té Pone. Reels y piezas para redes pensadas para dar personalidad a la marca y sostener su presencia con una estética coherente.",
    url: "",
    sector: "Producto",
    videos: [],
  },
  {
    slug: "daddies",
    name: "Daddies",
    tagline: "Marca de producto",
    description:
      "Producimos contenido para redes de Daddies: reels y piezas sociales que refuerzan su identidad de marca y la mantienen activa frente a su comunidad.",
    url: "",
    sector: "Producto",
    videos: [],
  },
  {
    slug: "gota",
    name: "Gota",
    tagline: "Marca de producto",
    description:
      "Contenido audiovisual y de social media para Gota. Reels y piezas para redes que ponen el producto en valor con una línea visual cuidada y constante.",
    url: "",
    sector: "Producto",
    videos: [],
  },
];

export function getClient(slug: string): Client | undefined {
  return clients.find((c) => c.slug === slug);
}

/** Sectores presentes en el portfolio, sin repetir y en orden de aparición. */
export const sectors = [...new Set(clients.map((c) => c.sector))];

/** "+55,3k" → 55.3. Las cifras se guardan como texto con coma decimal. */
export function communitySize(client: Client): number {
  if (!client.community) return 0;
  return Number(client.community.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}

/**
 * Las marcas con más seguidores, de mayor a menor.
 *
 * `conReel` las limita a las que tienen vídeo. La home es una parrilla de
 * reels: una marca sin pieza sale como un recuadro vacío entre vídeos, y eso
 * la perjudica más que no aparecer. En cuanto tenga reel entra sola.
 */
export function topByCommunity(n: number, { conReel = false } = {}): Client[] {
  return clients
    .filter((c) => (conReel ? Boolean(c.previewVideo) : true))
    .sort((a, b) => communitySize(b) - communitySize(a))
    .slice(0, n);
}

/**
 * Reels listos para un hero, en el orden pedido. Se leen del portfolio en vez
 * de escribir rutas a mano: si un cliente cambia de vídeo o sale de la web, el
 * hero no se queda apuntando a un fichero que ya no existe.
 */
export function reelsFor(slugs: string[]) {
  return slugs
    .map((slug) => clients.find((c) => c.slug === slug))
    .filter((c): c is Client => Boolean(c?.previewVideo))
    .map((c) => ({ src: c.previewVideo as string, poster: c.poster }));
}
