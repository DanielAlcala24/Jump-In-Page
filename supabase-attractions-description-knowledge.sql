-- Agrega campos opcionales a la tabla de atracciones:
--   description    -> se muestra en la vista pública (opcional)
--   knowledge_base -> solo informativo para el admin / consumo vía API (no se muestra en la web)
ALTER TABLE public.attractions
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS knowledge_base TEXT;
