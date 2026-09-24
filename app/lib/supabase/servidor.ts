import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para componentes de servidor y rutas de API.
 *
 * Las cookies van con getAll/setAll, que es la API vigente de @supabase/ssr
 * desde la 0.4; la de get/set/remove esta deprecada.
 *
 * El try/catch del setAll no es pereza: desde un componente de servidor no se
 * pueden escribir cookies, y ahi la renovacion del token la hace el proxy. Sin
 * el catch, cada pagina que solo lee la sesion reventaria.
 */
export async function crearClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* Componente de servidor: lo renueva el proxy. */
          }
        },
      },
    },
  );
}

/**
 * El usuario de la peticion, o null.
 *
 * Siempre getUser() y nunca getSession() para decidir permisos: getSession lee
 * la cookie y se la cree, mientras que getUser valida el token contra Supabase.
 * En una pagina que decide que se ve y que no, esa diferencia es la seguridad.
 */
export async function usuarioActual() {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}
