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
  /**
   * Fotos de las sesiones, para las fichas que aún no tienen vídeo o para
   * acompañarlo. Sin esto la ficha de un cliente sin reel se queda en un texto
   * y un vacío, que es lo que le pasaba a once de las veintisiete.
   */
  photos?: string[];
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
    previewVideo: "/clients/jansana/preview.mp4",
    poster: "/clients/jansana/poster.jpg",
    tagline: "Gluten freedom",
    description:
      "Creamos y gestionamos todo el contenido de Jansana en redes: reels, fotografía de producto y estrategia para conectar con su comunidad.",
    url: "",
    sector: "Alimentación",
    videos: [{ src: "/clients/jansana/reel.mp4", title: "Pastelería sin gluten" }],
    photos: [
      "/clients/jansana/fotos/a.jpg",
      "/clients/jansana/fotos/c.jpg",
      "/clients/jansana/fotos/d.jpg",
      "/clients/jansana/fotos/b.jpg",
    ],
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
    previewVideo: "/clients/ultrapaninos-marin/preview.mp4",
    poster: "/clients/ultrapaninos-marin/poster.jpg",
    tagline: "Bar de bocadillos · Barcelona",
    description:
      "Contenido para Ultrapaninos Marín, el brazo de bocadillos de alta gastronomía del grupo Marín. Piezas apetecibles que ponen en valor su pan, embutidos y producto de obrador.",
    url: "https://www.timeout.es/barcelona/es/restaurantes/ultrapaninos-marin",
    sector: "Gastronomía",
    videos: [{ src: "/clients/ultrapaninos-marin/reel.mp4", title: "Reel Ultrapaninos Marín" }],
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
    previewVideo: "/clients/gozice/preview.mp4",
    poster: "/clients/gozice/poster.jpg",
    logo: "/clients/gozice.png",
    community: "+2k",
    tagline: "Marca de producto",
    description:
      "Contenido audiovisual y social media para Gozice: Reels y piezas para redes que mantienen la marca activa, reconocible y bien posicionada en su sector.",
    url: "",
    sector: "Producto",
    videos: [{ src: "/clients/gozice/reel.mp4", title: "Reel Gozice" }],
  },
  {
    slug: "perritos-calientes",
    name: "Perritos Calientes",
    previewVideo: "/clients/perritos-calientes/preview.mp4",
    poster: "/clients/perritos-calientes/poster.jpg",
    logo: "/clients/perritos.png",
    tagline: "Hot dog & cocktails · Barcelona",
    description:
      "Reels y contenido para Perritos Calientes, capturando el ambiente nocturno y su producto —hot dogs y cócteles— con piezas dinámicas pensadas para redes.",
    url: "",
    sector: "Gastronomía",
    videos: [{ src: "/clients/perritos-calientes/reel.mp4", title: "Reel Perritos Calientes" }],
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
    previewVideo: "/clients/burmet/preview.mp4",
    poster: "/clients/burmet/poster.jpg",
    tagline: "Hamburguesas a la brasa · Madrid",
    description:
      "Contenido gastronómico para Burmet, referencia en Madrid de hamburguesas y carnes a la brasa con locales en Chamartín, Arganzuela y Moncloa. Reels que ponen el producto y el horno de brasa en el centro.",
    url: "https://burmet.es/",
    instagram: "burmetmadrid",
    sector: "Gastronomía",
    videos: [{ src: "/clients/burmet/reel.mp4", title: "Reel Burmet" }],
  },
  // ── Pendientes de copy real ────────────────────────────────────────────────
  // Estas cuatro fichas siguen el patrón genérico de la casa porque no hay
  // fuente pública que confirme sector, claim ni servicios contratados.
  // Sustituir tagline / description / services por los datos reales.
  {
    slug: "gastroconnect",
    name: "Gastroconnect",
    previewVideo: "/clients/gastroconnect/preview.mp4",
    poster: "/clients/gastroconnect/poster.jpg",
    tagline: "Sector gastronómico",
    description:
      "Producimos el contenido audiovisual y de social media de Gastroconnect: reels y piezas para redes que mantienen la marca activa y reconocible entre su audiencia.",
    url: "",
    sector: "Gastronomía",
    videos: [{ src: "/clients/gastroconnect/reel.mp4", title: "Reel Gastroconnect" }],
  },
  {
    slug: "te-pone",
    name: "Té Pone",
    previewVideo: "/clients/te-pone/preview.mp4",
    poster: "/clients/te-pone/poster.jpg",
    tagline: "Marca de producto",
    description:
      "Contenido audiovisual y social media para Té Pone. Reels y piezas para redes pensadas para dar personalidad a la marca y sostener su presencia con una estética coherente.",
    url: "",
    sector: "Producto",
    videos: [{ src: "/clients/te-pone/reel.mp4", title: "Reel Té Pone" }],
  },
  {
    slug: "daddies",
    name: "Daddies",
    previewVideo: "/clients/daddies/preview.mp4",
    poster: "/clients/daddies/poster.jpg",
    tagline: "Marca de producto",
    description:
      "Producimos contenido para redes de Daddies: reels y piezas sociales que refuerzan su identidad de marca y la mantienen activa frente a su comunidad.",
    url: "",
    sector: "Producto",
    videos: [{ src: "/clients/daddies/reel.mp4", title: "Reel Daddies" }],
  },
  {
    slug: "gota",
    name: "Gota",
    previewVideo: "/clients/gota/preview.mp4",
    poster: "/clients/gota/poster.jpg",
    tagline: "Marca de producto",
    description:
      "Contenido audiovisual y de social media para Gota. Reels y piezas para redes que ponen el producto en valor con una línea visual cuidada y constante.",
    url: "",
    sector: "Producto",
    videos: [{ src: "/clients/gota/reel.mp4", title: "Reel Gota" }],
    photos: [
      "/clients/gota/fotos/1.jpg",
      "/clients/gota/fotos/2.jpg",
      "/clients/gota/fotos/3.jpg",
      "/clients/gota/fotos/4.jpg",
    ],
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
/**
 * Reparto de reels para los heroes de las páginas del menú.
 *
 * Antes cada página llevaba su terna escrita a mano en su propio fichero, y
 * con cinco listas sueltas pasó lo previsible: canallita salía en servicios y
 * en talents, y focacha en clientes y en blog. Repartiendo desde un solo sitio
 * eso no puede repetirse, porque la unicidad deja de depender de que alguien
 * se acuerde.
 *
 * Cada página conserva su preferencia editorial —talents pide marcas de
 * creador, clientes pide hostelería— y solo pierde una elección si otra
 * página la ha cogido antes. Lo que falte se rellena con el resto del
 * catálogo, así que las tres siempre están.
 *
 * El orden de esta lista es el orden de preferencia: quien va primero gana
 * cuando dos páginas piden lo mismo.
 */
const HERO_PREFERIDOS = {
  clientes: ["mantis", "b-de-bocata", "focacha"],
  servicios: ["canallita", "ultramarinos-marin", "macala"],
  blog: ["hijos-de-javier", "gran-tonino", "macchina"],
  talents: ["pigili-originals", "mimosas", "aluxe"],
} as const;

export type PaginaConHero = keyof typeof HERO_PREFERIDOS;

const REPARTO_HERO: Record<PaginaConHero, string[]> = (() => {
  const tomados = new Set<string>();
  const salida = {} as Record<PaginaConHero, string[]>;

  for (const pagina of Object.keys(HERO_PREFERIDOS) as PaginaConHero[]) {
    const elegidos: string[] = [];

    for (const slug of HERO_PREFERIDOS[pagina]) {
      if (elegidos.length === 3) break;
      const cliente = clients.find((c) => c.slug === slug);
      if (cliente?.previewVideo && !tomados.has(slug)) {
        elegidos.push(slug);
        tomados.add(slug);
      }
    }

    /* Relleno: si una preferencia ya estaba cogida —o si esa marca se retira
       del portfolio— la terna se completa sola en vez de quedarse coja. */
    for (const cliente of clients) {
      if (elegidos.length === 3) break;
      if (!cliente.previewVideo || tomados.has(cliente.slug)) continue;
      elegidos.push(cliente.slug);
      tomados.add(cliente.slug);
    }

    salida[pagina] = elegidos;
  }

  return salida;
})();

/** Slugs que ya usa alguna página del menú en su hero. */
export const REELS_DE_MENU = new Set(
  Object.values(REPARTO_HERO).flat(),
);

/** Los tres reels del hero de una página del menú. */
export function reelsDeHero(pagina: PaginaConHero) {
  return reelsFor(REPARTO_HERO[pagina]);
}

/**
 * Reels del hero de una landing, a partir de sus propios clientes.
 *
 * Una landing tiene que enseñar marcas de su ciudad o de su sector, así que
 * ahí no se puede imponer la unicidad como en el menú. Lo que sí se puede es
 * ordenar: primero las que no salen en ninguna página del menú, y solo se
 * recurre a las repetidas si no hay suficientes propias. Con eso, la landing
 * de Barcelona deja de repetir ninguna y la de Madrid baja de dos a una.
 */
export function reelsDeLanding(slugs: string[]) {
  const propias = slugs.filter((slug) =>
    clients.some((c) => c.slug === slug && c.previewVideo),
  );
  const sinRepetir = propias.filter((slug) => !REELS_DE_MENU.has(slug));
  const repetidas = propias.filter((slug) => REELS_DE_MENU.has(slug));
  return reelsFor([...sinRepetir, ...repetidas]);
}

/**
 * Reels para rellenar un hero que no llega a tres piezas propias —una landing
 * de ciudad recién abierta, por ejemplo—. Deja fuera los que ya salen en el
 * menú para no repetir de una sección a otra.
 */
export function reelsDeReserva() {
  return reelsFor(
    clients
      .filter((c) => c.previewVideo && !REELS_DE_MENU.has(c.slug))
      .map((c) => c.slug),
  );
}

export function reelsFor(slugs: string[]) {
  return slugs
    .map((slug) => clients.find((c) => c.slug === slug))
    .filter((c): c is Client => Boolean(c?.previewVideo))
    .map((c) => ({ src: c.previewVideo as string, poster: c.poster }));
}
