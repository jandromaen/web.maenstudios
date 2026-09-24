-- Bucket «talents»: fotos de perfil de los creadores y, opcionalmente, algun
-- video de quien no tenga trabajo publicado en redes.
--
-- 25 MB por archivo. Es de sobra para una foto de perfil y corto para un
-- video largo a proposito: lo normal es que los trabajos sean enlaces a
-- Instagram o TikTok, no subidas que pagamos en almacenamiento y en ancho de
-- banda cada vez que una marca navega el catalogo.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'talents',
  'talents',
  true,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

/* Los archivos van en «<id de usuario>/<archivo>», y la politica comprueba esa
   primera carpeta. Sin eso, cualquier creador registrado podria sobrescribir o
   borrar la foto de otro: es lo que pasa en el bucket «contenido» del CRM, que
   se puede permitir porque alli solo entra el equipo. Aqui no.

   Subir, leer y actualizar van juntos a proposito: sustituir un archivo
   (upsert) necesita los tres, y con solo INSERT falla sin decir por que. */

drop policy if exists "talents_lectura_publica" on storage.objects;
create policy "talents_lectura_publica" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'talents');

drop policy if exists "talents_sube_lo_suyo" on storage.objects;
create policy "talents_sube_lo_suyo" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'talents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "talents_actualiza_lo_suyo" on storage.objects;
create policy "talents_actualiza_lo_suyo" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'talents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'talents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "talents_borra_lo_suyo" on storage.objects;
create policy "talents_borra_lo_suyo" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'talents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
