-- Fase 2: suscripciones, anuncios y candidaturas.
--
-- Marcas: 25 EUR/mes + IVA para acceder a los perfiles y publicar anuncios.
-- Creadores: 12 EUR/ano + IVA para poder registrarse y aplicar.
--
-- El cobro anual al creador no es un capricho: Stripe se lleva ~1,5% + 0,25
-- EUR por cobro, que sobre 1,21 EUR es el 22%. Sobre 14,52 EUR una vez al ano
-- es el 4%, y es una factura al ano en vez de doce.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────
-- Suscripciones
-- ─────────────────────────────────────────────────────────────────────
create table if not exists suscripciones (
  /* Una por usuario: nadie tiene dos a la vez, y asi no hay que decidir cual
     manda cuando se contradicen. */
  usuario_id uuid primary key references auth.users (id) on delete cascade,
  tipo text not null check (tipo in ('marca', 'creador')),
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'activa', 'impagada', 'cancelada')),
  stripe_customer_id text,
  stripe_subscription_id text unique,
  /* Hasta cuando esta pagado. Se compara con now() en vez de fiarse solo del
     estado: una cancelacion a mitad de periodo sigue dando acceso hasta el
     final, que es lo que el cliente ha pagado. */
  periodo_fin timestamptz,
  /* Los que entraron antes del muro de pago. Cobrarles retroactivamente
     costaria las unicas fichas que hay. */
  cortesia boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists suscripciones_cliente_idx on suscripciones (stripe_customer_id);

/* El acceso de pago, en un solo sitio. Se usa en las politicas de abajo y
   tambien desde la aplicacion, para que no haya dos definiciones de «esta al
   corriente» que puedan separarse con el tiempo. */
create or replace function tiene_acceso(uid uuid, clase text) returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.suscripciones s
    where s.usuario_id = uid
      and s.tipo = clase
      and (
        s.cortesia
        or (s.estado = 'activa' and (s.periodo_fin is null or s.periodo_fin > now()))
      )
  );
$$;

