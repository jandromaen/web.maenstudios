/**
 * Las 24 publicaciones del feed de @donlayrestaurante en los últimos 6 meses
 * (26 de abril a 20 de octubre de 2026), sacadas de Instagram Insights vía
 * Windsor.ai el 23 de octubre de 2026.
 *
 * Interacciones = likes + comentarios + guardados + compartidos.
 * Las imágenes están copiadas en /public/informedonlay/ig: las URLs del CDN de
 * Instagram caducan a los pocos días y el informe tiene que seguir viéndose.
 */

export type Formato = "Carrusel" | "Foto" | "Reel";

export type Publicacion = {
  n: number;
  fecha: string;
  formato: Formato;
  tema: string;
  alcance: number;
  interacciones: number;
  guardados: number;
  compartidos: number;
  /** Solo los reels: vídeo que se reproduce en la galería */
  video?: string;
};

const ig = (n: number) => `/informedonlay/ig/post-${String(n).padStart(2, "0")}.jpg`;
export const imagen = (p: Publicacion) => ig(p.n);

export const PUBLICACIONES: Publicacion[] = [
  { n: 1, fecha: "26 abr", formato: "Carrusel", tema: "Sala y servicio", alcance: 1326, interacciones: 64, guardados: 17, compartidos: 8 },
  { n: 2, fecha: "6 may", formato: "Carrusel", tema: "Pato laqueado", alcance: 1558, interacciones: 52, guardados: 5, compartidos: 10 },
  { n: 3, fecha: "13 may", formato: "Carrusel", tema: "Vino y sala", alcance: 1024, interacciones: 30, guardados: 2, compartidos: 2 },
  { n: 4, fecha: "20 may", formato: "Carrusel", tema: "Cultura y efemérides", alcance: 1466, interacciones: 50, guardados: 2, compartidos: 2 },
  { n: 5, fecha: "27 may", formato: "Carrusel", tema: "Cabracho «Dragón de Mar»", alcance: 1432, interacciones: 57, guardados: 10, compartidos: 7 },
  { n: 6, fecha: "18 jun", formato: "Reel", tema: "Reel sin copy", alcance: 1543, interacciones: 49, guardados: 6, compartidos: 5, video: "/informedonlay/ig/reel-1.mp4" },
  { n: 7, fecha: "24 jun", formato: "Carrusel", tema: "Dim sum de gamba trufada", alcance: 1143, interacciones: 57, guardados: 10, compartidos: 5 },
  { n: 8, fecha: "3 jul", formato: "Foto", tema: "Masa y pliegue del dim sum", alcance: 875, interacciones: 13, guardados: 0, compartidos: 0 },
  { n: 9, fecha: "10 jul", formato: "Foto", tema: "Pato laqueado", alcance: 1043, interacciones: 44, guardados: 3, compartidos: 9 },
  { n: 10, fecha: "17 jul", formato: "Foto", tema: "Producto", alcance: 1493, interacciones: 40, guardados: 3, compartidos: 4 },
  { n: 11, fecha: "24 jul", formato: "Foto", tema: "El fuego y el wok", alcance: 863, interacciones: 21, guardados: 3, compartidos: 0 },
  { n: 12, fecha: "7 ago", formato: "Foto", tema: "Información práctica", alcance: 1341, interacciones: 33, guardados: 1, compartidos: 2 },
  { n: 13, fecha: "15 ago", formato: "Carrusel", tema: "Dim sum", alcance: 1150, interacciones: 46, guardados: 2, compartidos: 2 },
  { n: 14, fecha: "21 ago", formato: "Foto", tema: "Cóctel Conejo", alcance: 980, interacciones: 23, guardados: 1, compartidos: 1 },
  { n: 15, fecha: "28 ago", formato: "Foto", tema: "La cocina como coreografía", alcance: 798, interacciones: 17, guardados: 1, compartidos: 0 },
  { n: 16, fecha: "4 sep", formato: "Carrusel", tema: "Información práctica", alcance: 750, interacciones: 28, guardados: 2, compartidos: 1 },
  { n: 17, fecha: "8 sep", formato: "Reel", tema: "Fórmula 1", alcance: 801, interacciones: 31, guardados: 0, compartidos: 1, video: "/informedonlay/ig/reel-2.mp4" },
  { n: 18, fecha: "10 sep", formato: "Foto", tema: "Fórmula 1", alcance: 1772, interacciones: 48, guardados: 5, compartidos: 6 },
  { n: 19, fecha: "11 sep", formato: "Carrusel", tema: "Cocina abierta viernes a domingo", alcance: 1322, interacciones: 80, guardados: 21, compartidos: 12 },
  { n: 20, fecha: "18 sep", formato: "Carrusel", tema: "Cocina y técnica", alcance: 628, interacciones: 28, guardados: 3, compartidos: 2 },
  { n: 21, fecha: "25 sep", formato: "Foto", tema: "Hojaldre en forma de cisne", alcance: 327, interacciones: 9, guardados: 1, compartidos: 1 },
  { n: 22, fecha: "15 oct", formato: "Foto", tema: "La historia de Nieves Ye", alcance: 1915, interacciones: 79, guardados: 3, compartidos: 5 },
  { n: 23, fecha: "18 oct", formato: "Carrusel", tema: "Pato laqueado", alcance: 781, interacciones: 36, guardados: 0, compartidos: 3 },
  { n: 24, fecha: "20 oct", formato: "Foto", tema: "Equipo", alcance: 356, interacciones: 25, guardados: 2, compartidos: 1 },
];

export const post = (n: number) => PUBLICACIONES[n - 1];

/** Fotos de marca: manual de marca 2026 y primer shooting de Don Lay */
export const FOTO = {
  barArbol: "/informedonlay/foto/bar-arbol.jpg",
  arbolRojo: "/informedonlay/foto/arbol-rojo.jpg",
  salaReservado: "/informedonlay/foto/sala-reservado.jpg",
  salaLamparas: "/informedonlay/foto/sala-lamparas.jpg",
  dimsumCesta: "/informedonlay/foto/dimsum-cesta.jpg",
  dimsumVino: "/informedonlay/foto/dimsum-vino.jpg",
  wokFuego: "/informedonlay/foto/wok-fuego.jpg",
};
