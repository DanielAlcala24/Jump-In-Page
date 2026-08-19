-- Agregar columna Id_Terminal a la tabla branches y asignar el valor por sucursal.
-- Ejecutar en el SQL Editor de Supabase.

-- 1) Crear la columna (tipo UUID). Se usa nombre con comillas para conservar mayúsculas.
ALTER TABLE public.branches
  ADD COLUMN IF NOT EXISTS "Id_Terminal" UUID;

-- 2) Asignar el valor por sucursal (match por nombre, sin acentos, con ILIKE).
UPDATE public.branches SET "Id_Terminal" = 'bef2b8d8-f5bd-4ff1-a7e8-955633e70cf4' WHERE name ILIKE '%churubusco%';
UPDATE public.branches SET "Id_Terminal" = '4927d209-bffe-4403-8563-a8c2aa21f4dd' WHERE name ILIKE '%coacalco%';
UPDATE public.branches SET "Id_Terminal" = '76111caa-9cf5-4ea2-999d-0bfcd23745e7' WHERE name ILIKE '%cuernavaca%';
UPDATE public.branches SET "Id_Terminal" = '888d9424-317d-464b-b11f-37d38ed217dd' WHERE name ILIKE '%spide%';       -- Cúspide / La Cúspide
UPDATE public.branches SET "Id_Terminal" = '66626121-2491-4fbb-bf5a-0bd2303d091c' WHERE name ILIKE '%ecatepec%';
UPDATE public.branches SET "Id_Terminal" = 'a5e05a01-9b19-4bc1-a824-28d3c19b2dba' WHERE name ILIKE '%interlomas%';
UPDATE public.branches SET "Id_Terminal" = '1facd0c2-4e4b-4b37-8589-4d459984cf34' WHERE name ILIKE '%miramontes%';
UPDATE public.branches SET "Id_Terminal" = '72ba8fe8-e4e2-4a83-b886-c1f8cbfa95c4' WHERE name ILIKE '%vallejo%';

-- 3) Verificar resultado.
SELECT name, "Id_Terminal" FROM public.branches ORDER BY name;
