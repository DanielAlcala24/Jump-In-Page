-- =============================================================================
-- Reglamentos de ATRACCIONES → base de conocimiento (tabla public.attractions)
-- Enriquece la columna knowledge_base agregando el REGLAMENTO (reglas de uso y
-- seguridad) de cada atracción, conservando la descripción ya existente.
-- Fuente: lonas/reglamentos oficiales Jump-In (imágenes WhatsApp 2026-07-01).
--
-- El match es por `name` exacto (tal como están en Supabase). Cada UPDATE
-- REESCRIBE el knowledge_base completo (descripción + reglamento), por lo que es
-- idempotente: se puede ejecutar varias veces sin duplicar el reglamento.
--
-- REQUISITO PREVIO: haber ejecutado supabase-attractions-knowledge-base.sql
-- (deja en knowledge_base la descripción base de cada atracción).
--
-- NOTA: el reglamento de "Ropes Course" (versión adultos, estatura MÍNIMA 1.51 m)
-- NO se incluye aquí porque esa atracción no existe como registro propio en la
-- tabla; solo existe "Ropes Course Kids" (estatura MÁXIMA 1.50 m). Ver imagen 7.
-- =============================================================================

-- 1) KIDS ZONE ----------------------------------------------------------------
UPDATE public.attractions SET
  knowledge_base = 'Kids Zone es un área de juego suave diseñada especialmente para los niños más pequeños, con elementos seguros y acolchonados para que jueguen sin riesgo. Disponible en las sucursales: Cuernavaca, La Cúspide, Interlomas, Ecatepec, Churubusco y Miramontes.'
    || E'\n\nReglamento Kids Zone:\n'
    || E'- Acceso únicamente con calcetines antiderrapantes (obligatorios para entrar a cualquier área de Kids Zone).\n'
    || E'- Prohibido entrar con alimentos y bebidas.\n'
    || E'- Altura máxima 1.30 m: prohibido el acceso a mayores de 1.30 m.\n'
    || E'- Área sin supervisión de staff; favor de cuidar a sus hijos.\n'
    || E'- Siempre vacíe sus bolsillos antes de saltar. No porte objetos afilados o punzocortantes; los dispositivos no autorizados (cámaras, celulares, etc.) no están permitidos en las áreas de trampolines.\n'
    || E'- El incumplimiento de estas normas puede rescindir el uso de atracciones.'
WHERE name = 'Kids Zone';

-- 2) DODGE BALL ---------------------------------------------------------------
UPDATE public.attractions SET
  knowledge_base = 'Dodge Ball es la zona de trampolines donde se juega el clásico juego de quemados saltando: los equipos se eliminan lanzando pelotas mientras rebotan en los trampolines. Disponible en las sucursales: Churubusco, Interlomas, Coacalco, La Cúspide, Miramontes, Cuernavaca, Ecatepec y Vallejo.'
    || E'\n\nReglamento Dodgeball:\n'
    || E'- El juego inicia cuando los jugadores de cada equipo están pegados a las paredes del trampolín y los balones alineados al centro de la cancha.\n'
    || E'- El árbitro silba para el inicio del partido; respeta siempre al árbitro. Al silbatazo los jugadores corren por los balones y regresan a la pared para poder quemar a los contrincantes.\n'
    || E'- Se permiten máximo 6 jugadores por equipo.\n'
    || E'- Estás quemado si: el balón te golpea de hombros a pies; un jugador del equipo contrario atrapa el balón en el aire al primer contacto (en ese caso regresa al partido un jugador que ya estaba quemado); rebasas el centro de la arena para quemar al contrincante o tomar el balón; o lanzas el balón a la cabeza de un jugador.\n'
    || E'- Cuando estés quemado, el staff te indicará el lugar de espera.\n'
    || E'- Prohibido sentarse o acostarse en el trampolín.\n'
    || E'- El uso de calcetines antiderrapantes es obligatorio para entrar a cualquier área de trampolines.\n'
    || E'- Siempre vacíe sus bolsillos antes de saltar. No porte objetos afilados o punzocortantes; los dispositivos no autorizados (cámaras, celulares, etc.) no están permitidos en las áreas de trampolines.\n'
    || E'- Siga siempre las indicaciones de los supervisores de la cancha. El incumplimiento puede expulsarte del área de salto; eres responsable de evitar que otros te golpeen.'
WHERE name = 'Dodge Ball';

