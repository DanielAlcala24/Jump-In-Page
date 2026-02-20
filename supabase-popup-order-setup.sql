-- Migración para permitir el ordenamiento de imágenes en el popup
-- Ejecutar este script en el SQL Editor de Supabase (https://supabase.com/dashboard/project/_/sql)

-- 1. Agregar las nuevas columnas a popup_config
-- Asumimos que queremos convertir la tabla de una sola fila con array a múltiples filas
ALTER TABLE public.popup_config ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.popup_config ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- 2. (Manual) Si ya tienes datos en la columna 'images' (array), 
-- este script intentará migrar la primera fila a varias filas individuales
DO $$
DECLARE
    r RECORD;
    img TEXT;
    idx INTEGER := 0;
BEGIN
    FOR r IN SELECT * FROM public.popup_config WHERE images IS NOT NULL AND array_length(images, 1) > 0 LIMIT 1 LOOP
        FOREACH img IN ARRAY r.images LOOP
            INSERT INTO public.popup_config (is_active, image_url, order_index)
            VALUES (r.is_active, img, idx);
            idx := idx + 1;
        END LOOP;
        
        -- Opcional: Eliminar la fila original que tenía el array para evitar duplicados en la nueva lógica
        DELETE FROM public.popup_config WHERE id = r.id;
    END LOOP;
END $$;

-- 3. Limpiar la tabla si quedó algo vacío o inconsistente (opcional)
-- ALTER TABLE public.popup_config ALTER COLUMN images DROP NOT NULL;
