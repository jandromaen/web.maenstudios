import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
  Cuenta una visita, con la ciudad que Vercel nos dice.

  Vercel manda la ubicación del visitante en cada petición (x-vercel-ip-city y
  compañía) y hasta ahora se tiraba: su analítica solo guarda el país. Esto la
  recoge y se la pasa al CRM, que lleva la cuenta.

  Va en una ruta aparte y no en el layout ni en un middleware a propósito: el
  middleware se ejecutaría en CADA petición -- imágenes incluidas -- y añadiría
  trabajo a la entrega de todas las páginas. Así solo se ejecuta cuando un
  navegador de verdad avisa, una vez por sesión.

  No se guarda nada del visitante: la IP no sale de aquí, y al CRM solo viaja
  ciudad, región y país para sumar uno a un contador del día.
*/

export async function POST(request: Request) {
  const url = process.env.CRM_VISITAS_URL;
  const secreto = process.env.CRM_VISITAS_SECRET;

  // Sin configurar, no es un error: simplemente no se cuenta.
  if (!url || !secreto) return NextResponse.json({ ok: true, contado: false });

  const h = request.headers;
  const ciudad = h.get("x-vercel-ip-city") ?? "";
  const region = h.get("x-vercel-ip-country-region") ?? "";
  const pais = h.get("x-vercel-ip-country") ?? "";

  if (!ciudad || !pais) return NextResponse.json({ ok: true, contado: false });

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-maen-visitas": secreto },
      body: JSON.stringify({ ciudad, region, pais }),
      cache: "no-store",
      signal: AbortSignal.timeout(4_000),
    });
  } catch (err) {
    /* Contar una visita nunca puede estropear la visita. Si el CRM no responde,
       se pierde ese dato y ya está. */
    console.error("[visita] no se pudo contar:", err);
  }

  return NextResponse.json({ ok: true, contado: true });
}
