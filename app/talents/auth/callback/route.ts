import { NextResponse, type NextRequest } from "next/server";
import { crearClienteServidor } from "../../../lib/supabase/servidor";

/**
 * Vuelta de Google.
 *
 * Google no devuelve una sesion, devuelve un codigo de un solo uso. Aqui se
 * canjea por la sesion y se deja en la cookie, que es lo que hace que el resto
 * de la web sepa quien eres. Tiene que ser una ruta y no una pagina porque
 * desde un componente de servidor no se pueden escribir cookies.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tipo = url.searchParams.get("tipo");
  const volver = url.searchParams.get("volver");

  /* Google avisa de sus errores por query, no por codigo de estado: si el
     usuario cancela en su pantalla, vuelve aqui con error=access_denied y sin
     codigo. Sin esto se quedaria en una pagina en blanco. */
  const error = url.searchParams.get("error_description") ?? url.searchParams.get("error");
  if (error || !code) {
    const destino = new URL("/talents/acceso", url.origin);
    destino.searchParams.set(
      "error",
      error === "access_denied" ? "Has cancelado el acceso con Google." : (error ?? "No hemos podido completar el acceso."),
    );
    return NextResponse.redirect(destino);
  }

  const supabase = await crearClienteServidor();
  const { error: fallo } = await supabase.auth.exchangeCodeForSession(code);

  if (fallo) {
    const destino = new URL("/talents/acceso", url.origin);
    destino.searchParams.set("error", "No hemos podido completar el acceso con Google.");
    return NextResponse.redirect(destino);
  }

  /* A donde iba antes de que le mandaramos a Google. El «tipo» solo elige
     pantalla de destino: los permisos no dependen de el, sino de en que tabla
     acaba teniendo fila. */
  const destino = volver ?? (tipo === "marca" ? "/talents/marca" : "/talents/panel");
  return NextResponse.redirect(new URL(destino, url.origin));
}
