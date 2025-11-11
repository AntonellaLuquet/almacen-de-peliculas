-- Datos de inicialización para H2 Database

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (email, nombre, apellido, password, rol, activo, fecha_creacion)
VALUES ('admin@almacen.com', 'Administrador', 'Sistema', '$2a$10$FWIz0mZftCHnZzaWLdTI1emd6eoFmnK9pS0xPp6YIReDISt3YSFqG', 'ADMIN', true, CURRENT_TIMESTAMP);
-- Password: admin123 (encriptado con BCrypt)

-- Insertar usuario cliente de prueba
INSERT INTO usuarios (email, nombre, apellido, password, rol, activo, telefono, direccion, fecha_creacion)
VALUES ('cliente@test.com', 'Juan', 'Pérez', '$2a$10$FWIz0mZftCHnZzaWLdTI1emd6eoFmnK9pS0xPp6YIReDISt3YSFqG', 'CLIENTE', true, '555-1234', 'Calle Falsa 123, Ciudad', CURRENT_TIMESTAMP);
-- Password: admin123 (encriptado con BCrypt)

-- Usuario administrador con BCrypt (backup)
INSERT INTO usuarios (email, nombre, apellido, password, rol, activo, fecha_creacion)
VALUES ('admin2@almacen.com', 'Admin', 'Backup', '$2a$10$FWIz0mZftCHnZzaWLdTI1emd6eoFmnK9pS0xPp6YIReDISt3YSFqG', 'ADMIN', true, CURRENT_TIMESTAMP);
-- Password: admin123

-- Insertar películas de ejemplo con imágenes reales y pequeñas
INSERT INTO peliculas (titulo, descripcion, director, anio, duracion, genero, clasificacion, precio, stock, disponible, imagen_url, trailer_url, fecha_creacion)
VALUES
('El Padrino', 'La historia de la familia Corleone bajo el patriarca Vito Corleone...', 'Francis Ford Coppola', 1972, 175, 'DRAMA', 'R', 19.99, 25, true, 'https://via.placeholder.com/150x225.png?text=El+Padrino', 'https://example.com/padrino-trailer.mp4', CURRENT_TIMESTAMP),
('Pulp Fiction', 'Las vidas de dos sicarios de la mafia, un boxeador, un gángster y su esposa...', 'Quentin Tarantino', 1994, 154, 'THRILLER', 'R', 17.99, 30, true, 'https://via.placeholder.com/150x225.png?text=Pulp+Fiction', 'https://example.com/pulp-trailer.mp4', CURRENT_TIMESTAMP),
('El Señor de los Anillos: La Comunidad del Anillo', 'Un hobbit de la Comarca y ocho compañeros se embarcan en un viaje...', 'Peter Jackson', 2001, 178, 'FANTASIA', 'PG_13', 22.99, 40, true, 'https://via.placeholder.com/150x225.png?text=LOTR', 'https://example.com/lotr1-trailer.mp4', CURRENT_TIMESTAMP),
('Matrix', 'Un hacker informático aprende de misteriosos rebeldes sobre la verdadera naturaleza de su realidad...', 'The Wachowskis', 1999, 136, 'CIENCIA_FICCION', 'R', 16.99, 35, true, 'https://via.placeholder.com/150x225.png?text=Matrix', 'https://example.com/matrix-trailer.mp4', CURRENT_TIMESTAMP),
('Forrest Gump', 'Las presidencias de Kennedy y Johnson, los eventos de Vietnam, Watergate y otros eventos históricos...', 'Robert Zemeckis', 1994, 142, 'DRAMA', 'PG_13', 18.99, 20, true, 'https://via.placeholder.com/150x225.png?text=Forrest+Gump', 'https://example.com/forrest-trailer.mp4', CURRENT_TIMESTAMP),
('El Rey León', 'El príncipe león Simba y su padre son atacados por su tío...', 'Roger Allers', 1994, 88, 'ANIMACION', 'G', 14.99, 50, true, 'https://via.placeholder.com/150x225.png?text=El+Rey+Leon', 'https://example.com/rey-leon-trailer.mp4', CURRENT_TIMESTAMP),
('Titanic', 'Un aristócrata de diecisiete años se enamora de un artista amable pero pobre...', 'James Cameron', 1997, 194, 'ROMANCE', 'PG_13', 21.99, 28, true, 'https://via.placeholder.com/150x225.png?text=Titanic', 'https://example.com/titanic-trailer.mp4', CURRENT_TIMESTAMP),
('Los Vengadores', 'Los superhéroes más poderosos de la Tierra deben unirse y aprender a luchar como un equipo...', 'Joss Whedon', 2012, 143, 'ACCION', 'PG_13', 19.99, 45, true, 'https://via.placeholder.com/150x225.png?text=Vengadores', 'https://example.com/vengadores-trailer.mp4', CURRENT_TIMESTAMP),
('La La Land', 'Mientras navegan por sus carreras en Los Ángeles, un pianista y una actriz se enamoran...', 'Damien Chazelle', 2016, 128, 'MUSICAL', 'PG_13', 16.99, 22, true, 'https://via.placeholder.com/150x225.png?text=La+La+Land', 'https://example.com/lalaland-trailer.mp4', CURRENT_TIMESTAMP),
('Jurassic Park', 'Un empresario pragmático y un equipo de científicos genéticos han creado un parque de atracciones...', 'Steven Spielberg', 1993, 127, 'AVENTURA', 'PG_13', 18.99, 32, true, 'https://via.placeholder.com/150x225.png?text=Jurassic+Park', 'https://example.com/jurassic-trailer.mp4', CURRENT_TIMESTAMP);

