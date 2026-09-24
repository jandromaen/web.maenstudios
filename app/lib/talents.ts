/** Tipos y utilidades del marketplace de creadores. */

export type Creador = {
  id: string;
  slug: string;
  nombre: string;
  apellido: string | null;
  ciudad: string;
  bio: string | null;
  foto: string | null;
  instagram: string | null;
  tiktok: string | null;
  seguidores: number | null;
  sectores: string[];
  tarifa_desde: number | null;
  publicado: boolean;
  retirado_en: string | null;
};

export type Trabajo = {
  id: string;
  creador_id: string;
  tipo: "enlace" | "video";
  url: string;
  titulo: string | null;
  marca: string | null;
  orden: number;
};

/** Los mismos sectores que usa el portfolio, para que los datos casen. */
export const SECTORES = [
  "Gastronomía",
  "Moda",
  "Ocio nocturno",
  "Lifestyle",
  "Producto",
  "Alimentación",
  "Belleza",
  "Fitness",
  "Viajes",
  "Tecnología",
];

/**
 * Nombre a slug: sin acentos, sin eñes y sin nada que obligue a escapar la URL.
 * normalize("NFD") separa la letra de su tilde y el replace se lleva la tilde.
 */
export function aSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * La ficha esta lista para publicarse cuando tiene lo minimo que una marca
 * necesita para decidir: quien es, donde graba, su cara y algo de trabajo.
 * No es moderacion nuestra, es evitar fichas vacias en el catalogo.
 */
export function faltaParaPublicar(c: Partial<Creador>, trabajos: number): string[] {
  const falta: string[] = [];
  if (!c.nombre?.trim()) falta.push("tu nombre");
  if (!c.ciudad?.trim()) falta.push("la ciudad donde grabas");
  if (!c.foto) falta.push("una foto tuya");
  if (trabajos === 0) falta.push("al menos un trabajo");
  return falta;
}

/** URL publica de un archivo del bucket «talents». */
export function urlDeFoto(ruta: string | null): string | null {
  if (!ruta) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base ? `${base}/storage/v1/object/public/talents/${ruta}` : null;
}