-- 3) CAMINO AL CIELO ----------------------------------------------------------
UPDATE public.attractions SET
  knowledge_base = 'Camino al Cielo (también llamado Escaleras al Cielo) es un reto de altura en el que se asciende por plataformas o escalones suspendidos usando arnés de seguridad, poniendo a prueba el equilibrio y la valentía. Disponible en las sucursales: La Cúspide, Interlomas y Ecatepec.'
    || E'\n\nReglamento Camino al Cielo:\n'
    || E'- El uso de calcetines antiderrapantes es obligatorio para entrar a cualquier área de trampolines.\n'
    || E'- Espera en la fila tu turno.\n'
    || E'- Permite que el personal de staff te ponga el equipo correspondiente (casco y arnés).\n'
    || E'- Escucha con atención las instrucciones de cómo operar el equipo.\n'
    || E'- Al terminar tu recorrido baja con precaución; bajar de manera rápida podría producir un accidente.\n'
    || E'- Por tu seguridad no intentes quitarte el equipo; solo el personal de staff puede manipularlo.\n'
    || E'- Siempre vacíe sus bolsillos antes de subir. No porte objetos afilados o punzocortantes; los dispositivos no autorizados (cámaras, celular, etc.) no están permitidos en el camino al cielo.\n'
    || E'- Siga siempre las indicaciones de los supervisores de área. El incumplimiento puede expulsarte del camino al cielo; eres responsable de evitar accidentes.'
WHERE name = 'Camino al cielo';

-- 4) CLIMBING WALL ------------------------------------------------------------
UPDATE public.attractions SET
  knowledge_base = 'Climbing Wall (muro de escalar) es un muro de escalada con distintas rutas y niveles de dificultad, siempre con arnés de seguridad. Disponible en las sucursales: Churubusco, Coacalco, Interlomas, Ecatepec y Vallejo.'
    || E'\n\nReglamento Climbing Wall:\n'
    || E'- Espera en la fila tu turno.\n'
    || E'- Permite que el personal de staff te ponga el equipo correspondiente (casco y arnés).\n'
    || E'- Escucha con atención las instrucciones de cómo operar el equipo.\n'
    || E'- Al terminar tu recorrido baja con precaución; bajar de manera rápida podría producir un accidente.\n'
    || E'- Por tu seguridad no intentes quitarte el equipo; solo el personal de staff puede manipularlo.\n'
    || E'- El incumplimiento de estas reglas puede expulsarte del área de escalar. Jump-In no se hace responsable por daños o pérdida de objetos.'
WHERE name = 'Climbing wall';

-- 5) FOAM PIT -----------------------------------------------------------------
UPDATE public.attractions SET
  knowledge_base = 'Foam Pit es la alberca de espuma donde los jumpers saltan desde el trampolín y caen de forma segura sobre cubos de espuma. Disponible en las sucursales: Churubusco, Interlomas, Coacalco, La Cúspide, Cuernavaca, Miramontes, Ecatepec y Vallejo.'
    || E'\n\nReglamento Foam Pit:\n'
    || E'- Espera en la fila tu turno.\n'
    || E'- Entra sólo una persona a la vez.\n'
    || E'- No te avientes si hay alguien dentro de la fosa; sal pronto, recuerda que hay más personas esperando.\n'
    || E'- Puedes entrar cuando el staff de área lo indique.\n'
    || E'- No sacar cubos de la fosa.\n'
    || E'- Prohibido sentarse o acostarse en el trampolín.\n'
    || E'- El uso de calcetines antiderrapantes es obligatorio para entrar a cualquier área de trampolines.\n'
    || E'- Siempre vacíe sus bolsillos antes de saltar. No porte objetos afilados o punzocortantes; los dispositivos no autorizados (cámaras, celulares, etc.) no están permitidos en las áreas de trampolines.\n'
    || E'- El incumplimiento de estas normas puede rescindir el uso de atracciones; eres responsable de evitar que otros te golpeen.'
WHERE name = 'Foam Pit';

-- 6) ROPES COURSE KIDS (imagen "Ropes Kids", estatura MÁXIMA 1.50 m) ----------
UPDATE public.attractions SET
  knowledge_base = 'Ropes Course Kids es un circuito de cuerdas y puentes en altura diseñado para los más pequeños, siempre con arnés de seguridad. Disponible en las sucursales: Churubusco, Cuernavaca, La Cúspide, Interlomas y Miramontes.'
    || E'\n\nReglamento Ropes Kids:\n'
    || E'- El uso de zapatos es obligatorio para subir al ropes course.\n'
    || E'- Espera en la fila tu turno.\n'
    || E'- Permite que el personal de staff te ponga el equipo correspondiente (casco y smart belay).\n'
    || E'- Escucha con atención las instrucciones de cómo operar el equipo.\n'
    || E'- Sigue la ruta que te indique el operador.\n'
    || E'- Estatura máxima 1.50 m.\n'
    || E'- Siempre vacíe sus bolsillos antes de subir. No porte objetos afilados o punzocortantes; los dispositivos no autorizados (cámaras, celular, etc.) no están permitidos en el ropes kids.\n'
    || E'- Siga siempre las indicaciones de los supervisores de área.'
WHERE name = 'Ropes Course Kids';
