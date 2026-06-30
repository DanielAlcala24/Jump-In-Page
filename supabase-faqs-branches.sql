-- Agrega la columna `branches` a la tabla faqs para ligar cada pregunta
-- frecuente a una sucursal, varias sucursales o todas las sucursales.
--
-- Convención: un arreglo con el valor 'Todas las sucursales' significa que la
-- pregunta aplica para todas. De lo contrario contiene los nombres de las
-- sucursales específicas (branches.name), igual que knowledge_base.branches.

ALTER TABLE public.faqs
  ADD COLUMN IF NOT EXISTS branches TEXT[] NOT NULL DEFAULT ARRAY['Todas las sucursales']::TEXT[];

-- Las preguntas existentes quedan asociadas a "Todas las sucursales" por defecto.
UPDATE public.faqs
SET branches = ARRAY['Todas las sucursales']::TEXT[]
WHERE branches IS NULL OR array_length(branches, 1) IS NULL;
