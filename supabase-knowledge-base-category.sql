-- Agrega categoría a la base de conocimiento (preguntas/respuestas) y una
-- categoría de conocimiento independiente a las tablas que tienen la columna
-- knowledge_base (atracciones, promociones, paquetes de cumpleaños y menú).
--
-- En menu_items NO se reutiliza la columna `category` (que es la categoría
-- pública del menú): se usa una columna separada `knowledge_category` para no
-- afectar la vista pública.

-- Categoría de cada pregunta/respuesta de la base de conocimiento.
-- Si una versión previa creó la columna `category`, se renombra a
-- `knowledge_category`; de lo contrario se crea directamente.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'knowledge_base'
      AND column_name = 'category'
  ) THEN
    ALTER TABLE public.knowledge_base RENAME COLUMN category TO knowledge_category;
  END IF;
END $$;

ALTER TABLE public.knowledge_base
  ADD COLUMN IF NOT EXISTS knowledge_category TEXT;

-- Categoría de conocimiento (uso interno / consumo vía API) para las entidades
-- que tienen knowledge_base. Independiente de cualquier categoría pública.
ALTER TABLE public.attractions
  ADD COLUMN IF NOT EXISTS knowledge_category TEXT;

ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS knowledge_category TEXT;

ALTER TABLE public.birthday_packages
  ADD COLUMN IF NOT EXISTS knowledge_category TEXT;

ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS knowledge_category TEXT;
