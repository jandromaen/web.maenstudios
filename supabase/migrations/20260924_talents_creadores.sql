-- Marketplace de creadores UGC: fichas y trabajos.
--
-- Vive en una base de datos propia, separada de la del CRM a proposito: alli
-- hay nominas, movimientos de banco y datos de empleados, y estas tablas son
-- de lectura publica. Un fallo de RLS no puede costar eso.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────
-- Creadores
-- ─────────────────────────────────────────────────────────────────────
create table if not exists creadores (
  -- El id ES el del usuario autenticado: ata la ficha a su cuenta sin
  -- una columna extra que pueda quedar descuadrada.
  id uuid primary key references auth.users (id) on delete cascade,
  slug text not null unique,
  nombre text not null,
  apellido text,
  ciudad text not null,
  bio text,
  /* Ruta dentro del bucket «talents», no una URL: si algun dia cambia el
     dominio del almacenamiento, no hay que reescribir cada fila. */
  foto text,
  instagram text,
  tiktok text,
  seguidores integer check (seguidores is null or seguidores >= 0),
  sectores text[] not null default '{}',
  /* Tarifa orientativa en euros. Opcional: muchos creadores no la publican,
     y obligar a ponerla hace que no completen la ficha. */
  tarifa_desde integer check (tarifa_desde is null or tarifa_desde >= 0),
  /* Publicacion directa, sin aprobacion del equipo. Arranca en false solo
     para que una ficha a medias no salga al catalogo: la publica el propio
     creador en cuanto tiene nombre, ciudad y foto. Eso no es moderacion,
     es evitar fichas fantasma. */
  publicado boolean not null default false,
  /* Retirada desde el CRM cuando algo no deberia estar publicado. Se guarda
     el motivo porque «por que se cayo mi ficha» es la primera pregunta. */
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
     tenga nada publicado todavia. Los enlaces no cuestan almacenamiento ni
     ancho de banda, y son lo que hace que la ficha se complete en un minuto. */
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
-- Denuncias
-- ─────────────────────────────────────────────────────────────────────
/* Con publicacion directa, cualquiera puede subir una foto que no es suya.
   Esto no lo evita, pero hace que resolverlo sean diez segundos en el CRM
   en vez de un correo del abogado de alguien. */
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
alter table creadores enable row level security;
alter table creador_trabajos enable row level security;
alter table creador_denuncias enable row level security;

/* Publico: solo se ve lo publicado y no retirado. Sin esta condicion, una
   ficha a medias o una retirada seguiria siendo legible por la API. */
drop policy if exists "creadores_lectura_publica" on creadores;
create policy "creadores_lectura_publica" on creadores
  for select using (publicado and retirado_en is null);

drop policy if exists "creadores_dueno_lee" on creadores;
create policy "creadores_dueno_lee" on creadores
  for select using (auth.uid() = id);

drop policy if exists "creadores_dueno_crea" on creadores;
create policy "creadores_dueno_crea" on creadores
  for insert with check (auth.uid() = id);

drop policy if exists "creadores_dueno_edita" on creadores;
create policy "creadores_dueno_edita" on creadores
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "trabajos_lectura_publica" on creador_trabajos;
create policy "trabajos_lectura_publica" on creador_trabajos
  for select using (
    exists (
      select 1 from creadores c
      where c.id = creador_trabajos.creador_id
        and c.publicado
        and c.retirado_en is null
    )
  );

drop policy if exists "trabajos_dueno" on creador_trabajos;
create policy "trabajos_dueno" on creador_trabajos
  for all using (auth.uid() = creador_id) with check (auth.uid() = creador_id);

/* Denunciar puede cualquiera, sin cuenta: exigir registro para avisar de una
   foto robada es garantizar que nadie avise. Leerlas, solo el equipo con la
   clave de servicio, que se salta RLS. */
drop policy if exists "denuncias_cualquiera_crea" on creador_denuncias;
create policy "denuncias_cualquiera_crea" on creador_denuncias
  for insert with check (true);

-- ─────────────────────────────────────────────────────────────────────
-- updated_at al dia
-- ─────────────────────────────────────────────────────────────────────
create or replace function tocar_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists creadores_updated_at on creadores;
create trigger creadores_updated_at before update on creadores
  for each row execute function tocar_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- Permisos de rol
-- ─────────────────────────────────────────────────────────────────────
/* Explicitos a proposito. Supabase suele concederlos por defecto en el
   esquema public, pero depender de eso es depender de una configuracion que
   no se ve en ningun sitio: el dia que no este, el sintoma es un 401 vacio
   sin nada que leer. RLS sigue mandando por encima de estos grants. */
grant select on creadores to anon, authenticated;
grant insert, update on creadores to authenticated;

grant select on creador_trabajos to anon, authenticated;
grant insert, update, delete on creador_trabajos to authenticated;

grant insert on creador_denuncias to anon, authenticated;
