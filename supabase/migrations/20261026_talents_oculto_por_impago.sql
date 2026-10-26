-- La ficha de quien deja de pagar sale del catalogo, sin consultar la tabla de
-- suscripciones desde una politica publica.
--
-- El intento anterior hacia que la politica de lectura publica llamara a
-- tiene_acceso(), que lee suscripciones. Esa tabla esta protegida contra el
-- publico, asi que un visitante anonimo no podia resolver la funcion y dejaba
-- de ver TODAS las fichas.
--
-- La salida facil habria sido marcar la funcion SECURITY DEFINER para que se
-- saltara RLS. No se hace: una funcion asi en el esquema public la puede
-- llamar cualquiera y se convierte en una puerta abierta a datos de
-- suscripciones. Se guarda el dato donde hace falta y ya esta.

alter table creadores
  add column if not exists oculto_por_impago boolean not null default false;

comment on column creadores.oculto_por_impago is
  'Lo pone y lo quita el webhook de Stripe cuando la suscripcion caduca o se '
  'reanuda. La ficha desaparece del catalogo pero no se borra: si vuelve, la '
  'tiene entera.';

drop policy if exists "creadores_lectura_publica" on creadores;
create policy "creadores_lectura_publica" on creadores
  for select to anon, authenticated
  using (publicado and retirado_en is null and not oculto_por_impago);
