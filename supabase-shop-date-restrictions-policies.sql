-- =============================================================================
-- Políticas RLS de shop_date_restrictions (restricciones de fecha de /shop)
-- =============================================================================
-- La tabla se creó a mano con RLS activado pero sin políticas de escritura, así
-- que /admin/shop fallaba con:
--   "new row violates row-level security policy for table shop_date_restrictions"
--
-- Estas son las políticas PERMISIVAS (las que dejan pasar). Encima siguen
-- aplicando las RESTRICTIVE de supabase-admin-permissions.sql, que limitan la
-- escritura a quien tenga "Ver y editar" en la sección Shop — Fechas.
--
-- Es idempotente: se puede volver a correr sin problema.
-- =============================================================================

ALTER TABLE public.shop_date_restrictions ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.shop_date_restrictions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.shop_date_restrictions TO authenticated;

-- Lectura pública: /api/shop/date-restrictions las lee con la anon key para
-- bloquear fechas en el calendario de /shop.
DROP POLICY IF EXISTS "Lectura publica de shop_date_restrictions" ON public.shop_date_restrictions;
CREATE POLICY "Lectura publica de shop_date_restrictions"
  ON public.shop_date_restrictions
  FOR SELECT
  USING (true);

-- Escritura solo para el admin (usuarios autenticados).
DROP POLICY IF EXISTS "Insercion de shop_date_restrictions para autenticados" ON public.shop_date_restrictions;
CREATE POLICY "Insercion de shop_date_restrictions para autenticados"
  ON public.shop_date_restrictions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Actualizacion de shop_date_restrictions para autenticados" ON public.shop_date_restrictions;
CREATE POLICY "Actualizacion de shop_date_restrictions para autenticados"
  ON public.shop_date_restrictions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Eliminacion de shop_date_restrictions para autenticados" ON public.shop_date_restrictions;
CREATE POLICY "Eliminacion de shop_date_restrictions para autenticados"
  ON public.shop_date_restrictions
  FOR DELETE
  TO authenticated
  USING (true);

-- Verificación (opcional): deben salir 4 permisivas + 3 restrictivas (permisos_admin_*).
-- SELECT policyname, permissive, cmd
-- FROM pg_policies
-- WHERE tablename = 'shop_date_restrictions'
-- ORDER BY permissive DESC, cmd;
