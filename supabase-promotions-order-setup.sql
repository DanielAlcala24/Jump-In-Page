-- Migración para permitir el ordenamiento de promociones
-- Ejecutar este script en el SQL Editor de Supabase (https://supabase.com/dashboard/project/_/sql)

-- 1. Agregar columna de orden a las promociones
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- 2. Actualizar el orden_index de las promociones existentes basado en su fecha de creación
-- para mantener el orden actual inicialmente
WITH sequenced_promotions AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM public.promotions
)
UPDATE public.promotions
SET order_index = sequenced_promotions.row_num
FROM sequenced_promotions
WHERE public.promotions.id = sequenced_promotions.id;
