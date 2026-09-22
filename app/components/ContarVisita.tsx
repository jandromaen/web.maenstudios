"use client";

import { useEffect } from "react";

/*
  Avisa una vez por sesión de que alguien está en la web, para que se pueda
  contar de qué ciudad viene.

  Una vez por sesión y no por página: interesa saber cuánta gente entra y de
  dónde, no cuántas páginas mira cada uno -- eso ya lo cuenta Vercel.

  No pide consentimiento de cookies porque no usa cookies ni guarda nada del
  visitante: la marca vive en sessionStorage, que se borra al cerrar la pestaña
  y no sale del navegador, y al servidor solo llega el nombre de una ciudad
  para sumar uno a un contador.
*/

const MARCA = "maen-visita-contada";

export default function ContarVisita() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(MARCA)) return;
      sessionStorage.setItem(MARCA, "1");
    } catch {
      /* Sin sessionStorage (modo privado estricto) se cuenta igual: mejor
         contar de más que no contar. */
    }

    /* keepalive: si se cuenta justo antes de que la persona cambie de página,
       la petición sale igualmente en vez de cancelarse. */
    fetch("/api/visita", { method: "POST", keepalive: true }).catch(() => {});
  }, []);

  return null;
}
