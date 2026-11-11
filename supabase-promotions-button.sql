-- =============================================================================
-- Botón opcional en cada promoción (promotions.button_text / button_url)
-- =============================================================================
-- Se muestra en la tarjeta de la promoción (carrusel del inicio y
-- /precios-y-promociones) cuando ambos campos tienen valor.
--   button_text  leyenda del botón, p. ej. "Compra aquí"
--   button_url   /ruta · #seccion (del inicio) · /ruta#seccion · https://...
--
-- Es idempotente: se puede volver a correr sin problema.
-- =============================================================================

ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS button_text TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS button_url TEXT;

-- Para que la API (PostgREST) vea las columnas nuevas de inmediato.
NOTIFY pgrst, 'reload schema';
