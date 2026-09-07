-- Grupos de productos de la tienda (/shop).
--
-- Sirven para mostrar varios productos de Stripe como UNA sola tarjeta con
-- selector, p. ej. "Calcetines Jump-In" con sus tallas. Los productos siguen
-- viviendo en Stripe con su propia descripción, precio e Id_Articulo: aquí solo
-- se guarda la agrupación para la vista del cliente.
--
-- Ejecutar en el SQL Editor de Supabase (https://supabase.com/dashboard/project/_/sql)

CREATE TABLE IF NOT EXISTS public.shop_product_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Título que se muestra en la tarjeta del grupo.
  name TEXT NOT NULL,
  -- Descripción del grupo (opcional). Si se deja vacía, la tarjeta muestra la
  -- descripción del producto que el cliente tenga seleccionado.
  description TEXT,
  -- Imagen del grupo (opcional). Si se deja vacía, se usa la del producto
  -- seleccionado.
  image_url TEXT,
  -- IDs de producto de Stripe ("prod_...") EN EL ORDEN en que se muestran.
  product_ids TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  -- Orden de la tarjeta del grupo dentro de su sección.
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_shop_product_groups_active
  ON public.shop_product_groups(is_active);

ALTER TABLE public.shop_product_groups ENABLE ROW LEVEL SECURITY;

-- Lectura pública: /shop necesita leer los grupos sin sesión.
DROP POLICY IF EXISTS "Lectura publica de shop_product_groups" ON public.shop_product_groups;
CREATE POLICY "Lectura publica de shop_product_groups"
  ON public.shop_product_groups
  FOR SELECT
  USING (true);

-- Escritura solo para el admin (usuarios autenticados).
DROP POLICY IF EXISTS "Insercion de shop_product_groups para autenticados" ON public.shop_product_groups;
CREATE POLICY "Insercion de shop_product_groups para autenticados"
  ON public.shop_product_groups
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Actualizacion de shop_product_groups para autenticados" ON public.shop_product_groups;
CREATE POLICY "Actualizacion de shop_product_groups para autenticados"
  ON public.shop_product_groups
  FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Eliminacion de shop_product_groups para autenticados" ON public.shop_product_groups;
CREATE POLICY "Eliminacion de shop_product_groups para autenticados"
  ON public.shop_product_groups
  FOR DELETE
  USING (auth.role() = 'authenticated');
