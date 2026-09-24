import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renueva la sesion de Supabase antes de que se pinte la pagina.
 *
 * Hace falta porque el token de acceso caduca en una hora: sin esto, alguien
 * que deje la pestana abierta vuelve y se encuentra con que ya no esta dentro.
 * Aqui si se pueden escribir cookies, que es justo lo que no puede hacer un
 * componente de servidor.
 *
 * El matcher cubre SOLO las rutas de la intranet. La web es casi toda estatica
 * y muy buena en Core Web Vitals; pasar cada visita a /clientes o al blog por
 * una funcion seria pagar servidor y latencia por nada.
 *
 * En Next 16 este fichero se llama proxy.ts: la convencion middleware.ts esta
 * deprecada.
 */
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          respuesta = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  /* getUser() y no getSession(): valida el token contra Supabase en vez de
     creerse la cookie. Ademas es la llamada que dispara la renovacion. */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /* El panel es privado. Se comprueba aqui ademas de en la pagina: si algun
     dia alguien anade una ruta nueva bajo /talents/panel y olvida el control,
     sigue estando cubierta. */
  const ruta = request.nextUrl.pathname;
  if (!user && (ruta.startsWith("/talents/panel") || ruta.startsWith("/talents/marca"))) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/talents/acceso";
    /* De donde venia, para devolverle ahi despues de entrar en vez de soltarle
       en una pagina generica. */
    destino.searchParams.set("volver", ruta);
    return NextResponse.redirect(destino);
  }

  return respuesta;
}

export const config = {
  matcher: ["/talents/panel/:path*", "/talents/marca/:path*", "/talents/acceso"],
};
