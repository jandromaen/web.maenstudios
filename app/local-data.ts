/**
 * Contenido de las landings locales (Barcelona y Madrid).
 * Cada ciudad tiene texto propio: Google penaliza las landings de ciudad
 * clonadas donde solo cambia el nombre del municipio.
 */

export type LocalBlock = {
  title: string;
  body: string;
};

export type LocalLanding = {
  /** Debe coincidir con Office.city de seo-config.ts */
  city: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  lead: string;
  intro: string[];
  /** Bloques de contenido con H2 propios */
  blocks: LocalBlock[];
  /** Zonas y barrios: capta búsquedas de cola larga */
  areasTitle: string;
  areas: string[];
  /** Sectores para los que producimos en esa ciudad */
  sectors: string[];
  /** Slugs de clientes que se muestran como prueba social */
  clientSlugs: string[];
  clientsTitle: string;
  clientsIntro: string;
  faqs: { q: string; a: string }[];
};

export const localLandings: LocalLanding[] = [
  {
    city: "Barcelona",
    path: "/agencia-de-contenido-barcelona",
    metaTitle: "Agencia de contenido para redes sociales en Barcelona",
    metaDescription:
      "Agencia de creación de contenido en Barcelona, oficina en Carrer del Bruc 61 (Eixample). Reels, TikToks, producción audiovisual y community management para restaurantes, moda y lifestyle. Respuesta en 24h.",
    keywords: [
      "agencia de contenido Barcelona",
      "agencia redes sociales Barcelona",
      "productora audiovisual Barcelona",
      "community manager Barcelona",
      "agencia de reels Barcelona",
      "grabar reels Barcelona",
      "agencia marketing contenidos Barcelona",
    ],
    eyebrow: "Barcelona",
    h1: "Agencia de contenido para redes sociales en Barcelona",
    lead: "Somos el equipo de contenido de marcas y negocios de Barcelona: pensamos la idea, la grabamos en tu local y la publicamos con una línea coherente. Reels, TikToks, producción audiovisual y community management.",
    intro: [
      "Maen Studios nació en Barcelona y aquí seguimos, con oficina en el Carrer del Bruc 61, en pleno Eixample. Es la ciudad donde hemos producido la mayor parte de nuestro trabajo: conocemos su hostelería, su ritmo y el tipo de contenido que funciona donde compites por la atención con miles de negocios que también publican cada día.",
      "Trabajamos sobre todo con restauración, moda, lifestyle y marcas de producto. No enviamos un freelance con un móvil: llega un equipo con dirección creativa, cámara y un plan de contenido pensado para que las piezas se sostengan mes a mes, no solo el día del rodaje.",
    ],
    blocks: [
      {
        title: "Rodajes en tu local, sin complicaciones",
        body: "Nos desplazamos por toda Barcelona con el equipo montado. Una jornada de rodaje bien planificada da material para varias semanas de publicaciones: producto, ambiente, equipo, procesos y las piezas de gancho que realmente paran el scroll. Tú sigues con tu negocio abierto mientras nosotros grabamos.",
      },
      {
        title: "Contenido pensado para el público de la ciudad",
        body: "Un restaurante de Sarrià, una marca de streetwear del Raval y una coctelería del Eixample no hablan igual ni buscan al mismo cliente. Adaptamos el tono, el formato y la referencia cultural a quién tienes que llegar: vecino de barrio, público joven de fin de semana o visitante que decide dónde comer desde Instagram.",
      },
      {
        title: "Community management con contexto local",
        body: "Gestionamos el día a día de tus redes sabiendo qué pasa en la ciudad: temporada, eventos, festivos locales y la conversación del sector. Calendario editorial, publicación, respuesta a comentarios y mensajes, y seguimiento de lo que de verdad mueve reservas y visitas.",
      },
    ],
    areasTitle: "Zonas de Barcelona donde producimos",
    areas: [
      "Eixample",
      "Gràcia",
      "Sarrià-Sant Gervasi",
      "Ciutat Vella y el Born",
      "Sant Martí y Poblenou",
      "Sants-Montjuïc",
      "Les Corts",
      "Área metropolitana: Hospitalet, Badalona y Sant Cugat",
    ],
    sectors: [
      "Restaurantes, bares y coctelerías",
      "Moda y streetwear",
      "Lifestyle y bienestar",
      "Marcas de producto y retail",
      "Interiorismo y arquitectura",
      "Tecnología y startups",
    ],
    clientSlugs: [
      "ultramarinos-marin",
      "fortuna-tonino",
      "focacha",
      "mantis",
      "tram-tram",
      "perritos-calientes",
    ],
    clientsTitle: "Marcas de Barcelona que ya trabajan con nosotros",
    clientsIntro:
      "Buena parte de nuestro portfolio es hostelería y marca local de Barcelona. Estos son algunos de los proyectos que gestionamos desde aquí.",
    faqs: [
      {
        q: "¿Cuánto cuesta una agencia de contenido en Barcelona?",
        a: "Depende del volumen y de si hay rodaje presencial. Los planes mensuales de Maen Studios suelen partir de un pack de 8 a 12 piezas al mes con dirección creativa, grabación en tu local y edición incluida. Escríbenos y te preparamos un presupuesto cerrado sin compromiso.",
      },
      {
        q: "¿Dónde está la oficina de Maen Studios en Barcelona?",
        a: "En el Carrer del Bruc 61, 08009 Barcelona, en el Eixample. Puedes escribirnos o llamarnos al +34 688 629 688 y concertar una visita para ver el plan de contenido en persona.",
      },
      {
        q: "¿En qué zonas de Barcelona grabáis?",
        a: "En toda la ciudad y en el área metropolitana: Eixample, Gràcia, Sarrià, Ciutat Vella, Poblenou, Sants, Les Corts, y también Hospitalet, Badalona o Sant Cugat. El desplazamiento dentro de Barcelona está incluido en los planes mensuales.",
      },
      {
        q: "¿Trabajáis con restaurantes de Barcelona?",
        a: "Sí, es nuestro sector más fuerte. Producimos contenido para bares, restaurantes, coctelerías y bocaterías de la ciudad: Ultramarinos Marín, Fortuna Tonino, Mantis, Tram-Tram, Focacha o Perritos Calientes, entre otros.",
      },
      {
        q: "¿Puedo contratar solo la grabación sin community management?",
        a: "Sí. Puedes contratar únicamente producción audiovisual (grabamos y editamos, tú publicas) o el servicio completo con calendario y gestión diaria de las redes. Muchos clientes empiezan solo con producción y amplían después.",
      },
    ],
  },
  {
    city: "Madrid",
    path: "/agencia-de-contenido-madrid",
    metaTitle: "Agencia de contenido para redes sociales en Madrid",
    metaDescription:
      "Agencia de creación de contenido en Madrid, oficina en Calle de Génova 3. Reels, TikToks, producción audiovisual y community management para marcas y restaurantes. Respuesta en 24h.",
    keywords: [
      "agencia de contenido Madrid",
      "agencia redes sociales Madrid",
      "productora audiovisual Madrid",
      "community manager Madrid",
      "agencia de reels Madrid",
      "grabar reels Madrid",
      "agencia marketing contenidos Madrid",
      "agencia contenido Génova Madrid",
    ],
    eyebrow: "Madrid",
    h1: "Agencia de contenido para redes sociales en Madrid",
    lead: "Abrimos oficina en Madrid, en Calle de Génova 3. El mismo equipo y el mismo estándar de producción que llevamos años aplicando en Barcelona, ahora a pie de calle en el centro de Madrid.",
    intro: [
      "Maen Studios llega a Madrid con un portfolio ya construido: decenas de marcas para las que producimos Reels, TikToks y campañas de contenido cada mes. Nuestra oficina de Génova 3 nos sitúa en el centro, a minutos de Chamberí, Salamanca, Chueca y Malasaña, que es donde se concentra buena parte de la hostelería y el retail que necesita contenido constante.",
      "No somos una agencia que subcontrata: dirección creativa, rodaje y edición salen del mismo equipo. Eso significa un solo interlocutor, un criterio visual coherente y entregas que no dependen de encadenar proveedores.",
    ],
    blocks: [
      {
        title: "Oficina en Génova 3, rodajes en toda la Comunidad",
        body: "Estar en el centro nos permite cubrir rodajes en el mismo día por Madrid capital y desplazarnos sin fricción a Alcobendas, Pozuelo, Las Rozas o Majadahonda. Grabamos en tu local, en plató o en exteriores, según lo que pida la pieza.",
      },
      {
        title: "Un mercado más competido pide contenido mejor",
        body: "En Madrid casi todas las marcas publican, así que la diferencia no está en publicar más sino en publicar con criterio. Trabajamos el gancho de los primeros segundos, el ritmo de montaje y una línea visual reconocible para que tu contenido no se confunda con el de la competencia de la misma calle.",
      },
      {
        title: "Un equipo de contenido externo, no un freelance suelto",
        body: "Recibes un plan mensual con formatos definidos, calendario y entregas fijas. Si necesitas escalar en campaña —más piezas, creadores UGC, un rodaje mayor— lo montamos con el mismo equipo, sin cambiar de proveedor ni de estilo a mitad de camino.",
      },
    ],
    areasTitle: "Zonas de Madrid donde producimos",
    areas: [
      "Chamberí",
      "Salamanca",
      "Chueca y Justicia",
      "Malasaña y Centro",
      "Retiro",
      "Chamartín",
      "Moncloa-Aravaca",
      "Comunidad de Madrid: Alcobendas, Pozuelo, Las Rozas y Majadahonda",
    ],
    sectors: [
      "Restaurantes, bares y coctelerías",
      "Moda y retail",
      "Lifestyle, belleza y bienestar",
      "Marcas de producto y ecommerce",
      "Servicios profesionales y despachos",
      "Tecnología y startups",
    ],
    clientSlugs: [
      // Burmet abre la lista: es el único cliente con local en Madrid, así que
      // la landing deja de ilustrarse solo con trabajo de Barcelona.
      "burmet",
      "macala",
      "canallita",
      "jansana",
      "aluxe",
    ],
    clientsTitle: "El trabajo que traemos a Madrid",
    clientsIntro:
      "Nuestra oficina de Madrid es nueva; nuestro portfolio no. Estos son algunos de los proyectos que producimos para marcas de toda España y que marcan el estándar de lo que vas a recibir.",
    faqs: [
      {
        q: "¿Dónde está la oficina de Maen Studios en Madrid?",
        a: "En Calle de Génova 3, 28004 Madrid, en pleno centro y a un paso de Chamberí y Chueca. Puedes escribirnos y concertar una visita para ver el plan de contenido en persona.",
      },
      {
        q: "¿Cuánto cuesta una agencia de contenido en Madrid?",
        a: "Trabajamos con planes mensuales que incluyen dirección creativa, rodaje y edición. Lo habitual es un pack de 8 a 12 piezas al mes, ajustado a tu sector y a la frecuencia con la que quieras publicar. Te preparamos un presupuesto cerrado sin compromiso.",
      },
      {
        q: "¿Grabáis en toda la Comunidad de Madrid?",
        a: "Sí. Cubrimos Madrid capital y municipios como Alcobendas, Pozuelo de Alarcón, Las Rozas o Majadahonda. Desde Génova 3 llegamos a cualquier punto de la ciudad en el mismo día de rodaje.",
      },
      {
        q: "¿Sois nuevos en Madrid? ¿Con qué marcas habéis trabajado?",
        a: "La oficina de Madrid es reciente, pero el equipo lleva años produciendo contenido para marcas de restauración, moda, lifestyle y tecnología. Puedes ver el portfolio completo en la sección de clientes: el mismo equipo y el mismo estándar te atienden en Madrid.",
      },
    ],
  },
];

export function getLocalLanding(city: string): LocalLanding | undefined {
  return localLandings.find(
    (l) => l.city.toLowerCase() === city.toLowerCase(),
  );
}
