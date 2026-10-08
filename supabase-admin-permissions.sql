-- =============================================================================
-- Permisos por sección del panel /admin (RLS)
-- =============================================================================
-- El panel escribe directo desde el navegador con el rol `authenticated`, así que
-- ocultar botones no basta: esto es lo que impide de verdad que un usuario con
-- permiso de solo lectura (o sin acceso) cree, edite o borre registros.
--
-- Cómo funciona:
--   * Los permisos viven en auth.users.raw_app_meta_data (= app_metadata):
--       admin_role        'super' | 'custom'   (sin valor = 'super')
--       admin_permissions { "posts": "edit", "ventas": "view", ... }
--     Solo la service role los puede escribir (rutas /api/admin/*-user).
--   * Se agregan políticas RESTRICTIVE: se combinan con AND con las políticas que
--     ya existen ("authenticated puede todo"), así que no hace falta borrarlas ni
--     saber cómo se llaman. Los visitantes anónimos no se ven afectados.
--   * La función lee auth.users en cada consulta (no el JWT), así que un cambio de
--     permisos aplica de inmediato, sin esperar a que caduque la sesión.
--
-- Es idempotente: se puede volver a correr sin problema.
-- Las claves de sección deben coincidir con SECCIONES_ADMIN en
-- src/lib/admin-permissions.ts.
-- =============================================================================

-- ¿El usuario en sesión tiene `nivel` ('view' | 'edit') sobre `seccion`?
CREATE OR REPLACE FUNCTION public.admin_puede(seccion text, nivel text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT coalesce(
    (
      SELECT CASE
        WHEN coalesce(u.raw_app_meta_data->>'admin_role', 'super') <> 'custom' THEN true
        WHEN nivel = 'view' THEN (u.raw_app_meta_data->'admin_permissions'->>seccion) IN ('view', 'edit')
        ELSE (u.raw_app_meta_data->'admin_permissions'->>seccion) = 'edit'
      END
      FROM auth.users u
      WHERE u.id = auth.uid()
    ),
    false
  );
$$;

-- ¿Puede editar al menos una sección? Se usa para subir imágenes al bucket `media`,
-- porque los formularios de todas las secciones suben ahí con el selector de imágenes.
CREATE OR REPLACE FUNCTION public.admin_puede_editar_alguna()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT coalesce(
    (
      SELECT coalesce(u.raw_app_meta_data->>'admin_role', 'super') <> 'custom'
        OR EXISTS (
          SELECT 1
          FROM jsonb_each_text(coalesce(u.raw_app_meta_data->'admin_permissions', '{}'::jsonb)) p
          WHERE p.value = 'edit'
        )
      FROM auth.users u
      WHERE u.id = auth.uid()
    ),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.admin_puede(text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_puede_editar_alguna() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_puede(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_puede_editar_alguna() TO authenticated;

-- -----------------------------------------------------------------------------
-- Tablas: INSERT / UPDATE / DELETE requieren permiso de edición en su sección.
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  r record;
  -- Tablas cuyo UPDATE también puede hacerlo quien edita la Base de conocimiento:
  -- desde /admin/base-conocimiento se editan sus campos knowledge_* (componente
  -- ExternalKnowledgeSection). RLS no restringe por columna, así que ese editor
  -- técnicamente podría cambiar otras columnas de estas tablas vía API.
  con_knowledge text[] := ARRAY['attractions', 'promotions', 'birthday_packages', 'menu_items'];
  cond_update text;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES
      ('posts',                  'posts'),
      ('media_metadata',         'media'),
      ('menu_items',             'menu'),
      ('menu_categories',        'menu'),
      ('faqs',                   'faq'),
      ('knowledge_base',         'base-conocimiento'),
      ('attractions',            'atracciones'),
      ('promotions',             'promociones'),
      ('birthday_packages',      'cumpleanos'),
      ('birthday_gallery',       'cumpleanos'),
      ('branches',               'sucursales'),
      ('popup_config',           'popup'),
      ('banner_config',          'banner'),
      ('shop_product_groups',    'articulos'),
      ('shop_date_restrictions', 'shop'),
      ('leads',                  'leads')
    ) AS t(tabla, seccion)
  LOOP
    -- Si alguna tabla no existe en este proyecto, se salta.
    IF to_regclass('public.' || r.tabla) IS NULL THEN
      RAISE NOTICE 'Tabla public.% no existe, se omite', r.tabla;
      CONTINUE;
    END IF;

    EXECUTE format('DROP POLICY IF EXISTS "permisos_admin_insert" ON public.%I', r.tabla);
    EXECUTE format('DROP POLICY IF EXISTS "permisos_admin_update" ON public.%I', r.tabla);
    EXECUTE format('DROP POLICY IF EXISTS "permisos_admin_delete" ON public.%I', r.tabla);
    EXECUTE format('DROP POLICY IF EXISTS "permisos_admin_select" ON public.%I', r.tabla);

    -- leads recibe INSERT del formulario público; un admin con sesión abierta que
    -- llene el formulario no debe quedar bloqueado, así que ahí no se limita el INSERT.
    IF r.tabla <> 'leads' THEN
      EXECUTE format(
        'CREATE POLICY "permisos_admin_insert" ON public.%I AS RESTRICTIVE FOR INSERT TO authenticated
           WITH CHECK ((SELECT public.admin_puede(%L, ''edit'')))',
        r.tabla, r.seccion);
    END IF;

    cond_update := format('(SELECT public.admin_puede(%L, ''edit''))', r.seccion);
    IF r.tabla = ANY (con_knowledge) THEN
      cond_update := cond_update || ' OR (SELECT public.admin_puede(''base-conocimiento'', ''edit''))';
    END IF;

    EXECUTE format(
      'CREATE POLICY "permisos_admin_update" ON public.%I AS RESTRICTIVE FOR UPDATE TO authenticated
         USING (%s) WITH CHECK (%s)',
      r.tabla, cond_update, cond_update);

    EXECUTE format(
      'CREATE POLICY "permisos_admin_delete" ON public.%I AS RESTRICTIVE FOR DELETE TO authenticated
         USING ((SELECT public.admin_puede(%L, ''edit'')))',
      r.tabla, r.seccion);

    -- Lectura: solo se limita en leads (datos personales). El resto de las tablas
    -- son de lectura pública para el sitio, así que limitarlas no protegería nada.
    IF r.tabla = 'leads' THEN
      EXECUTE format(
        'CREATE POLICY "permisos_admin_select" ON public.%I AS RESTRICTIVE FOR SELECT TO authenticated
           USING ((SELECT public.admin_puede(%L, ''view'')))',
        r.tabla, r.seccion);
    END IF;
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- Storage, bucket `media`
-- -----------------------------------------------------------------------------
-- Subir: cualquiera que edite al menos una sección (los formularios suben imágenes).
-- Borrar: solo quien edita Multimedia.
-- Las políticas de storage.objects aplican a todos los buckets: por eso cada una
-- empieza con `bucket_id <> 'media' OR ...`, para no tocar los demás.
DROP POLICY IF EXISTS "permisos_admin_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "permisos_admin_media_update" ON storage.objects;
DROP POLICY IF EXISTS "permisos_admin_media_delete" ON storage.objects;

CREATE POLICY "permisos_admin_media_insert" ON storage.objects
  AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (bucket_id <> 'media' OR (SELECT public.admin_puede_editar_alguna()));

CREATE POLICY "permisos_admin_media_update" ON storage.objects
  AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (bucket_id <> 'media' OR (SELECT public.admin_puede_editar_alguna()))
  WITH CHECK (bucket_id <> 'media' OR (SELECT public.admin_puede_editar_alguna()));

CREATE POLICY "permisos_admin_media_delete" ON storage.objects
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (bucket_id <> 'media' OR (SELECT public.admin_puede('media', 'edit')));

-- -----------------------------------------------------------------------------
-- Verificación (opcional): debe listar las políticas nuevas.
-- -----------------------------------------------------------------------------
-- SELECT schemaname, tablename, policyname, permissive, cmd
-- FROM pg_policies
-- WHERE policyname LIKE 'permisos_admin_%'
-- ORDER BY tablename, cmd;
