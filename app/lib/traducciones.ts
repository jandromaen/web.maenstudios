import type { Idioma } from "./idioma";

/**
 * Diccionario de traducción, indexado por el texto en español.
 *
 * Va por texto original y no por claves (`nav.servicios`) a propósito. Con
 * claves habría que reescribir quince ficheros de páginas para envolver cada
 * literal, y cada texto nuevo nacería sin traducir hasta que alguien se
 * acordara de darle nombre. Aquí el original ES la clave: lo que no esté en
 * esta tabla simplemente se queda en español, que es el idioma oficial y la
 * caída correcta.
 *
 * Cómo ampliarlo: se añade la frase en español tal cual aparece en pantalla,
 * con sus tildes y su puntuación, y sus dos traducciones. No hace falta tocar
 * nada más.
 */

type Entrada = { en: string; ca: string };

export const TRADUCCIONES: Record<string, Entrada> = {
  /* ── Navegación ─────────────────────────────────────────────────────── */
  Home: { en: "Home", ca: "Inici" },
  Work: { en: "Work", ca: "Work" },
  Services: { en: "Services", ca: "Serveis" },
  News: { en: "News", ca: "News" },
  Podcast: { en: "Podcast", ca: "Podcast" },
  Talents: { en: "Talents", ca: "Talents" },
  Contact: { en: "Contact", ca: "Contacte" },
  Servicios: { en: "Services", ca: "Serveis" },
  Clientes: { en: "Clients", ca: "Clients" },
  Blog: { en: "Blog", ca: "Blog" },
  Contacto: { en: "Contact", ca: "Contacte" },
  Oficinas: { en: "Offices", ca: "Oficines" },
  Estudio: { en: "Studio", ca: "Estudi" },
  Síguenos: { en: "Follow us", ca: "Segueix-nos" },
  Email: { en: "Email", ca: "Email" },

  /* ── Botones y llamadas a la acción ─────────────────────────────────── */
  "Pedir presupuesto": { en: "Request a quote", ca: "Demanar pressupost" },
  "Ver clientes": { en: "See clients", ca: "Veure clients" },
  "Ver nuestro trabajo": { en: "See our work", ca: "Veure la nostra feina" },
  "Ver todos los clientes →": {
    en: "See all clients →",
    ca: "Veure tots els clients →",
  },
  "Ver todos los servicios": {
    en: "See all services",
    ca: "Veure tots els serveis",
  },
  "Quiero algo así": { en: "I want something like this", ca: "Vull alguna cosa així" },
  "Quiero una campaña": { en: "I want a campaign", ca: "Vull una campanya" },
  "Soy creador/a": { en: "I'm a creator", ca: "Sóc creador/a" },
  "Entrar en la red": { en: "Join the network", ca: "Entrar a la xarxa" },
  "Proponerme como invitado": {
    en: "Pitch myself as a guest",
    ca: "Proposar-me com a convidat",
  },
  "Mostrar más": { en: "Show more", ca: "Mostrar-ne més" },
  "Ver caso →": { en: "See case →", ca: "Veure cas →" },
  "Ver el caso": { en: "See the case", ca: "Veure el cas" },
  "Visitar web": { en: "Visit website", ca: "Visitar web" },
  "Ver marcas": { en: "See brands", ca: "Veure marques" },
  "Ver en Maps →": { en: "View on Maps →", ca: "Veure a Maps →" },
  "← Volver a work": { en: "← Back to work", ca: "← Tornar a work" },
  Enviar: { en: "Send", ca: "Enviar" },
  "Enviando…": { en: "Sending…", ca: "Enviant…" },
  "Escríbenos": { en: "Write to us", ca: "Escriu-nos" },
  "Aceptar cookies": { en: "Accept cookies", ca: "Acceptar galetes" },

  /* ── Formularios ────────────────────────────────────────────────────── */
  "Nombre *": { en: "First name *", ca: "Nom *" },
  Apellido: { en: "Last name", ca: "Cognom" },
  "Correo electrónico *": { en: "Email address *", ca: "Correu electrònic *" },
  Teléfono: { en: "Phone", ca: "Telèfon" },
  "Cuéntanos tu proyecto": { en: "Tell us about your project", ca: "Explica'ns el teu projecte" },
  "Presupuesto estimado": { en: "Estimated budget", ca: "Pressupost estimat" },
  "Selecciona un tramo": { en: "Select a range", ca: "Selecciona un tram" },
  "Tu nombre": { en: "Your first name", ca: "El teu nom" },
  "Tu apellido": { en: "Your last name", ca: "El teu cognom" },
  "¿Qué contenido necesitas?": {
    en: "What content do you need?",
    ca: "Quin contingut necessites?",
  },
  "Instagram o TikTok": { en: "Instagram or TikTok", ca: "Instagram o TikTok" },
  "Dónde puedes grabar": { en: "Where you can film", ca: "On pots gravar" },
  "Selecciona una zona": { en: "Select an area", ca: "Selecciona una zona" },
  "Enlace a tu trabajo *": { en: "Link to your work *", ca: "Enllaç a la teva feina *" },
  "Qué tipo de contenido haces": {
    en: "What kind of content you make",
    ca: "Quin tipus de contingut fas",
  },
  "A qué te dedicas": { en: "What you do", ca: "A què et dediques" },
  "Instagram o web": { en: "Instagram or website", ca: "Instagram o web" },
  "¿De qué te gustaría hablar? *": {
    en: "What would you like to talk about? *",
    ca: "De què t'agradaria parlar? *",
  },

  /* ── Etiquetas y secciones recurrentes ──────────────────────────────── */
  "Respuesta en 24h": { en: "We reply within 24h", ca: "Resposta en 24h" },
  Oficina: { en: "Office", ca: "Oficina" },
  Comunidad: { en: "Community", ca: "Comunitat" },
  Marcas: { en: "Brands", ca: "Marques" },
  Desde: { en: "Since", ca: "Des de" },
  Sector: { en: "Sector", ca: "Sector" },
  Cobertura: { en: "Coverage", ca: "Cobertura" },
  FAQ: { en: "FAQ", ca: "FAQ" },
  Portfolio: { en: "Portfolio", ca: "Portfolio" },
  Candidatura: { en: "Application", ca: "Candidatura" },
  Formulario: { en: "Form", ca: "Formulari" },
  Fundadores: { en: "Founders", ca: "Fundadors" },
  "¿Empezamos?": { en: "Shall we start?", ca: "Comencem?" },
  "Cómo trabajamos": { en: "How we work", ca: "Com treballem" },
  Alcance: { en: "Scope", ca: "Abast" },
  "Preguntas frecuentes": { en: "Frequently asked questions", ca: "Preguntes freqüents" },
  "También te puede interesar": {
    en: "You might also like",
    ca: "També et pot interessar",
  },
  "Otros servicios del estudio": {
    en: "Other studio services",
    ca: "Altres serveis de l'estudi",
  },
  "Marcas con las que trabajamos": {
    en: "Brands we work with",
    ca: "Marques amb qui treballem",
  },
  "¿Qué marcas han confiado en nosotros?": {
    en: "Which brands have trusted us?",
    ca: "Quines marques han confiat en nosaltres?",
  },

  /* ── Servicios ──────────────────────────────────────────────────────── */
  "Dirección Creativa": { en: "Creative Direction", ca: "Direcció Creativa" },
  "Producción Audiovisual": { en: "Video Production", ca: "Producció Audiovisual" },
  "Community Management": { en: "Community Management", ca: "Community Management" },
  "UGC y creadores": { en: "UGC and creators", ca: "UGC i creadors" },
  "Concepto, tono y mirada de marca": {
    en: "Concept, tone and brand vision",
    ca: "Concepte, to i mirada de marca",
  },
  "Del rodaje al montaje final": {
    en: "From the shoot to the final cut",
    ca: "Del rodatge al muntatge final",
  },
  "Presencia activa y conversación": {
    en: "Active presence and conversation",
    ca: "Presència activa i conversa",
  },

  /* ── Pie de página ──────────────────────────────────────────────────── */
  "Aviso legal": { en: "Legal notice", ca: "Avís legal" },
  Privacidad: { en: "Privacy", ca: "Privacitat" },
  Cookies: { en: "Cookies", ca: "Galetes" },
  "Barcelona · Madrid — contenido con intención": {
    en: "Barcelona · Madrid — content with intent",
    ca: "Barcelona · Madrid — contingut amb intenció",
  },
  "Agencia de creación de contenido para redes sociales en Barcelona y Madrid. Dirección creativa, producción audiovisual y community management para marcas que quieren crecer.":
    {
      en: "Social media content agency in Barcelona and Madrid. Creative direction, video production and community management for brands that want to grow.",
      ca: "Agència de creació de contingut per a xarxes socials a Barcelona i Madrid. Direcció creativa, producció audiovisual i community management per a marques que volen créixer.",
    },

  /* ── Avisos y textos de estado ──────────────────────────────────────── */
  "Este sitio utiliza cookies para garantizarte la mejor experiencia.": {
    en: "This site uses cookies to give you the best experience.",
    ca: "Aquest lloc utilitza galetes per garantir-te la millor experiència.",
  },
  "Política de privacidad": { en: "Privacy policy", ca: "Política de privacitat" },
  "Cambiar entre modo claro y oscuro": {
    en: "Switch between light and dark mode",
    ca: "Canviar entre mode clar i fosc",
  },
  "Cerrar menú": { en: "Close menu", ca: "Tancar menú" },
  Idioma: { en: "Language", ca: "Idioma" },
};

/** Traduce una frase suelta. Lo que no esté en la tabla se queda en español. */
export function traducir(texto: string, idioma: Idioma): string | null {
  if (idioma === "es") return null;
  const limpio = texto.trim();
  if (!limpio) return null;

  const entrada = TRADUCCIONES[limpio];
  if (!entrada) return null;

  const traducido = entrada[idioma];
  /* Se respeta el espaciado original: si el nodo venía con saltos de línea o
     sangría del JSX, quitarlos al traducir descuadraría la maquetación. */
  return texto.replace(limpio, traducido);
}

/** Cuántas frases hay cubiertas. Sale en el aviso del selector. */
export const FRASES_CUBIERTAS = Object.keys(TRADUCCIONES).length;
