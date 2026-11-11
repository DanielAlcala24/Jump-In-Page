-- =============================================================================
-- Ajustes de la tienda /shop (tabla de una sola fila: id = 1)
-- =============================================================================
-- section_order: orden de las secciones del paso "Productos" de /shop.
--   Valores: 'access' (Accesos), 'promotion' (Promociones), 'article' (Artículos).
--   Se edita en /admin/articulos → botón "Orden en /shop".
--   Si falta algún tipo, /shop lo agrega al final; si la tabla no existe, usa
--   access → promotion → article.
--
-- Permisos: lectura pública (la lee /shop sin sesión); escritura solo para quien
-- tenga "Ver y editar" en "Artículos Shop y grupos" (clave 'articulos').
--
-- Es idempotente: se puede volver a correr sin problema.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.shop_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  section_order TEXT[] NOT NULL DEFAULT ARRAY['access', 'promotion', 'article'],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.shop_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.shop_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.shop_settings TO authenticated;

-- Permisivas
DROP POLICY IF EXISTS "Lectura publica de shop_settings" ON public.shop_settings;
CREATE POLICY "Lectura publica de shop_settings"
  ON public.shop_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Insercion de shop_settings para autenticados" ON public.shop_settings;
CREATE POLICY "Insercion de shop_settings para autenticados"
  ON public.shop_settings FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Actualizacion de shop_settings para autenticados" ON public.shop_settings;
CREATE POLICY "Actualizacion de shop_settings para autenticados"
  ON public.shop_settings FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Restrictivas: las mismas que crea supabase-admin-permissions.sql para la clave
-- 'articulos' (también está en su lista VALUES). Se crean aquí para que baste con
-- correr este archivo; volver a correr el de permisos no choca con estas.
DROP POLICY IF EXISTS "permisos_admin_insert" ON public.shop_settings;
CREATE POLICY "permisos_admin_insert" ON public.shop_settings AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK ((SELECT public.admin_puede('articulos', 'edit')));

DROP POLICY IF EXISTS "permisos_admin_update" ON public.shop_settings;
CREATE POLICY "permisos_admin_update" ON public.shop_settings AS RESTRICTIVE FOR UPDATE TO authenticated
  USING ((SELECT public.admin_puede('articulos', 'edit')))
  WITH CHECK ((SELECT public.admin_puede('articulos', 'edit')));

DROP POLICY IF EXISTS "permisos_admin_delete" ON public.shop_settings;
CREATE POLICY "permisos_admin_delete" ON public.shop_settings AS RESTRICTIVE FOR DELETE TO authenticated
  USING ((SELECT public.admin_puede('articulos', 'edit')));

-- Para que la API (PostgREST) vea la tabla nueva de inmediato.
NOTIFY pgrst, 'reload schema';
