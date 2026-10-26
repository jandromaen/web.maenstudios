-- El muro de pago para creadores.
--
-- A partir de ahora, crear ficha exige suscripcion de creador al corriente.
-- Antes bastaba con tener cuenta.
--
-- Se aplica en la base de datos y no solo en la pantalla: si manana una
-- pantalla nueva olvida comprobarlo, aqui sigue sin poder.

-- ─────────────────────────────────────────────────────────────────────
-- Primero la cortesia, DESPUES el muro
-- ─────────────────────────────────────────────────────────────────────
/* Todos los que ya tenian cuenta entran gratis para siempre. Entraron cuando
   era gratis y cobrarles retroactivamente costaria justo las fichas que
   sostienen el catalogo del que van a vivir las suscripciones de marca.
   El orden importa: si el muro se pusiera antes, quedarian fuera. */
insert into suscripciones (usuario_id, tipo, estado, cortesia)
select id, 'creador', 'activa', true from auth.users
on conflict (usuario_id) do update set cortesia = true, estado = 'activa';

-- ─────────────────────────────────────────────────────────────────────
-- El muro
-- ─────────────────────────────────────────────────────────────────────
drop policy if exists "creadores_dueno_crea" on creadores;
create policy "creadores_dueno_crea" on creadores
  for insert to authenticated
  with check (
    (select auth.uid()) = id
    and public.tiene_acceso((select auth.uid()), 'creador')
  );

/* Editar la ficha tambien lo exige: si no, quien dejara de pagar podria seguir
   manteniendola al dia, y la suscripcion seria un pago voluntario. Leerla y
   despublicarla no se tocan: a nadie se le secuestran sus datos por no pagar. */
drop policy if exists "creadores_dueno_edita" on creadores;
create policy "creadores_dueno_edita" on creadores
  for update to authenticated
  using ((select auth.uid()) = id)
  with check (
    (select auth.uid()) = id
    and (
      public.tiene_acceso((select auth.uid()), 'creador')
      /* Despublicarse siempre se puede, se pague o no. */
      or publicado = false
    )
  );

/* La ficha de quien deja de pagar sale del catalogo, pero no se borra: si
   vuelve, la tiene entera. Se hace con una condicion en la lectura publica
   en vez de tocando sus datos. */
drop policy if exists "creadores_lectura_publica" on creadores;
create policy "creadores_lectura_publica" on creadores
  for select to anon, authenticated
  using (
    publicado
    and retirado_en is null
    and public.tiene_acceso(id, 'creador')
  );
