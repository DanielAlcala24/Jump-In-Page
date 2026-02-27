-- Migración para permitir asociar paquetes de cumpleaños a sucursales
-- Ejecutar este script en el SQL Editor de Supabase (https://supabase.com/dashboard/project/_/sql)

-- 1. Agregar columna available_in a birthday_packages
ALTER TABLE public.birthday_packages ADD COLUMN IF NOT EXISTS available_in TEXT[] DEFAULT '{}';

-- 2. (Opcional) Inicializar con 'Todas las sucursales' para los paquetes existentes
-- UPDATE public.birthday_packages SET available_in = ARRAY['Todas las sucursales'] WHERE available_in = '{}' OR available_in IS NULL;
