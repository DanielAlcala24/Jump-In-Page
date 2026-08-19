-- Configuración del banner superior de la página de inicio
-- Ejecutar en el SQL Editor de Supabase (https://supabase.com/dashboard/project/_/sql)

CREATE TABLE IF NOT EXISTS public.banner_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_active BOOLEAN DEFAULT false NOT NULL,
  -- Imagen para PC (escritorio)
  image_url TEXT,
  image_width INTEGER,
  image_height INTEGER,
  -- Imagen para móvil (opcional)
  mobile_image_url TEXT,
  mobile_image_width INTEGER,
  mobile_image_height INTEGER,
  -- Alto máximo (px) al mostrar la imagen de móvil en PC (franjas negras a los costados)
  desktop_max_height INTEGER DEFAULT 200,
  image_alt TEXT,
  link_url TEXT,
  is_dismissible BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_banner_config_active ON public.banner_config(is_active);

ALTER TABLE public.banner_config ENABLE ROW LEVEL SECURITY;

-- Lectura pública (el sitio web necesita leer la configuración)
DROP POLICY IF EXISTS "Permitir lectura pública del banner_config" ON public.banner_config;
CREATE POLICY "Permitir lectura pública del banner_config"
  ON public.banner_config
  FOR SELECT
  USING (true);

-- Escritura solo para usuarios autenticados (admin)
DROP POLICY IF EXISTS "Permitir inserción del banner_config para usuarios autenticados" ON public.banner_config;
CREATE POLICY "Permitir inserción del banner_config para usuarios autenticados"
  ON public.banner_config
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir actualización del banner_config para usuarios autenticados" ON public.banner_config;
CREATE POLICY "Permitir actualización del banner_config para usuarios autenticados"
  ON public.banner_config
  FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir eliminación del banner_config para usuarios autenticados" ON public.banner_config;
CREATE POLICY "Permitir eliminación del banner_config para usuarios autenticados"
  ON public.banner_config
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Mantener updated_at al día
CREATE OR REPLACE FUNCTION update_banner_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_banner_config_updated_at ON public.banner_config;
CREATE TRIGGER update_banner_config_updated_at
  BEFORE UPDATE ON public.banner_config
  FOR EACH ROW
  EXECUTE FUNCTION update_banner_config_updated_at();

-- Fila inicial (el admin trabaja siempre sobre una sola fila)
INSERT INTO public.banner_config (is_active, is_dismissible)
SELECT false, true
WHERE NOT EXISTS (SELECT 1 FROM public.banner_config);
