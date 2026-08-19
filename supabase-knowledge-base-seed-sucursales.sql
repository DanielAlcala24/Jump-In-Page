-- =============================================================================
-- Carga de base de conocimiento por sucursal (eventos / cumpleaños)
-- Fuente: public/assets/docs/*.pdf
-- Objetivo: que un chatbot externo tenga el conocimiento de cada sucursal para
-- responder correctamente (precios, paquetes, atracciones, capacidades, extras).
--
-- REQUISITOS PREVIOS: ejecutar antes las migraciones que agregan las columnas:
--   - supabase-knowledge-base-branches.sql   (branches)
--   - supabase-knowledge-base-category.sql   (knowledge_category)
--   - supabase-knowledge-base-is-active.sql  (is_active)
--
-- Nombres de sucursal usados en `branches` (deben coincidir con branches.name):
--   Churubusco · Coacalco · Cuernavaca · Ecatepec · Interlomas · La Cúspide ·
--   Miramontes · Vallejo
--
-- Nota: las preguntas se insertan activas (is_active = true).
--
-- IDEMPOTENTE: el DELETE de abajo borra primero cualquier carga previa de este
-- seed (identificada por su rango de `order` 100–999, exclusivo de este archivo)
-- y luego reinserta. Puedes correrlo las veces que quieras sin duplicar. También
-- limpia versiones anteriores del seed (p. ej. las preguntas de atracciones que
-- ya se movieron a la tabla attractions).
-- =============================================================================

DELETE FROM public.knowledge_base WHERE "order" BETWEEN 100 AND 999;

INSERT INTO public.knowledge_base (question, answer, knowledge_category, branches, is_active, "order")
VALUES

-- NOTA: las atracciones por sucursal NO van aquí; viven en la tabla
-- `attractions` (ver supabase-attractions-knowledge-base.sql).

-- ============================ CHURUBUSCO =====================================
(
  '¿Cuál es la capacidad para eventos en Churubusco?',
  'La sucursal Churubusco tiene capacidad máxima de 500 invitados por evento. Capacidad por zonas: Foam 30, RCK 100, Escaleras 120, Pantalla 150 y Palco 100.',
  'Eventos y capacidad', ARRAY['Churubusco'], true, 101
),
(
  '¿Cuáles son los paquetes de cumpleaños y precios en Churubusco?',
  'Paquetes de cumpleaños en Churubusco (mínimo 10 jumpers, precio por niño):
• Paquete 1: $389 lunes a jueves (4 h) / $439 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 5 jarras de agua por cada 10 jumpers o 4 refrescos de 2 L; bowl de palomitas (200 g); bowl de papas (200 g); bowl de verduras; calcetines antiderrapantes; pastel; bolsita de dulces; mesas reservadas; botarga durante el pastel; acceso a Cabina de Aire (un giro de ruleta para el cumpleañero).
• Paquete 2: $489 lunes a jueves (tiempo ilimitado) / $539 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; agua ilimitada o 4 refrescos de 2 L por cada 10 jumpers; 2 bowls de palomitas; pastel; piñata institucional; calcetines antiderrapantes; bolsita de dulces; mesas reservadas; botarga durante el pastel; acceso a Cabina de Aire.
• Paquete 3: $589 lunes a jueves (tiempo ilimitado) / $639 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 4 refrescos de 2 L por cada 10 jumpers; 1 bolsa de palomitas por niño; 2 charolas de verduras; pastel; piñata institucional; calcetines antiderrapantes; bolsita de dulces; mesas reservadas; botarga durante el pastel; acceso a Cabina de Aire; regalo sorpresa para el cumpleañero.',
  'Paquetes de cumpleaños', ARRAY['Churubusco'], true, 102
),
(
  '¿Cuánto cuesta el paquete de adultos en Churubusco?',
  'Paquete adulto en Churubusco: $245 por persona, incluye 1 hamburguesa o hot dog jumbo, papas, refresco, rebanada de pastel, lugar reservado y 1 hora de salto opcional. Opción sin uso de atracciones: $100 por persona, incluye acceso sin atracciones, lugar reservado y rebanada de pastel.',
  'Paquetes de adultos', ARRAY['Churubusco'], true, 103
),
(
  '¿Cuáles son los costos extra en Churubusco?',
  'Costos extra en Churubusco: descorche de piñata $500; descorche de pastel $250; mesa de dulces con costo según la cantidad de producto que ingrese el anfitrión.',
  'Costos extra', ARRAY['Churubusco'], true, 104
),

-- ============================ COACALCO =======================================
(
  '¿Cuál es la capacidad y distribución de zonas para eventos en Coacalco?',
  'Zonas y capacidad para eventos en Coacalco: Kids 1 para 60 personas, Kids 2 para 40 personas y Main para 40 personas.',
  'Eventos y capacidad', ARRAY['Coacalco'], true, 201
),
(
  '¿Cuáles son los paquetes de cumpleaños y precios en Coacalco?',
  'Paquetes de cumpleaños Coacalco 2026 (mínimo 10 invitados, precio por niño, todos incluyen mesas reservadas). IMPORTANTE: Coacalco maneja precios más bajos que otras sucursales.
• Paquete 1: $289 lunes a jueves (4 h) / $339 viernes a domingo (4 h). Incluye: alimentos (2 rebanadas de pizza o 2 hot dogs); 5 jarras de agua por cada 10 jumpers o 4 refrescos; bowl de palomitas; bowl de papas; bowl de verduras; calcetines antiderrapantes; pastel; bolsa de dulces; botarga durante el pastel; acceso a Cabina de Aire.
• Paquete 2: $389 lunes a jueves / $439 viernes a domingo. Incluye: alimentos; agua ilimitada; 2 bowls de palomitas (200 g); calcetines; pastel; bolsa de dulces; botarga; acceso a Cabina de Aire; piñata institucional.
• Paquete 3: $489 lunes a jueves / $539 viernes a domingo. Incluye: alimentos; agua ilimitada; 1 bolsa de palomitas por niño; 2 charolas de verduras por cada 10 jumpers; calcetines; pastel; bolsa de dulces; botarga; acceso a Cabina de Aire; piñata institucional; regalo sorpresa para el cumpleañero.',
  'Paquetes de cumpleaños', ARRAY['Coacalco'], true, 202
),
(
  '¿Cuánto cuesta el paquete de adultos en Coacalco?',
  'Paquete adulto en Coacalco: $245 por persona en cualquier paquete anterior, incluye 1 hamburguesa o hot dog jumbo, papas a la francesa, 1 refresco de lata, 1 rebanada de pastel, lugar reservado en la zona del evento y 1 hora de salto opcional. Opción sin uso de atracciones: $100 por persona, incluye acceso sin atracciones, lugar reservado y 1 rebanada de pastel.',
  'Paquetes de adultos', ARRAY['Coacalco'], true, 203
),
(
  '¿Cuáles son los costos extra en Coacalco?',
  'Costos extra en Coacalco: piñata $500; derecho a piso (mesas de dulces / shows externos) $1,000; pastel $250; calcetines antiderrapantes $60; consumo extra en cafetería con cargo aparte.',
  'Costos extra', ARRAY['Coacalco'], true, 204
),

-- ============================ CUERNAVACA =====================================
(
  '¿Cuál es la capacidad para eventos en Cuernavaca?',
  'La sucursal Cuernavaca tiene capacidad máxima de 150 invitados para eventos. Capacidad por zonas: Mezzanine izquierdo 50, Mezzanine derecho 50, Cafetería 25, Kids Zone 25 y Dodgeball 25.',
  'Eventos y capacidad', ARRAY['Cuernavaca'], true, 301
),
(
  '¿Cuáles son los paquetes de cumpleaños y precios en Cuernavaca?',
  'Paquetes de cumpleaños en Cuernavaca (mínimo 15 jumpers, precio por niño):
• Paquete 1: $489 tiempo ilimitado de lunes a jueves / $539 por 4 horas de viernes a domingo. Incluye: 2 rebanadas de pizza o 2 hot dogs; agua ilimitada durante el evento o 4 refrescos por cada 10 jumpers; 2 bowls de palomitas (200 g); pastel; piñata institucional; 1 par de calcetines para cada invitado; bolsitas de dulces para cada jumper; mesas reservadas; acceso a la cabina para obtener premios (solo el cumpleañero).
• Paquete 2: $589 tiempo ilimitado de lunes a jueves / $639 por 4 horas de viernes a domingo. Incluye: 2 rebanadas de pizza o 2 hot dogs; agua ilimitada o 4 refrescos por cada 10 jumpers; 1 bolsa de palomitas por niño; 2 charolas de verduras por cada 10 jumpers; pastel; piñata institucional; calcetines antideslizantes; bolsitas de dulces; mesas reservadas; acceso a cabina para premios (solo el cumpleañero); regalo sorpresa para el cumpleañero.',
  'Paquetes de cumpleaños', ARRAY['Cuernavaca'], true, 302
),
(
  '¿Cuánto cuesta el paquete de adultos en Cuernavaca?',
  'Paquetes de adultos en Cuernavaca:
• Paquete adulto 1: $245 todos los días. Incluye 1 hamburguesa o 1 hot dog jumbo con papas a la francesa y lata de refresco, 1 rebanada de pastel, lugar reservado en el evento y 1 hora de salto opcional.
• Paquete adulto 2: $100 por persona. Incluye acceso sin uso de atracciones, lugar reservado en el evento y 1 rebanada de pastel.',
  'Paquetes de adultos', ARRAY['Cuernavaca'], true, 303
),

-- ============================ ECATEPEC =======================================
(
  '¿Cuál es la capacidad de las zonas para eventos en Ecatepec?',
  'Zonas y capacidad de invitados en Ecatepec: Ventanal máximo 30 personas; Cafetería / Mezzanine máximo 40 personas; otra zona máximo 50 personas; Ropes Course máximo 50 personas; Ninja Course máximo 60 personas; Camino al Cielo máximo 60 personas; Camino al Cielo / Ninja máximo 120 personas. Tiempo extra de salto: 1 hora $150 por persona, 2 horas $200 por persona.',
  'Eventos y capacidad', ARRAY['Ecatepec'], true, 401
),
(
  '¿Cuáles son los paquetes de cumpleaños y precios en Ecatepec?',
  'Paquetes de cumpleaños en Ecatepec (mínimo 10 jumpers para la reservación, precio por persona):
• Paquete 1: $389 lunes a jueves / $439 viernes a domingo, duración 4 horas. Incluye: 2 rebanadas de pizza o 2 hot dogs; 5 jarras de agua o 4 refrescos de 2 L por cada 10 personas; 1 par de calcetines antiderrapantes por jumper; pastel para el total de invitados; bolsa de dulces por jumper; mesas reservadas; botarga durante el pastel; acceso a cabina de aire.
• Paquete 2: $489 lunes a jueves (tiempo ilimitado) / $539 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; agua ilimitada durante el evento o 4 refrescos de 2 L por cada 10 personas; 2 bowls de palomitas (200 g); calcetines antiderrapantes; pastel; bolsa de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire; piñata institucional.
• Paquete 3: $589 lunes a jueves / $639 viernes a domingo, duración 4 horas. Incluye: 2 rebanadas de pizza o 2 hot dogs; agua ilimitada o 4 refrescos de 2 L por cada 10 personas; 2 charolas de verduras y 1 bolsa de palomitas por jumper; calcetines antiderrapantes; pastel; bolsa de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire; piñata institucional; regalo sorpresa para el cumpleañero.',
  'Paquetes de cumpleaños', ARRAY['Ecatepec'], true, 402
),
(
  '¿Cuánto cuesta el paquete de adultos en Ecatepec?',
  'Paquetes de adultos en Ecatepec:
• Paquete adulto 1: $245 por persona. Incluye 1 hamburguesa de res o 1 hot dog jumbo con papas a la francesa, 1 refresco de lata, 1 rebanada de pastel, 1 hora de salto opcional y lugar reservado en el área del evento.
• Paquete adulto 2: $100 por persona. Incluye 1 rebanada de pastel y lugar reservado en el área del evento.',
  'Paquetes de adultos', ARRAY['Ecatepec'], true, 403
),
(
  '¿Cuáles son los costos extra en Ecatepec?',
  'Costos extra en Ecatepec: descorche por pastel, gelatina o cupcakes $250 c/u; descorche por ingresar piñata $500; piñata a la venta $1,000; aforo de show externo $1,000; bolsa de dulces extra $60; vaso promocional $30; 20% de descuento en ICEE en la compra de 10 piezas.',
  'Costos extra', ARRAY['Ecatepec'], true, 404
),

-- ============================ INTERLOMAS =====================================
(
  '¿Cuántos invitados se pueden tener en eventos en Interlomas?',
  'La capacidad del parque Interlomas para eventos es de aproximadamente 300 personas.',
  'Eventos y capacidad', ARRAY['Interlomas'], true, 501
),
(
  '¿Cuáles son los paquetes de cumpleaños y precios en Interlomas?',
  'Paquetes de cumpleaños en Interlomas (precio por niño):
• Paquete 1: $389 lunes a jueves (4 h) / $439 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 5 jarras de agua por cada 10 jumpers; bowl de palomitas; bowl de papas; bowl de verduras; calcetines antiderrapantes; pastel; bolsitas de dulces; mesas reservadas; botarga presente en la partida del pastel; acceso a cabina de aire para el cumpleañero.
• Paquete 2: $489 lunes a jueves (tiempo ilimitado) / $539 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; agua ilimitada; 2 bowls de palomitas; calcetines antiderrapantes; pastel; piñata institucional; bolsitas de dulces; mesas reservadas; botarga en la partida del pastel; acceso a cabina de aire para el cumpleañero.
• Paquete 3: $589 lunes a jueves (tiempo ilimitado) / $639 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 4 refrescos de 2 L por cada 10 jumpers; 1 bolsa de palomitas por niño; 2 bowls de verduras; calcetines antiderrapantes; pastel; bolsitas de dulces; piñata institucional; regalo sorpresa para el cumpleañero; mesas reservadas; botarga en la partida del pastel; acceso a cabina de aire para el cumpleañero.',
  'Paquetes de cumpleaños', ARRAY['Interlomas'], true, 502
),
(
  '¿Hay paquete Kosher en Interlomas?',
  'Sí. El Paquete Kosher de Interlomas cuesta $590 de lunes a domingo (evento de 4 horas). Incluye: 2 rebanadas de pizza (Pizzería AJLA); 5 jarras de agua natural o 4 refrescos familiares; bowl de papas (Sabritas); pastel; bolsitas de dulces; y mesas reservadas. Extra: bolsa de dulces kosher $65.',
  'Paquetes de cumpleaños', ARRAY['Interlomas'], true, 503
),
(
  '¿Cuánto cuesta el paquete de adultos en Interlomas?',
  'Paquete adulto en Interlomas: $245 por persona, incluye 1 hamburguesa o 1 hot dog jumbo, papas a la francesa, 1 refresco de lata, rebanada de pastel, lugar reservado y 1 hora de salto (no incluye calcetines). Opción de $100 por persona: rebanada de pastel y lugar reservado.',
  'Paquetes de adultos', ARRAY['Interlomas'], true, 504
),
(
  '¿Cuáles son los costos extra en Interlomas?',
  'Costos extra en Interlomas: ingreso de alimentos con descorche de $100 por persona; ingresar show $1,000; tablón para 10 personas $500; calcetines antiderrapantes extra $60 c/u; bolsa de dulces $60; bolsa de dulces kosher $65; mesa de dulces con costo según la cantidad; piñata $500; pastel $250.',
  'Costos extra', ARRAY['Interlomas'], true, 505
),

-- ============================ LA CÚSPIDE =====================================
(
  '¿Cuáles son los paquetes de cumpleaños y precios en La Cúspide?',
  'Paquetes de cumpleaños en La Cúspide (precio por niño):
• Paquete 1: $389 lunes a jueves (4 h) / $439 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 5 jarras de agua por cada 10 jumpers o 4 refrescos de 2 L; bowl de palomitas (200 g); bowl de papas (200 g); bowl de verduras; calcetines antiderrapantes; pastel; bolsitas de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire para el cumpleañero.
• Paquete 2: $489 lunes a jueves (tiempo ilimitado) / $539 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; agua ilimitada o 4 refrescos de 2 L por cada 10 jumpers; 2 bowls de palomitas (200 g); pastel; piñata institucional; calcetines antiderrapantes; bolsitas de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire.
• Paquete 3: $589 lunes a jueves (tiempo ilimitado) / $639 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 4 refrescos de 2 L por cada 10 jumpers; 1 bolsa de palomitas por niño; 2 charolas de verduras por cada 10 jumpers; pastel; piñata institucional; calcetines antiderrapantes; bolsitas de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire; regalo sorpresa para el cumpleañero.',
  'Paquetes de cumpleaños', ARRAY['La Cúspide'], true, 601
),
(
  '¿Cuáles son los costos extra en La Cúspide?',
  'Costos extra en La Cúspide: shows $1,000; descorche de piñata $500; piñata a la venta $1,000; descorche (pastel, gelatinas, cupcakes) $250; hora extra de fiesta $150; calcetas antiderrapantes $60 c/u.',
  'Costos extra', ARRAY['La Cúspide'], true, 602
),

-- ============================ MIRAMONTES =====================================
(
  '¿Cuál es la capacidad de las zonas para eventos en Miramontes?',
  'Áreas de eventos y aforo máximo en Miramontes: Cafetería 50, Kids 50 y Foam 30.',
  'Eventos y capacidad', ARRAY['Miramontes'], true, 701
),
(
  '¿Cuáles son los paquetes de cumpleaños y precios en Miramontes?',
  'Paquetes de cumpleaños en Miramontes (precio por niño):
• Paquete 1: $389 lunes a jueves (4 h) / $439 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 5 jarras de agua por cada 10 jumpers o 4 refrescos de 2 L; bowl de palomitas (200 g), bowl de papas (200 g) y bowl de verduras; 1 par de calcetines antiderrapantes por jumper; pastel y bolsitas de dulces por jumper; mesas reservadas; botarga durante la partida del pastel; acceso del cumpleañero a la cabina de aire con oportunidad de ganar premios.
• Paquete 2: $489 lunes a jueves (tiempo ilimitado) / $539 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; agua ilimitada o 4 refrescos de 2 L por cada 10 jumpers; 2 bowls de palomitas (200 g); pastel y piñata institucional; calcetines antiderrapantes; bolsitas de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire.
• Paquete 3: $589 lunes a jueves (tiempo ilimitado) / $639 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 4 refrescos de 2 L por cada 10 jumpers; 1 bolsa de palomitas por niño y 2 charolas de verduras por cada 10 jumpers; pastel y piñata institucional; calcetines antiderrapantes; bolsitas de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire; 1 regalo sorpresa para el cumpleañero.',
  'Paquetes de cumpleaños', ARRAY['Miramontes'], true, 702
),
(
  '¿Cuánto cuesta el paquete de adultos en Miramontes?',
  'Paquete adulto en Miramontes: $245 por persona, incluye 1 hamburguesa o 1 hot dog jumbo, papas a la francesa, 1 refresco de lata, 1 rebanada de pastel, lugar reservado en la zona del evento y 1 hora de salto opcional. Opción sin uso de atracciones: $100 por persona, incluye acceso sin atracciones, lugar reservado y 1 rebanada de pastel.',
  'Paquetes de adultos', ARRAY['Miramontes'], true, 703
),
(
  '¿Cuáles son los costos extra en Miramontes?',
  'Costos extra en Miramontes: descorche de pastel o gelatina $250; descorche de piñata $500; mesa de dulces $1,000; ingreso de shows $1,000.',
  'Costos extra', ARRAY['Miramontes'], true, 704
),

-- ============================ VALLEJO ========================================
(
  '¿Cuál es la capacidad para eventos en Vallejo?',
  'La sucursal Vallejo cuenta con un área de eventos ubicada en el balcón (mezzanine) con capacidad para hasta 120 personas, que puede dividirse en sección izquierda, derecha o central según las necesidades del cliente. Cuando se rebasa la capacidad del mezzanine, se habilita la zona de billar como área para fiestas, con capacidad para 30 personas.',
  'Eventos y capacidad', ARRAY['Vallejo'], true, 801
),
(
  '¿Cuáles son los paquetes de cumpleaños y precios en Vallejo?',
  'Paquetes de cumpleaños en Vallejo (precio por niño):
• Paquete 1: $389 lunes a jueves (4 h) / $439 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 5 jarras de agua por cada 10 jumpers o 4 refrescos de 2 L; bowl de palomitas (200 g); bowl de papas (200 g); bowl de verduras; calcetines antiderrapantes; pastel; bolsitas de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire para el cumpleañero.
• Paquete 2: $489 lunes a jueves (tiempo ilimitado) / $539 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; agua ilimitada o 4 refrescos de 2 L por cada 10 jumpers; 2 bowls de palomitas (200 g); pastel; piñata institucional; calcetines antiderrapantes; bolsitas de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire.
• Paquete 3: $589 lunes a jueves (tiempo ilimitado) / $639 viernes a domingo (4 h). Incluye: 2 rebanadas de pizza o 2 hot dogs; 4 refrescos de 2 L por cada 10 jumpers; 1 bolsa de palomitas por niño; 2 charolas de verduras por cada 10 jumpers; pastel; piñata institucional; calcetines antiderrapantes; bolsitas de dulces; mesas reservadas; botarga durante el pastel; acceso a cabina de aire; regalo sorpresa para el cumpleañero.
El paquete más solicitado es el Paquete 2 ($489 lunes a jueves / $539 viernes a domingo).',
  'Paquetes de cumpleaños', ARRAY['Vallejo'], true, 802
),
(
  '¿Cuánto cuesta el paquete de adultos en Vallejo?',
  'Paquete adulto en Vallejo: $245 por persona en cualquier paquete anterior, incluye 1 hamburguesa o 1 hot dog jumbo, papas a la francesa, 1 refresco de lata, 1 rebanada de pastel, lugar reservado en la zona del evento y 1 hora de salto opcional. Opción sin uso de atracciones: $100 por persona, incluye acceso sin atracciones, lugar reservado y 1 rebanada de pastel.',
  'Paquetes de adultos', ARRAY['Vallejo'], true, 803
),
(
  '¿Cuáles son los costos extra en Vallejo?',
  'Costos extra en Vallejo: mesa de dulces y aforo de payaso $1,000; descorche de pastel y gelatina $250; descorche de piñata $500; tablón extra para 15 personas $500; hora extra $150; agua ilimitada $30 (tanto para niños como adultos); oblea personalizada $100; mesa de billar $80.',
  'Costos extra', ARRAY['Vallejo'], true, 804
),
(
  '¿Manejan paquetes de graduación en Vallejo?',
  'En Vallejo, para graduaciones, en muchas ocasiones los clientes terminan optando por un paquete de cumpleaños, ya que al comparar ambas opciones no perciben una diferencia significativa que justifique el costo adicional del paquete de graduación. Por ello, frecuentemente las graduaciones se realizan bajo el esquema de paquete de cumpleaños.',
  'Eventos y capacidad', ARRAY['Vallejo'], true, 805
);
