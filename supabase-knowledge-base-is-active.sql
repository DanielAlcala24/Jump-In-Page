-- Bandera de activación para la base de conocimiento.
-- Permite desactivar respuestas/contenido desactualizado sin borrarlo. NO afecta
-- la vista pública del registro; solo indica si la base de conocimiento está
-- activa para detectarse (o no) en otras plataformas / consumo vía API.

-- Cada pregunta/respuesta de la base de conocimiento.
ALTER TABLE public.knowledge_base
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Para las entidades con knowledge_base se usa `knowledge_is_active`
-- (separado de cualquier estado público del registro) para dejar claro que
-- solo activa/desactiva el contenido de la base de conocimiento.
ALTER TABLE public.attractions
  ADD COLUMN IF NOT EXISTS knowledge_is_active BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS knowledge_is_active BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.birthday_packages
  ADD COLUMN IF NOT EXISTS knowledge_is_active BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS knowledge_is_active BOOLEAN NOT NULL DEFAULT true;
