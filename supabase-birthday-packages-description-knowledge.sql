-- Paquetes de cumpleaños: descripción ahora opcional + base de conocimiento interna
--   knowledge_base -> solo informativo para el admin / consumo vía API (no se muestra en la web)
ALTER TABLE public.birthday_packages
  ADD COLUMN IF NOT EXISTS knowledge_base TEXT;

-- Hacer opcional la descripción (por si la columna se creó como NOT NULL)
ALTER TABLE public.birthday_packages
  ALTER COLUMN description DROP NOT NULL;