-- Insertar actores para las películas
INSERT INTO pelicula_actores (pelicula_id, actor) VALUES
(1, 'Marlon Brando'), (1, 'Al Pacino'), (1, 'James Caan'),
(2, 'John Travolta'), (2, 'Samuel L. Jackson'), (2, 'Uma Thurman'),
(3, 'Elijah Wood'), (3, 'Ian McKellen'), (3, 'Orlando Bloom'),
(4, 'Keanu Reeves'), (4, 'Laurence Fishburne'), (4, 'Carrie-Anne Moss'),
(5, 'Tom Hanks'), (5, 'Robin Wright'), (5, 'Gary Sinise'),
(6, 'Matthew Broderick'), (6, 'Jeremy Irons'), (6, 'James Earl Jones'),
(7, 'Leonardo DiCaprio'), (7, 'Kate Winslet'), (7, 'Billy Zane'),
(8, 'Robert Downey Jr.'), (8, 'Chris Evans'), (8, 'Mark Ruffalo'),
(9, 'Ryan Gosling'), (9, 'Emma Stone'), (9, 'John Legend'),
(10, 'Sam Neill'), (10, 'Laura Dern'), (10, 'Jeff Goldblum');

-- -----------------------------------------------------------------------
-- DATOS DE PRUEBA PARA CARRITO Y PEDIDOS
-- -----------------------------------------------------------------------

-- Crear un carrito para el usuario cliente (ID=2)
INSERT INTO carritos (usuario_id, fecha_creacion, impuestos, subtotal, total) VALUES (2, CURRENT_TIMESTAMP, 0.00, 0.00, 0.00);

-- Añadir items al carrito del usuario cliente (carrito_id=1)
INSERT INTO items_carrito (carrito_id, pelicula_id, cantidad, precio_unitario, subtotal) VALUES
(1, 2, 1, 17.99, 17.99), -- Pulp Fiction (1 * 17.99)
(1, 4, 2, 16.99, 33.98); -- Matrix (2 * 16.99)

-- Pedido 1 (ENTREGADO)
INSERT INTO pedidos (usuario_id, subtotal, impuestos, total, estado, calle, ciudad, codigo_postal, pais, fecha_creacion) VALUES
(2, 38.98, 0.00, 38.98, 'ENTREGADO', 'Calle Falsa 123', 'Springfield', 'B1876', 'Argentina', '2023-10-15 10:30:00');
INSERT INTO items_pedido (pedido_id, pelicula_id, titulo_pelicula, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 'El Padrino', 1, 19.99, 19.99),
(1, 10, 'Jurassic Park', 1, 18.99, 18.99);

