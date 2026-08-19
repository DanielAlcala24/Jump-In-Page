-- =============================================================================
-- Base de conocimiento de ATRACCIONES (tabla public.attractions)
-- Llena la columna knowledge_base (y knowledge_category) de las atracciones que
-- YA existen, sin modificar name, category ni available_in.
-- Fuente: public/assets/docs/*.pdf + descripción de cada atracción.
--
-- REQUISITO PREVIO: ejecutar supabase-knowledge-base-is-active.sql
-- (agrega knowledge_category y knowledge_is_active a attractions).
--
-- El match es por `name` exacto (tal como están en Supabase). knowledge_is_active
-- se queda en true (su valor por defecto).
-- =============================================================================

UPDATE public.attractions SET
  knowledge_category = 'Atracciones Exclusivas',
  knowledge_base = 'Arena Futbol es una cancha cerrada para jugar futbol o futbolito dentro del parque, ideal para retas y actividades en grupo. Disponible en las sucursales: Miramontes e Interlomas.'
WHERE name = 'Arena Futbol';

UPDATE public.attractions SET
  knowledge_category = 'Atracciones Exclusivas',
  knowledge_base = 'Ball Blaster es una zona de batalla con cañones de aire que disparan pelotas de espuma, donde los jumpers cargan, apuntan y disparan mientras compiten. Disponible en las sucursales: Cuernavaca y Ecatepec.'
WHERE name = 'Ball Blaster';

UPDATE public.attractions SET
  knowledge_category = 'Atracciones Exclusivas',
  knowledge_base = 'Camino al Cielo (también llamado Escaleras al Cielo) es un reto de altura en el que se asciende por plataformas o escalones suspendidos usando arnés de seguridad, poniendo a prueba el equilibrio y la valentía. Disponible en las sucursales: La Cúspide, Interlomas y Ecatepec.'
WHERE name = 'Camino al cielo';

UPDATE public.attractions SET
  knowledge_category = 'Atracciones Exclusivas',
  knowledge_base = 'Climbing Wall (muro de escalar) es un muro de escalada con distintas rutas y niveles de dificultad, siempre con arnés de seguridad. Disponible en las sucursales: Churubusco, Coacalco, Interlomas, Ecatepec y Vallejo.'
WHERE name = 'Climbing wall';

UPDATE public.attractions SET
  knowledge_category = 'Trampolines',
  knowledge_base = 'Dodge Ball es la zona de trampolines donde se juega el clásico juego de quemados saltando: los equipos se eliminan lanzando pelotas mientras rebotan en los trampolines. Disponible en las sucursales: Churubusco, Interlomas, Coacalco, La Cúspide, Miramontes, Cuernavaca, Ecatepec y Vallejo.'
WHERE name = 'Dodge Ball';

UPDATE public.attractions SET
  knowledge_category = 'Atracciones Exclusivas',
  knowledge_base = 'Drop Slide es una resbaladilla de caída tipo descenso libre que termina en una zona de aterrizaje segura. Disponible exclusivamente en la sucursal Ecatepec.'
WHERE name = 'Drope slide';

UPDATE public.attractions SET
  knowledge_category = 'Atracciones Exclusivas',
  knowledge_base = 'Escape Room es una sala de juego temática en la que el equipo debe resolver acertijos y encontrar pistas para lograr salir dentro de un tiempo límite. Disponible exclusivamente en la sucursal Miramontes.'
WHERE name = 'Escape Room';

UPDATE public.attractions SET
  knowledge_category = 'Trampolines',
  knowledge_base = 'Foam Pit es la alberca de espuma donde los jumpers saltan desde el trampolín y caen de forma segura sobre cubos de espuma. Disponible en las sucursales: Churubusco, Interlomas, Coacalco, La Cúspide, Cuernavaca, Miramontes, Ecatepec y Vallejo.'
WHERE name = 'Foam Pit';

UPDATE public.attractions SET
  knowledge_category = 'Trampolines',
  knowledge_base = 'Jump Jam es una zona de trampolines interconectados para saltar libremente, brincar entre camas elásticas y hacer piruetas. Disponible en las sucursales: Churubusco, Interlomas, Coacalco, La Cúspide, Cuernavaca, Miramontes, Ecatepec y Vallejo.'
WHERE name = 'Jump Jam';

UPDATE public.attractions SET
  knowledge_category = 'Atracciones para los más pequeños',
  knowledge_base = 'Kids Zone es un área de juego suave diseñada especialmente para los niños más pequeños, con elementos seguros y acolchonados para que jueguen sin riesgo. Disponible en las sucursales: Cuernavaca, La Cúspide, Interlomas, Ecatepec, Churubusco y Miramontes.'
WHERE name = 'Kids Zone';

UPDATE public.attractions SET
  knowledge_category = 'Atracciones para los más pequeños',
  knowledge_base = 'El Laberinto de Obstáculos es un recorrido tipo playground con túneles, obstáculos y retos pensado para los más pequeños. Disponible en las sucursales: La Cúspide, Interlomas, Ecatepec y Churubusco.'
WHERE name = 'Laberinto de obstáculos';

UPDATE public.attractions SET
  knowledge_category = 'Trampolines',
  knowledge_base = 'Main Court es la cancha principal de trampolines, el área central y más amplia para saltar, rebotar entre las paredes elásticas y realizar acrobacias. Disponible en las sucursales: Churubusco, Interlomas, Coacalco, La Cúspide, Cuernavaca, Miramontes, Ecatepec y Vallejo.'
WHERE name = 'Main Court';

UPDATE public.attractions SET
  knowledge_category = 'Atracciones para los más pequeños',
  knowledge_base = 'Ropes Course Kids es un circuito de cuerdas y puentes en altura diseñado para los más pequeños, siempre con arnés de seguridad. Disponible en las sucursales: Churubusco, Cuernavaca, La Cúspide, Interlomas y Miramontes.'
WHERE name = 'Ropes Course Kids';

UPDATE public.attractions SET
  knowledge_category = 'Atracciones para los más pequeños',
  knowledge_base = 'Spider Tower es una torre de escalada tipo telaraña con redes y niveles para que los niños trepen de forma segura. Disponible en las sucursales: Coacalco, Cuernavaca, La Cúspide y Ecatepec. IMPORTANTE: actualmente se encuentra FUERA DE SERVICIO en la sucursal Coacalco.'
WHERE name = 'Spider Tower';
