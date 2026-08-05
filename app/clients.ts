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
  services: string[];
  videos: ClientVideo[];
  /** Seguidores en redes (portfolio Canva) */
  community?: string;
  /** Vídeo vertical de preview para grids */
  previewVideo?: string;
};

// NOTA: previewVideo alineado con Portfolio Canva (y9j1nbo6190zkc0) cuando hay asset local.
// Marcas del Canva sin ficha en web: Cooltra, Freixenet, Gastroconnect, Burmet, Té Pone, Daddies, Gota.
export const clients: Client[] = [
  {
    slug: "macala",
    name: "Macala",
    logo: "/clients/macala.png",
    community: "+10,4k",
    previewVideo: "/clients/macala/reel.mp4",
    tagline: "Alpargatas hechas en España",
    description:
      "Creamos el contenido en redes de Macala, marca de alpargatas y ropa sostenible hecha en España. Reels, UGC y estrategia con su sello: tradición y producto de calidad.",
    url: "https://macala.es/",
    services: ["Reels", "UGC", "Estrategia"],
    videos: [{ src: "/clients/macala/reel.mp4", title: "Reel Macala" }],
  },
  {
    slug: "fortuna-tonino",
    name: "Fortuna Tonino",
    logo: "/clients/fortuna-tonino/logo.png",
    previewVideo: "/clients/fortuna-tonino/reel.mp4",
    tagline: "Good luck, better vibes · Barcelona",
    description:
      "Contenido para Fortuna Tonino, coctelería y ambiente nocturno en Barcelona. Reels que transmiten la energía del local y llenan sus noches.",
    url: "https://www.fortunatonino.com/",
    services: ["Reels", "Social media", "Eventos"],
    videos: [{ src: "/clients/fortuna-tonino/reel.mp4", title: "Reel Fortuna" }],
  },
  {
    slug: "gran-tonino",
    name: "Gran Tonino",
    community: "+14,5k",
    previewVideo: "/clients/gran-tonino/reel.mp4",
    tagline: "Piano bar · Barcelona",
    description:
      "Contenido para Gran Tonino Piano Club: cenas, cócteles y música en directo con un piano de cola como protagonista. Piezas que capturan la experiencia del local.",
    url: "https://www.grantonino.com/",
    services: ["Reels", "Social media", "Eventos"],
    videos: [{ src: "/clients/gran-tonino/reel.mp4", title: "Reel Gran Tonino" }],
  },
  {
    slug: "canallita",
    name: "Canallita",
    community: "+63k",
    previewVideo: "/clients/canallita/reel.mp4",
    tagline: "Moda para machos",
    description:
      "Producción de contenido y reels para Canallita, marca de moda masculina con una personalidad muy marcada.",
    url: "https://canallita.com/",
    services: ["Reels", "Social media", "Moda"],
    videos: [{ src: "/clients/canallita/reel.mp4", title: "Reel Canallita" }],
  },
  {
    slug: "tram-tram",
    name: "Tram-Tram",
    community: "+15k",
    previewVideo: "/clients/tram-tram/reel.mp4",
    tagline: "Restaurante familiar · Sarrià, Barcelona",
    description:
      "Contenido gastronómico para Tram-Tram, restaurante familiar de la zona alta de Barcelona con 35 años de historia. Piezas que ponen en valor su cocina y sus platos.",
    url: "https://tram-tram.com/",
    services: ["Reels", "Gastronomía", "Social media"],
    videos: [{ src: "/clients/tram-tram/reel.mp4", title: "Reel Tram-Tram" }],
  },
  {
    slug: "besmaya",
    name: "Besmaya",
    community: "+26k",
    previewVideo: "/clients/besmaya/reel.mp4",
    tagline: "Proyecto musical",
    description:
      "Contenido audiovisual para el proyecto musical Besmaya: piezas para redes que acompañan su música y su gira.",
    url: "https://www.somosbesmaya.com/",
    services: ["Reels", "Música", "Social media"],
    videos: [{ src: "/clients/besmaya/reel.mp4", title: "Reel Besmaya" }],
  },
  {
    slug: "focacha",
    name: "Focacha BCN",
    community: "+6k",
    previewVideo: "/clients/focacha/reel.mp4",
    tagline: "Focaccia · Barcelona",
    description:
      "Focacha BCN es el speakeasy de focaccia del que todo el mundo habla en Barcelona. Creamos sus Reels y contenido en redes: piezas con ritmo y estética que transmiten el ambiente del local y despiertan las ganas de ir.",
    url: "https://www.instagram.com/focacha.bcn/",
    services: ["Reels", "Gastronomía"],
    videos: [{ src: "/clients/focacha/reel.mp4", title: "Reel Focacha" }],
  },
  {
    slug: "pigili-originals",
    name: "Pigili Originals",
    community: "+44k",
    previewVideo: "/clients/pigili-originals/reel.mp4",
    tagline: "Marca con carácter propio",
    description:
      "Producimos el contenido en redes de Pigili Originals. Reels y piezas sociales que refuerzan su identidad de marca y conectan con su comunidad con un estilo reconocible.",
    url: "https://www.instagram.com/pigili.originals/",
    services: ["Reels", "Social media"],
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
    services: ["Reels", "Estrategia", "Fotografía"],
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
    services: ["Reels", "Social media"],
    videos: [],
  },
  {
    slug: "macchina",
    name: "Macchina Pasta Bar",
    logo: "/clients/macchina.png",
    previewVideo: "/clients/macchina/reel.mp4",
    tagline: "Pasta bar",
    description:
      "Contenido gastronómico para Macchina Pasta Bar: reels apetecibles que llevan gente al local.",
    url: "",
    services: ["Reels", "Gastronomía", "Social media"],
    videos: [{ src: "/clients/macchina/reel.mp4", title: "Reel Macchina" }],
  },
  {
    slug: "ultramarinos-marin",
    name: "Ultramarinos Marín",
    logo: "/clients/ultramarinos.png",
    community: "+55,3k",
    previewVideo: "/clients/ultramarinos-marin/reel.mp4",
    tagline: "Bar-asador · Barcelona",
    description:
      "Contenido para Ultramarinos Marín, bar-asador de producto en Balmes. Reels y piezas que transmiten la cocina honesta y artesanal del local.",
    url: "https://www.ultramarinosmarin.com/",
    services: ["Reels", "Gastronomía", "Social media"],
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
    services: ["Reels", "Gastronomía", "Social media"],
    videos: [],
  },
  {
    slug: "hijos-de-javier",
    name: "Hijos de Javier",
    previewVideo: "/clients/hijos-de-javier/reel.mp4",
    tagline: "Bodega · Sarrià, Barcelona",
    description:
      "Contenido para Hijos de Javier, bodega con personalidad en Sarrià. Reels y piezas que capturan su humor, tapas y ambiente de bar de toda la vida.",
    url: "https://www.instagram.com/hijosdejavier/",
    services: ["Reels", "Gastronomía", "Social media"],
    videos: [
      { src: "/clients/hijos-de-javier/reel.mp4", title: "Reel Hijos de Javier" },
    ],
  },
  {
    slug: "mimosas",
    name: "Mimosas",
    previewVideo: "/clients/mimosas/reel.mp4",
    tagline: "Marca lifestyle",
    description:
      "Creamos el contenido audiovisual de Mimosas: Reels y piezas para redes pensadas para destacar su producto y su estilo, con una estética cuidada y coherente en cada publicación.",
    url: "",
    services: ["Reels", "Social media"],
    videos: [{ src: "/clients/mimosas/reel.mp4", title: "Reel Mimosas" }],
  },
  {
    slug: "mantis",
    name: "Mantis",
    community: "+22,6k",
    previewVideo: "/clients/mantis/reel.mp4",
    tagline: "Cocina ecléctica · Barcelona",
    description:
      "Contenido para Mantis, restaurante de cocina ecléctica con influencia asiática y raíces catalanas. Piezas que reflejan su omakase y su cocina a la vista.",
    url: "https://www.restaurantemantis.com/",
    services: ["Reels", "Gastronomía", "Social media"],
    videos: [{ src: "/clients/mantis/reel.mp4", title: "Reel Mantis" }],
  },
  {
    slug: "b-de-bocata",
    name: "B de Bocata",
    logo: "/clients/bdebocata.png",
    previewVideo: "/clients/b-de-bocata/reel.mp4",
    tagline: "Bocatería · Barcelona",
    description:
      "Reels y contenido para redes de B de Bocata, con un estilo fresco y apetecible que pone el producto en el centro y despierta las ganas de visitarlos.",
    url: "",
    services: ["Reels", "Gastronomía"],
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
    services: ["Reels", "Social media"],
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
    services: ["Reels", "Social media"],
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
    services: ["Reels", "Interiorismo", "Estrategia"],
    videos: [],
  },
  {
    slug: "soccer-solver",
    name: "Soccer Solver",
    tagline: "IA para clubes de fútbol",
    description:
      "Contenido para Soccer Solver, software de inteligencia artificial que ayuda a clubes a tomar mejores decisiones en el mercado de fichajes.",
    url: "https://soccersolver.com/",
    services: ["Reels", "Social media", "Marca"],
    videos: [],
  },
  {
    slug: "mr-crop",
    name: "Mr. Crop",
    tagline: "Marca de producto",
    description:
      "Producimos contenido audiovisual y de social media para Mr. Crop. Reels y piezas que dan personalidad a la marca y mantienen su presencia activa en redes.",
    url: "",
    services: ["Reels", "Social media"],
    videos: [],
  },
  {
    slug: "aluxe",
    name: "Aluxe",
    tagline: "Streetwear · arte · diseño",
    description:
      "Contenido para ALUXE, concept store de streetwear, arte y diseño nacido en Barcelona. Piezas que reflejan su universo visual y sus lanzamientos.",
    url: "https://aluxestore.com/",
    services: ["Reels", "Social media", "Moda"],
    videos: [],
  },
];

export function getClient(slug: string): Client | undefined {
  return clients.find((c) => c.slug === slug);
}
