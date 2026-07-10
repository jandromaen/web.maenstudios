export const podcastInfo = {
  name: "The After Podcast",
  playlistId: "PLsfyGPkvFTaOUeXy12Ss0Muk3CB6iu8Tb",
  playlistUrl:
    "https://www.youtube.com/playlist?list=PLsfyGPkvFTaOUeXy12Ss0Muk3CB6iu8Tb",
  channelUrl: "https://www.youtube.com/@MaenStudios",
  featuredVideoId: "G3Yb-1dMqso",
};

export const podcastValues = [
  {
    icon: "🤝",
    title: "Clientes y colaboradores",
    desc: "Invitamos a quienes trabajan con nosotros — marcas, emprendedores y creadores — a contar lo que no sale en un reel.",
  },
  {
    icon: "💬",
    title: "Conversaciones reales",
    desc: "Detrás de cada proyecto hay decisiones, dudas y aprendizajes. Aquí hablamos de eso, sin guion ni filtros.",
  },
  {
    icon: "✦",
    title: "Valor de marca",
    desc: "Más que un podcast: es la comunidad Maen. Un espacio donde el contenido audiovisual se conecta con las personas.",
  },
];

export type PodcastEpisode = {
  id: string;
  number: number;
  guest: string;
  role?: string;
  description: string;
};

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "G3Yb-1dMqso",
    number: 7,
    guest: "Jordi Grup Àtic",
    role: "Fundador, Grupo Àtic",
    description:
      "Coworkings en Barcelona y naves industriales en Madrid. Emprender, gestionar y crecer en distintos mercados.",
  },
  {
    id: "6lo-d-g3tZc",
    number: 6,
    guest: "Octavi Casanovas",
    role: "Outdoor Circuits · Valhalla Training",
    description:
      "Emprender, construir familia y los retos reales que hay detrás de hacer crecer un negocio.",
  },
  {
    id: "gefyRBDkAzE",
    number: 5,
    guest: "Aitor París",
    role: "Paitorrock",
    description:
      "Cuando cierran las puertas de tu gimnasio de un día para otro: resiliencia y reconstrucción.",
  },
  {
    id: "Tm7WZ5mjCRY",
    number: 4,
    guest: "Cristian Fidel",
    role: "Director de cine",
    description:
      "Rodajes, su película Buffalo, la IA en el cine y el camino hasta convertirse en director.",
  },
  {
    id: "GK0LBgkNV0k",
    number: 3,
    guest: "Hugo Roche",
    role: "PastéBcn",
    description:
      "Fundador de una de las pastelerías más reconocidas de Barcelona y referente internacional.",
  },
  {
    id: "qCeYu1GBrDg",
    number: 2,
    guest: "Chelo Meister",
    role: "Simón",
    description:
      "Emprendedor costarricense que comparte su visión y experiencia construyendo marca.",
  },
  {
    id: "zeO9hpSH9NM",
    number: 1,
    guest: "Víctor Cuevillas",
    role: "Director creativo · CGI",
    description:
      "Cómo descubrió el CGI, su evolución en el mundo visual y sus aspiraciones con grandes marcas.",
  },
  {
    id: "-sbBTdP5zqI",
    number: 0,
    guest: "Richi & Jandro",
    role: "Fundadores, Maen Studios",
    description:
      "Presentación del podcast: por qué emprendemos este proyecto y qué buscamos en cada conversación.",
  },
];
