/**
 * Tarifas de fotografía y videografía para producciones puntuales (clientes
 * sin cuota mensual).
 *
 * Todos los precios viven aquí: si cambia una tarifa, se toca este archivo y
 * la presentación entera cuadra. Precios sin IVA.
 *
 * Referencia interna: a los clientes con cuota la hora extra les sale a
 * 100 €/h con grabación y edición. Lo puntual tiene que quedar bastante por
 * encima para que la cuota siga siendo lo que conviene.
 */

export const POR_HORAS = [
  {
    concepto: "Grabación de foto o vídeo",
    detalle: "1 operador con equipo de cámara, luz y sonido",
    precio: "160 €/h",
  },
  {
    concepto: "Grabación de foto + vídeo",
    detalle: "2 operadores en el mismo rodaje",
    precio: "280 €/h",
  },
  {
    concepto: "Media jornada de rodaje",
    detalle: "4 horas, 1 operador",
    precio: "600 €",
  },
  {
    concepto: "Jornada completa de rodaje",
    detalle: "8 horas, 1 operador",
    precio: "1.100 €",
  },
  {
    concepto: "Edición y postproducción",
    detalle: "Montaje, color, sonido, rótulos y retoque fotográfico",
    precio: "90 €/h",
  },
] as const;

export const POR_PIEZAS = [
  {
    concepto: "Reel / TikTok",
    detalle: "1 vídeo vertical de hasta 60 s, con música y subtítulos",
    precio: "350 €",
  },
  {
    concepto: "Pack de 3 reels",
    detalle: "Grabados en la misma sesión",
    precio: "900 €",
  },
  {
    concepto: "Pack de 5 reels",
    detalle: "Grabados en la misma sesión",
    precio: "1.400 €",
  },
  {
    concepto: "Sesión de fotos S",
    detalle: "10 fotos editadas de producto, espacio o equipo",
    precio: "450 €",
  },
  {
    concepto: "Sesión de fotos M",
    detalle: "25 fotos editadas",
    precio: "850 €",
  },
  {
    concepto: "Vídeo de marca",
    detalle: "Horizontal, de 1 a 3 min: corporativo, evento o brand video",
    precio: "1.500 €",
  },
  {
    concepto: "Foto extra editada",
    detalle: "Por foto adicional de la misma sesión",
    precio: "30 €",
  },
] as const;

export const CONDICIONES = [
  {
    q: "Mínimo de 2 horas",
    a: "Cada sesión de rodaje reserva al menos 2 horas de equipo.",
  },
  {
    q: "Desplazamientos",
    a: "Rodamos en Barcelona y Madrid. Fuera de la ciudad, transporte y dietas se presupuestan aparte.",
  },
  {
    q: "Revisiones",
    a: "Cada pieza incluye 1 ronda de cambios. Las siguientes se cobran como edición, a 90 €/h.",
  },
  {
    q: "Reserva y pago",
    a: "El 50 % por adelantado para bloquear la fecha y el 50 % restante en la entrega.",
  },
  {
    q: "Entrega",
    a: "En 7 días laborables desde el rodaje, por enlace de descarga.",
  },
  {
    q: "Uso del material",
    a: "Podéis usarlo en vuestros canales sin límite de tiempo. Maen Studios puede mostrarlo en su portfolio.",
  },
] as const;

/** Lo que paga por hora un cliente con plan mensual, para comparar. */
export const HORA_CUOTA = "100 €/h";

/** Los cinco reels de la portada, que se pueden arrastrar. */
export const PORTADA = ["tram-tram", "focacha", "mantis", "macchina", "te-pone"];

/** Las seis piezas de la diapositiva de trabajo, sin repetir la portada. */
export const MUESTRA = ["gota", "gastroconnect", "besmaya", "jansana", "aluxe", "fortuna-tonino"];
