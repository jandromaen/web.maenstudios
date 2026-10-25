import { crearClienteServidor } from "./supabase/servidor";
import type { Plan } from "./planes";

export type Acceso = {
  creador: boolean;
  marca: boolean;
  /** Para distinguir «nunca se suscribio» de «se le ha caducado». */
  estado: string | null;
  cortesia: boolean;
};

/**
 * Si este usuario esta al corriente, y de que.
 *
 * Se pregunta a la misma funcion de base de datos que usan las politicas RLS,
 * y no se recalcula aqui: si hubiera dos definiciones de «esta al corriente»,
 * un dia dirian cosas distintas y la pantalla enseñaria algo que la base de
 * datos luego no deja hacer.
 */
export async function accesoDe(usuarioId: string): Promise<Acceso> {
  const supabase = await crearClienteServidor();

  const [{ data: fila }, creador, marca] = await Promise.all([
    supabase.from("suscripciones").select("estado, cortesia").eq("usuario_id", usuarioId).maybeSingle(),
    supabase.rpc("tiene_acceso", { uid: usuarioId, clase: "creador" as Plan }),
    supabase.rpc("tiene_acceso", { uid: usuarioId, clase: "marca" as Plan }),
  ]);

  return {
    creador: creador.data === true,
    marca: marca.data === true,
    estado: fila?.estado ?? null,
    cortesia: fila?.cortesia ?? false,
  };
}
