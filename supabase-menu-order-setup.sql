-- Migración para permitir el ordenamiento de platillos y categorías
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Agregar columna de orden a los platillos
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- 2. Crear tabla para gestionar el orden de las categorías
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar RLS para la nueva tabla
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas de acceso para la tabla de categorías
-- Permitir lectura pública (para que el sitio web pueda verlas)
CREATE POLICY "Permitir lectura pública de categorías" 
ON public.menu_categories FOR SELECT 
TO public 
USING (true);

-- Permitir gestión total a usuarios autenticados (admin)
CREATE POLICY "Permitir gestión total a usuarios autenticados" 
ON public.menu_categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Llenar la tabla de categorías con las categorías actuales
INSERT INTO public.menu_categories (name)
SELECT DISTINCT category FROM public.menu_items
ON CONFLICT (name) DO NOTHING;
