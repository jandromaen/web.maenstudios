-- Permisos minimos para los roles publicos.
--
-- Supabase concede por defecto TODO (select, insert, update, delete, truncate,
-- references, trigger) a «anon» y «authenticated» sobre las tablas nuevas del
-- esquema public. RLS tapa casi todo eso, porque sin politica que la permita
-- una operacion no ve ninguna fila... salvo TRUNCATE, que NO pasa por RLS.
--
-- La clave «anon» viaja en el navegador de cualquiera que abra la web. Dejar
-- TRUNCATE concedido a ese rol es dejar la puerta puesta aunque hoy no haya
-- pomo: PostgREST no expone TRUNCATE, pero cualquier funcion RPC que se anada
-- manana si podria alcanzarlo.
--
-- Se revoca todo y se vuelve a conceder solo lo que usa la aplicacion.

revoke all on creadores from anon, authenticated;
revoke all on creador_trabajos from anon, authenticated;
revoke all on marcas from anon, authenticated;
revoke all on creador_denuncias from anon, authenticated;

-- Fichas: el mundo las lee (RLS filtra a las publicadas); el dueno las escribe.
grant select on creadores to anon, authenticated;
grant insert, update on creadores to authenticated;

-- Trabajos: igual, y ademas el dueno puede borrar los suyos.
grant select on creador_trabajos to anon, authenticated;
grant insert, update, delete on creador_trabajos to authenticated;

-- Marcas: nada para anon. Ni leer: el listado de marcas no es publico.
grant select, insert, update on marcas to authenticated;

-- Denuncias: solo escribir, y sin cuenta. Leerlas es cosa del equipo con la
-- clave de servicio, que se salta RLS.
grant insert on creador_denuncias to anon, authenticated;
