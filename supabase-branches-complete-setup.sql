-- Actualizar tabla de sucursales con todos los campos necesarios
ALTER TABLE IF EXISTS public.branches 
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS map_link TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS horarios TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prices JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS attractions JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Crear índice para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_branches_state ON public.branches(state);

-- Migrar datos existentes si es necesario (opcional)
-- Aquí puedes agregar UPDATE statements para migrar datos de las páginas estáticas

-- Estructura esperada:
-- prices: [{"title": "1 hora", "price": "$220", "description": "...", "image": "/assets/..."}]
-- attractions: [{"name": "Arena Futbol", "image": "/assets/..."}]
-- gallery: [{"src": "/assets/g1.jpg", "alt": "..."}]

