-- Imagen separada para móvil en el banner superior
-- Ejecutar en el SQL Editor de Supabase (https://supabase.com/dashboard/project/_/sql)
-- Requiere haber ejecutado antes supabase-banner-setup.sql

-- image_url / image_width / image_height = imagen para PC (escritorio)
-- mobile_image_url / mobile_image_width / mobile_image_height = imagen para móvil
ALTER TABLE public.banner_config ADD COLUMN IF NOT EXISTS mobile_image_url TEXT;
ALTER TABLE public.banner_config ADD COLUMN IF NOT EXISTS mobile_image_width INTEGER;
ALTER TABLE public.banner_config ADD COLUMN IF NOT EXISTS mobile_image_height INTEGER;

-- Alto máximo (px) al mostrar la imagen de móvil en PC.
-- En ese caso la imagen se centra y aparecen franjas negras a los costados.
ALTER TABLE public.banner_config ADD COLUMN IF NOT EXISTS desktop_max_height INTEGER DEFAULT 200;

-- Refresca el caché de esquema de PostgREST. Sin esto la API puede seguir
-- respondiendo: Could not find the 'desktop_max_height' column ... in the schema cache
NOTIFY pgrst, 'reload schema';
