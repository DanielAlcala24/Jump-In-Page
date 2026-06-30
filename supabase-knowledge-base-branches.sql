-- Agrega la columna `branches` a la tabla knowledge_base para ligar cada
-- pregunta/respuesta a una sucursal, varias sucursales o todas las sucursales.
--
-- Convención: un arreglo con el valor 'Todas las sucursales' significa que la
-- entrada aplica para todas. De lo contrario contiene los nombres de las
-- sucursales específicas (branches.name), igual que menu_items.available_in.

ALTER TABLE public.knowledge_base
  ADD COLUMN IF NOT EXISTS branches TEXT[] NOT NULL DEFAULT ARRAY['Todas las sucursales']::TEXT[];

-- Las entradas existentes quedan asociadas a "Todas las sucursales" por defecto.
UPDATE public.knowledge_base
SET branches = ARRAY['Todas las sucursales']::TEXT[]
WHERE branches IS NULL OR array_length(branches, 1) IS NULL;