-- Pedido 2 (ENTREGADO)
INSERT INTO pedidos (usuario_id, subtotal, impuestos, total, estado, calle, ciudad, codigo_postal, pais, fecha_creacion) VALUES
(2, 54.97, 0.00, 54.97, 'ENTREGADO', 'Avenida Siempre Viva 742', 'Springfield', 'B1876', 'Argentina', '2023-11-01 18:00:00');
INSERT INTO items_pedido (pedido_id, pelicula_id, titulo_pelicula, cantidad, precio_unitario, subtotal) VALUES
(2, 8, 'Los Vengadores', 2, 19.99, 39.98),
(2, 6, 'El Rey León', 1, 14.99, 14.99);

-- -----------------------------------------------------------------------
-- NUEVOS PEDIDOS CON DIFERENTES ESTADOS
-- -----------------------------------------------------------------------

-- Pedido 3 (PENDIENTE)
INSERT INTO pedidos (usuario_id, subtotal, impuestos, total, estado, calle, ciudad, codigo_postal, pais, fecha_creacion) VALUES
(2, 16.99, 0.00, 16.99, 'PENDIENTE', 'Avenida de Mayo 500', 'Buenos Aires', 'C1084', 'Argentina', '2024-05-20 09:15:00');
INSERT INTO items_pedido (pedido_id, pelicula_id, titulo_pelicula, cantidad, precio_unitario, subtotal) VALUES
(3, 4, 'Matrix', 1, 16.99, 16.99);

-- Pedido 4 (PROCESANDO)
INSERT INTO pedidos (usuario_id, subtotal, impuestos, total, estado, calle, ciudad, codigo_postal, pais, fecha_creacion) VALUES
(2, 16.99, 0.00, 16.99, 'PROCESANDO', 'Avenida Corrientes 1000', 'Buenos Aires', 'C1043', 'Argentina', '2024-05-19 14:00:00');
INSERT INTO items_pedido (pedido_id, pelicula_id, titulo_pelicula, cantidad, precio_unitario, subtotal) VALUES
(4, 9, 'La La Land', 1, 16.99, 16.99);

-- Pedido 5 (ENVIADO)
INSERT INTO pedidos (usuario_id, subtotal, impuestos, total, estado, calle, ciudad, codigo_postal, pais, fecha_creacion) VALUES
(2, 43.98, 0.00, 43.98, 'ENVIADO', 'Calle Florida 300', 'Buenos Aires', 'C1005', 'Argentina', '2024-05-15 11:45:00');
INSERT INTO items_pedido (pedido_id, pelicula_id, titulo_pelicula, cantidad, precio_unitario, subtotal) VALUES
(5, 7, 'Titanic', 2, 21.99, 43.98);

-- Pedido 6 (CANCELADO)
INSERT INTO pedidos (usuario_id, subtotal, impuestos, total, estado, calle, ciudad, codigo_postal, pais, fecha_creacion) VALUES
(2, 18.99, 0.00, 18.99, 'CANCELADO', 'Defensa 800', 'Buenos Aires', 'C1065', 'Argentina', '2024-04-10 20:00:00');
INSERT INTO items_pedido (pedido_id, pelicula_id, titulo_pelicula, cantidad, precio_unitario, subtotal) VALUES
(6, 5, 'Forrest Gump', 1, 18.99, 18.99);

-- Pedido 7 (ENTREGADO - Adicional)
INSERT INTO pedidos (usuario_id, subtotal, impuestos, total, estado, calle, ciudad, codigo_postal, pais, fecha_creacion) VALUES
(2, 37.98, 0.00, 37.98, 'ENTREGADO', 'Avenida Santa Fe 1860', 'Buenos Aires', 'C1123', 'Argentina', '2024-03-22 13:00:00');
INSERT INTO items_pedido (pedido_id, pelicula_id, titulo_pelicula, cantidad, precio_unitario, subtotal) VALUES
(7, 2, 'Pulp Fiction', 1, 17.99, 17.99),
(7, 1, 'El Padrino', 1, 19.99, 19.99);