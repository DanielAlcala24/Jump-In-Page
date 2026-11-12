-- =============================================================================
-- Imagen para móvil de los grupos de productos de /shop
-- =============================================================================
-- shop_product_groups.image_url        → imagen para escritorio (ya existía)
-- shop_product_groups.mobile_image_url → imagen para móvil (< 768 px), opcional
-- Si falta una, /shop usa la otra en las dos vistas.
--
-- Es idempotente: se puede volver a correr sin problema.
-- =============================================================================

ALTER TABLE public.shop_product_groups ADD COLUMN IF NOT EXISTS mobile_image_url TEXT;

-- Para que la API (PostgREST) vea la columna nueva de inmediato.
NOTIFY pgrst, 'reload schema';
