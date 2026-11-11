-- =============================================================================
-- Enlace por imagen del popup (popup_config.link_url)
-- =============================================================================
-- Cada fila de popup_config es una imagen del popup. link_url es opcional:
--   /ruta              página del sitio            (ej. /shop)
--   #seccion           sección de la página de inicio (ej. #faq)
--   /ruta#seccion      sección de otra página
--   https://...        sitio externo (se abre en otra pestaña)
-- Vacío / NULL = la imagen no es clicable.
--
-- Es idempotente: se puede volver a correr sin problema.
-- =============================================================================

ALTER TABLE public.popup_config ADD COLUMN IF NOT EXISTS link_url TEXT;

-- Para que la API (PostgREST) vea la columna nueva de inmediato.
NOTIFY pgrst, 'reload schema';