-- ─────────────────────────────────────────────────────────────────────
-- Anuncios que publican las marcas
-- ─────────────────────────────────────────────────────────────────────
create table if not exists anuncios (
  id uuid primary key default gen_random_uuid(),
  marca_id uuid not null references marcas (id) on delete cascade,
  titulo text not null,
  descripcion text not null,
  ciudad text,
  sectores text[] not null default '{}',
  /* En euros y sin IVA, los dos opcionales: obligar a poner cifra hace que no
     se publique el anuncio, y un anuncio sin presupuesto sigue valiendo. */
  presupuesto_desde integer check (presupuesto_desde is null or presupuesto_desde >= 0),
  presupuesto_hasta integer check (presupuesto_hasta is null or presupuesto_hasta >= 0),
  plazo date,
  estado text not null default 'abierto' check (estado in ('abierto', 'cerrado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists anuncios_abiertos_idx on anuncios (created_at desc) where estado = 'abierto';
create index if not exists anuncios_marca_idx on anuncios (marca_id);

-- ─────────────────────────────────────────────────────────────────────
-- Candidaturas
-- ─────────────────────────────────────────────────────────────────────
create table if not exists candidaturas (
  id uuid primary key default gen_random_uuid(),
  anuncio_id uuid not null references anuncios (id) on delete cascade,
  creador_id uuid not null references creadores (id) on delete cascade,
  mensaje text,
  estado text not null default 'enviada'
    check (estado in ('enviada', 'vista', 'aceptada', 'descartada')),
  created_at timestamptz not null default now(),
  /* Una sola por anuncio: sin esto, un creador puede aplicar diez veces y
     llenarle la bandeja a la marca. */
  unique (anuncio_id, creador_id)
);

create index if not exists candidaturas_anuncio_idx on candidaturas (anuncio_id, created_at desc);
create index if not exists candidaturas_creador_idx on candidaturas (creador_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────
-- Seguridad a nivel de fila
-- ─────────────────────────────────────────────────────────────────────
alter table suscripciones enable row level security;
alter table anuncios enable row level security;
alter table candidaturas enable row level security;

/* Cada uno ve su suscripcion y nada mas. Escribirla es cosa del webhook de
   Stripe con la clave de servicio: si el usuario pudiera, se regalaria el
   acceso poniendo estado='activa'. Por eso no hay politica de insert ni de
   update, a proposito. */
drop policy if exists "suscripciones_dueno_lee" on suscripciones;
create policy "suscripciones_dueno_lee" on suscripciones
  for select to authenticated
  using ((select auth.uid()) = usuario_id);

/* Los anuncios son del club: solo los ve quien esta al corriente. Es un
   marketplace exclusivo, no un tablon publico. */
drop policy if exists "anuncios_para_suscritos" on anuncios;
create policy "anuncios_para_suscritos" on anuncios
  for select to authenticated
  using (
    estado = 'abierto'
    and (
      public.tiene_acceso((select auth.uid()), 'creador')
      or public.tiene_acceso((select auth.uid()), 'marca')
    )
  );

drop policy if exists "anuncios_marca_lee_los_suyos" on anuncios;
create policy "anuncios_marca_lee_los_suyos" on anuncios
  for select to authenticated using ((select auth.uid()) = marca_id);

/* Publicar exige estar al corriente: sin eso, cualquiera se registra gratis
   como marca y publica. */
drop policy if exists "anuncios_marca_publica" on anuncios;
create policy "anuncios_marca_publica" on anuncios
  for insert to authenticated
  with check (
    (select auth.uid()) = marca_id
    and public.tiene_acceso((select auth.uid()), 'marca')
  );

drop policy if exists "anuncios_marca_edita" on anuncios;
create policy "anuncios_marca_edita" on anuncios
  for update to authenticated
  using ((select auth.uid()) = marca_id)
  with check ((select auth.uid()) = marca_id);

/* El creador ve y manda las suyas; la marca ve las de sus anuncios y puede
   cambiarles el estado. Nadie ve las candidaturas de otro creador: saber a que
   esta aplicando la competencia no es asunto suyo. */
drop policy if exists "candidaturas_creador" on candidaturas;
create policy "candidaturas_creador" on candidaturas
  for select to authenticated using ((select auth.uid()) = creador_id);

drop policy if exists "candidaturas_creador_aplica" on candidaturas;
create policy "candidaturas_creador_aplica" on candidaturas
  for insert to authenticated
  with check (
    (select auth.uid()) = creador_id
    and public.tiene_acceso((select auth.uid()), 'creador')
    and exists (
      select 1 from public.anuncios a
      where a.id = candidaturas.anuncio_id and a.estado = 'abierto'
    )
  );

drop policy if exists "candidaturas_marca_lee" on candidaturas;
create policy "candidaturas_marca_lee" on candidaturas
  for select to authenticated
  using (
    exists (
      select 1 from public.anuncios a
      where a.id = candidaturas.anuncio_id and a.marca_id = (select auth.uid())
    )
  );

drop policy if exists "candidaturas_marca_decide" on candidaturas;
create policy "candidaturas_marca_decide" on candidaturas
  for update to authenticated
  using (
    exists (select 1 from public.anuncios a
            where a.id = candidaturas.anuncio_id and a.marca_id = (select auth.uid()))
  )
  with check (
    exists (select 1 from public.anuncios a
            where a.id = candidaturas.anuncio_id and a.marca_id = (select auth.uid()))
  );

drop trigger if exists anuncios_updated_at on anuncios;
create trigger anuncios_updated_at before update on anuncios
  for each row execute function tocar_updated_at();

drop trigger if exists suscripciones_updated_at on suscripciones;
create trigger suscripciones_updated_at before update on suscripciones
  for each row execute function tocar_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- Permisos de rol (Data API)
-- ─────────────────────────────────────────────────────────────────────
/* Minimos y explicitos, como el resto: desde abril de 2026 las tablas nuevas
   no se exponen solas, y los permisos por defecto de Supabase incluyen
   TRUNCATE, que no pasa por RLS. */
revoke all on suscripciones, anuncios, candidaturas from anon, authenticated;

grant select on suscripciones to authenticated;
grant select, insert, update on anuncios to authenticated;
grant select, insert, update on candidaturas to authenticated;
