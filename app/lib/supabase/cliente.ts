"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para el navegador.
 *
 * Usa la clave publicable, que esta pensada para viajar al navegador: lo que
 * decide que puede ver cada visitante no es la clave, son las politicas RLS.
 * La clave de servicio no aparece por aqui en ningun caso.
 */
export function crearCliente() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
