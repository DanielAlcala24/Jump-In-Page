-- Menú de alimentos: disponibilidad por sucursal + base de conocimiento interna
--   available_in   -> sucursales donde está disponible el producto (se muestra en la web)
--   knowledge_base -> solo informativo para el admin / consumo vía API (no se muestra en la web)
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS available_in TEXT[] DEFAULT ARRAY['Todas las sucursales']::TEXT[],
  ADD COLUMN IF NOT EXISTS knowledge_base TEXT;
