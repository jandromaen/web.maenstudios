import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
  Notas del cliente en los calendarios de contenido (skinlaundry-bcn.vercel.app/calendario).

  Cada nota es un JSON en un bucket privado de Supabase Storage: <mes>/<id>.json.
  Se usa Storage y no una tabla para no depender de una migración: el bucket se
  crea solo la primera vez. Escribe con la clave de servicio, así que el bucket no
  necesita políticas públicas; lo único expuesto es esta ruta, que valida y recorta
  lo que entra.
*/

const BUCKET = "calendario-notas";
const MES = /^[a-z0-9-]{3,20}$/;
const ID = /^[0-9]{13}-[a-z0-9]{6}$/;

type Nota = {
  id: string;
  mes: string;
  clave: string;
  etiqueta: string;
  diapositiva: number;
  imagen: string;
  texto: string;
  autor: string;
  fecha: string;
  resuelta: boolean;
};

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

let bucketListo = false;
async function storage() {
  const sb = admin();
  if (!bucketListo) {
    const { error } = await sb.storage.createBucket(BUCKET, { public: false });
    if (error && !/already exists|duplicate/i.test(error.message)) throw error;
    bucketListo = true;
  }
  return sb.storage.from(BUCKET);
}

const corta = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const sinCache = { "Cache-Control": "no-store" };

async function leer(mes: string): Promise<Nota[]> {
  const st = await storage();
  const { data: lista, error } = await st.list(mes, { limit: 1000 });
  if (error) throw error;
  const notas = await Promise.all(
    (lista ?? [])
      .filter((f) => f.name.endsWith(".json"))
      .map(async (f) => {
        const { data } = await st.download(`${mes}/${f.name}`);
        try {
          return data ? (JSON.parse(await data.text()) as Nota) : null;
        } catch {
          return null;
        }
      }),
  );
  return notas.filter((n): n is Nota => !!n).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

async function guardar(st: Awaited<ReturnType<typeof storage>>, nota: Nota) {
  const { error } = await st.upload(`${nota.mes}/${nota.id}.json`, JSON.stringify(nota), {
    contentType: "application/json",
    upsert: true,
  });
  if (error) throw error;
}

export async function GET(req: NextRequest) {
  const mes = req.nextUrl.searchParams.get("mes") ?? "";
  if (!MES.test(mes)) return NextResponse.json({ error: "mes" }, { status: 400 });
  try {
    return NextResponse.json({ notas: await leer(mes) }, { headers: sinCache });
  } catch (err) {
    console.error("[calendario-notas] leer:", err);
    return NextResponse.json({ error: "No se pudieron cargar las notas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const mes = corta(b.mes, 20);
  const texto = corta(b.texto, 2000);
  if (!MES.test(mes) || !texto) return NextResponse.json({ error: "Falta el texto" }, { status: 400 });
  const nota: Nota = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8).padEnd(6, "0")}`,
    mes,
    clave: corta(b.clave, 200),
    etiqueta: corta(b.etiqueta, 200),
    diapositiva: Math.max(0, Math.min(999, Number(b.diapositiva) || 0)),
    imagen: corta(b.imagen, 40),
    texto,
    autor: corta(b.autor, 60) || "Anónimo",
    fecha: new Date().toISOString(),
    resuelta: false,
  };
  try {
    await guardar(await storage(), nota);
    return NextResponse.json({ nota }, { headers: sinCache });
  } catch (err) {
    console.error("[calendario-notas] guardar:", err);
    return NextResponse.json({ error: "No se pudo guardar la nota" }, { status: 500 });
  }
}

/* Marcar como resuelta (o volver a abrir). */
export async function PATCH(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const mes = corta(b.mes, 20);
  const id = corta(b.id, 40);
  if (!MES.test(mes) || !ID.test(id)) return NextResponse.json({ error: "id" }, { status: 400 });
  try {
    const st = await storage();
    const { data } = await st.download(`${mes}/${id}.json`);
    if (!data) return NextResponse.json({ error: "No existe" }, { status: 404 });
    const nota = JSON.parse(await data.text()) as Nota;
    nota.resuelta = !!b.resuelta;
    await guardar(st, nota);
    return NextResponse.json({ nota }, { headers: sinCache });
  } catch (err) {
    console.error("[calendario-notas] actualizar:", err);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }
}
