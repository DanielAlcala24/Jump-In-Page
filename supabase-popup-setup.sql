-- Crear tabla para la configuración del popup
CREATE TABLE IF NOT EXISTS public.popup_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_active BOOLEAN DEFAULT false NOT NULL,
  images TEXT[] DEFAULT '{}' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_popup_config_active ON public.popup_config(is_active);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.popup_config ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública (para que el sitio web pueda leer la configuración)
CREATE POLICY "Permitir lectura pública del popup_config"
  ON public.popup_config
  FOR SELECT
  USING (true);

-- Política para permitir que usuarios autenticados puedan actualizar
CREATE POLICY "Permitir actualización del popup_config para usuarios autenticados"
  ON public.popup_config
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Política para permitir que usuarios autenticados puedan insertar
CREATE POLICY "Permitir inserción del popup_config para usuarios autenticados"
  ON public.popup_config
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Crear función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_popup_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_popup_config_updated_at
  BEFORE UPDATE ON public.popup_config
  FOR EACH ROW
  EXECUTE FUNCTION update_popup_config_updated_at();

-- Insertar configuración inicial (opcional)
-- INSERT INTO public.popup_config (is_active, images) 
-- VALUES (false, '{}')
-- ON CONFLICT DO NOTHING;
