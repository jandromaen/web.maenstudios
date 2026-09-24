-- Marketplace de creadores UGC: intranet de creadores y de marcas.
--
-- Vive en una base de datos propia («maen-talents»), separada de la del CRM a
-- proposito: alli hay nominas, movimientos de banco y datos de empleados, y
-- estas tablas son de lectura publica. Un fallo de RLS no puede costar eso.
--
-- Quien es quien se deduce de en que tabla tiene fila: creadores o marcas.
-- No se guarda un campo «rol» en el usuario porque user_metadata lo edita el
-- propio usuario y no sirve para decidir permisos; tener fila es un hecho que
-- el usuario no puede falsear.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────
-- Creadores
-- ─────────────────────────────────────────────────────────────────────
create table if not exists creadores (
  -- El id ES el del usuario autenticado: ata la ficha a su cuenta sin una
  -- columna extra que pueda quedar descuadrada.
  id uuid primary key references auth.users (id) on delete cascade,
  slug text not null unique,
  nombre text not null,
  apellido text,
  ciudad text not null,
  bio text,
  /* Ruta dentro del bucket «talents», no una URL: si cambia el dominio del
     almacenamiento, no hay que reescribir cada fila. */
  foto text,
  instagram text,
  tiktok text,
  seguidores integer check (seguidores is null or seguidores >= 0),
  sectores text[] not null default '{}',
  tarifa_desde integer check (tarifa_desde is null or tarifa_desde >= 0),
  /* Publicacion directa, sin aprobacion del equipo. Arranca en false solo
     para que una ficha a medias no salga al catalogo: la publica el propio
     creador al completarla. Eso no es moderacion, es evitar fichas fantasma. */
  publicado boolean not null default false,
  /* Retirada desde el CRM cuando algo no deberia estar publicado. Se guarda
     el motivo porque «por que se ha caido mi ficha» es la primera pregunta. */
  retirado_en timestamptz,
  retirado_motivo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creadores_ciudad_idx on creadores (ciudad);
create index if not exists creadores_sectores_idx on creadores using gin (sectores);
create index if not exists creadores_publicado_idx on creadores (publicado) where publicado;

-- ─────────────────────────────────────────────────────────────────────
-- Trabajos de cada creador
-- ─────────────────────────────────────────────────────────────────────
create table if not exists creador_trabajos (
  id uuid primary key default gen_random_uuid(),
  creador_id uuid not null references creadores (id) on delete cascade,
  /* «enlace» apunta a Instagram o TikTok, que es lo normal: el creador ya
     tiene su trabajo publicado. «video» es un archivo subido, para quien no
     tenga nada publicado. Los enlaces no cuestan almacenamiento ni ancho de
     banda, y hacen que la ficha se complete en un minuto. */
  tipo text not null check (tipo in ('enlace', 'video')),
  url text not null,
  titulo text,
  marca text,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists creador_trabajos_creador_idx
  on creador_trabajos (creador_id, orden);

-- ─────────────────────────────────────────────────────────────────────
-- Marcas
-- ─────────────────────────────────────────────────────────────────────
/* La otra mitad de la intranet. Una marca se registra gratis y ve el catalogo
   sin datos de contacto; lo que abre la suscripcion es poder escribir al
   creador desde dentro. Los campos de Stripe llegan en la fase 2. */
create table if not exists marcas (
  id uuid primary key references auth.users (id) on delete cascade,
  empresa text not null,
  /* Razon social y CIF: hacen falta para la factura del mes en que se
     suscriben, no para registrarse. Por eso son opcionales aqui. */
  razon_social text,
  nif text,
  web text,
  sector text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────
-- Denuncias
-- ─────────────────────────────────────────────────────────────────────
/* Con publicacion directa alguien acabara subiendo una foto que no es suya.
   Esto no lo evita, pero hace que resolverlo sean diez segundos en el CRM. */
create table if not exists creador_denuncias (
  id uuid primary key default gen_random_uuid(),
  creador_id uuid not null references creadores (id) on delete cascade,
  motivo text not null,
  email_contacto text,
  resuelta_en timestamptz,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────
-- Seguridad a nivel de fila
-- ─────────────────────────────────────────────────────────────────────
/* Notas de las politicas, que no se leen del SQL:
   - Se usa «TO <rol>» en vez de auth.role(), que esta deprecado y ademas se
     cumple para usuarios anonimos cuando estan activados.
   - auth.uid() va envuelto en (select ...) para que Postgres lo evalue una
     vez por consulta y no una vez por fila.
   - Los UPDATE llevan USING y WITH CHECK: sin el WITH CHECK, un usuario podria
     reasignar su fila a otro id. Y necesitan politica de SELECT, o el update
     devuelve cero filas sin dar error. */
alter table creadores enable row level security;
alter table creador_trabajos enable row level security;
alter table marcas enable row level security;
alter table creador_denuncias enable row level security;

drop policy if exists "creadores_lectura_publica" on creadores;
create policy "creadores_lectura_publica" on creadores
  for select to anon, authenticated
  using (publicado and retirado_en is null);

drop policy if exists "creadores_dueno_lee" on creadores;
create policy "creadores_dueno_lee" on creadores
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "creadores_dueno_crea" on creadores;
create policy "creadores_dueno_crea" on creadores
  for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "creadores_dueno_edita" on creadores;
create policy "creadores_dueno_edita" on creadores
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "trabajos_lectura_publica" on creador_trabajos;
create policy "trabajos_lectura_publica" on creador_trabajos
  for select to anon, authenticated
  using (
    exists (
      select 1 from creadores c
      where c.id = creador_trabajos.creador_id
        and c.publicado
        and c.retirado_en is null
    )
  );

drop policy if exists "trabajos_dueno" on creador_trabajos;
create policy "trabajos_dueno" on creador_trabajos
  for all to authenticated
  using ((select auth.uid()) = creador_id)
  with check ((select auth.uid()) = creador_id);

/* Una marca solo se ve a si misma. No hay lectura publica: el listado de
   marcas suscritas no es asunto de nadie mas. */
drop policy if exists "marcas_dueno_lee" on marcas;
create policy "marcas_dueno_lee" on marcas
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "marcas_dueno_crea" on marcas;
create policy "marcas_dueno_crea" on marcas
  for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "marcas_dueno_edita" on marcas;
create policy "marcas_dueno_edita" on marcas
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

/* Denunciar puede cualquiera, sin cuenta: exigir registro para avisar de una
   foto robada es garantizar que nadie avise. Leerlas, solo el equipo con la
   clave de servicio, que se salta RLS: no hay politica de SELECT a proposito. */
drop policy if exists "denuncias_cualquiera_crea" on creador_denuncias;
create policy "denuncias_cualquiera_crea" on creador_denuncias
  for insert to anon, authenticated
  with check (true);

-- ─────────────────────────────────────────────────────────────────────
-- updated_at al dia
-- ─────────────────────────────────────────────────────────────────────
create or replace function tocar_updated_at() returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists creadores_updated_at on creadores;
create trigger creadores_updated_at before update on creadores
  for each row execute function tocar_updated_at();

drop trigger if exists marcas_updated_at on marcas;
create trigger marcas_updated_at before update on marcas
  for each row execute function tocar_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- Permisos de rol (Data API)
-- ─────────────────────────────────────────────────────────────────────
/* Obligatorios, no decorativos: desde abril de 2026 las tablas nuevas del
   esquema public ya NO se exponen solas a la Data API. Sin estos grants el
   sintoma es un error de permisos sin nada que leer. RLS sigue mandando por
   encima de ellos: esto abre la puerta, las politicas dicen que filas pasan. */
grant select on creadores to anon, authenticated;
grant insert, update on creadores to authenticated;

grant select on creador_trabajos to anon, authenticated;
grant insert, update, delete on creador_trabajos to authenticated;

grant select, insert, update on marcas to authenticated;

grant insert on creador_denuncias to anon, authenticated;
