-- Agregar columna id_ticket a shop_orders (GUID del ticket enviado al webhook de venta).
-- Ejecutar en el SQL Editor de Supabase.

ALTER TABLE public.shop_orders
  ADD COLUMN IF NOT EXISTS id_ticket TEXT;

-- Índice para búsquedas / garantizar unicidad del ticket.
CREATE UNIQUE INDEX IF NOT EXISTS idx_shop_orders_id_ticket
  ON public.shop_orders(id_ticket)
  WHERE id_ticket IS NOT NULL;

-- Restricción UNIQUE en stripe_session_id: necesaria para el upsert idempotente del webhook
-- (onConflict: 'stripe_session_id') y para evitar órdenes duplicadas en reintentos de Stripe.
-- NOTA: si la tabla ya tiene filas con el mismo stripe_session_id, esto fallará; primero
-- elimina los duplicados antes de correr esta línea.
CREATE UNIQUE INDEX IF NOT EXISTS idx_shop_orders_stripe_session_id
  ON public.shop_orders(stripe_session_id);
