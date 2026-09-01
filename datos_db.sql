INSERT INTO jugadores (nombre, password, tesorero) VALUES
('Alejo', NULL, false),
('Victor Hugo', NULL, false),
('Lavado', NULL, false),
('Jaume', NULL, false),
('Dani Haro', NULL, false),
('Beltran', NULL, false),
('Ivan', 'sapito123', true),
('Herrero', NULL, false),
('Bujardon', NULL, false),
('Victor Ruiz', NULL, false),
('Padilla', NULL, false),
('Dani Rodriguez', NULL, false),
('Gabri', NULL, false),
('Xavi', NULL, false);

INSERT INTO detalle_pagos (jornada, id_jugador, importe_posicion, importe_rojas, pagado) VALUES
(1, 1, 0.50, 0, true),    
(1, 9, 0.50, 0, true),    
(1, 4, 2.00, 2.00, true), -- Jaume (Pagado)
(1, 12, 3.00, 0, true),   -- Dani Rodriguez (Pagado)
(1, 14, 4.00, 0, false),  -- Xavi (NO Pagado)
(1, 6, 5.00, 0, true),    -- Beltran (Pagado)
(1, 2, 0, 2.00, false),   -- Victor Hugo (NO Pagado)
(1, 5, 0, 2.00, true);    -- Dani Haro (Pagado)

INSERT INTO mensajes_ultimo (id_jugador, mensaje) VALUES
(1, 'que malo eres 1'),
(2, 'que malo eres 2'),
(3, 'que malo eres 3'),
(4, 'que malo eres 4'),
(5, 'que malo eres 5'),
(6, 'que malo eres 6'),
(7, 'que malo eres 7'),
(8, 'que malo eres 8'),
(9, 'que malo eres 9'),
(10, 'que malo eres 10'),
(11, 'que malo eres 11'),
(12, 'que malo eres 12'),
(13, 'que malo eres 13'),
(14, 'que malo eres 14');

INSERT INTO mensajes_personalizados (id_jugador, mensaje) VALUES
(1, 'bienvenido 1'),
(2, 'bienvenido 2'),
(3, 'bienvenido 3'),
(4, 'bienvenido 4'),
(5, 'bienvenido 5'),
(6, 'bienvenido 6'),
(7, 'bienvenido 7'),
(8, 'bienvenido 8'),
(9, 'bienvenido 9'),
(10, 'bienvenido 10'),
(11, 'bienvenido 11'),
(12, 'bienvenido 12'),
(13, 'bienvenido 13'),
(14, 'bienvenido 14');

SELECT * FROM mensajes_ultimo;

