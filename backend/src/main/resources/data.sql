-- Datos de inicialización para H2 Database

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (email, nombre, apellido, password, rol, activo, fecha_creacion)
VALUES ('admin@almacen.com', 'Administrador', 'Sistema', '$2y$10$VYxZovFjQJFtjFHeJTIHpu3xcmXH.KIymtFuFd4hrerr8kJoJ/E/u', 'ADMIN', true, CURRENT_TIMESTAMP);
-- Password: admin123 (encriptado con BCrypt)

-- Insertar usuario cliente de prueba  
INSERT INTO usuarios (email, nombre, apellido, password, rol, activo, telefono, direccion, fecha_creacion)
VALUES ('cliente@test.com', 'Juan', 'Pérez', '$2y$10$VYxZovFjQJFtjFHeJTIHpu3xcmXH.KIymtFuFd4hrerr8kJoJ/E/u', 'CLIENTE', true, '555-1234', 'Calle Falsa 123, Ciudad', CURRENT_TIMESTAMP);
-- Password: admin123 (encriptado con BCrypt)

-- Insertar usuario de prueba de Mercado Pago (COMPRADOR)
INSERT INTO usuarios (email, nombre, apellido, password, rol, activo, fecha_creacion)
VALUES ('TESTUSER9052358849520235020@testuser.com', 'Buyer', 'Test User', '$2y$10$2eRp5uQkzxR0.mM5KlNqIO0Dynd5qcgF/mmfLkqWWP0a3Or7W9ldC', 'CLIENTE', true, CURRENT_TIMESTAMP);
-- Password: kH12nIL9NK (encriptado con BCrypt)

-- Usuario administrador con BCrypt (backup)
INSERT INTO usuarios (email, nombre, apellido, password, rol, activo, fecha_creacion)
VALUES ('admin2@almacen.com', 'Admin', 'Backup', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOwk9aTUkjykTYzMkF8MZxeVGCJoQKnwG', 'ADMIN', true, CURRENT_TIMESTAMP);
-- Password: admin123

-- Insertar películas de ejemplo
INSERT INTO peliculas (titulo, descripcion, director, anio, duracion, genero, clasificacion, precio, stock, disponible, imagen_url, trailer_url, fecha_creacion)
VALUES 
('El Padrino', 'La historia de la familia Corleone bajo el patriarca Vito Corleone, enfocándose en la transformación de su hijo menor, Michael, de reluctante forastero a implacable jefe de la mafia.', 'Francis Ford Coppola', 1972, 175, 'DRAMA', 'R', 19.99, 25, true, 'https://example.com/padrino.jpg', 'https://example.com/padrino-trailer.mp4', CURRENT_TIMESTAMP),

('Pulp Fiction', 'Las vidas de dos sicarios de la mafia, un boxeador, un gángster y su esposa, y un par de bandidos de restaurantes se entrelazan en cuatro historias de violencia y redención.', 'Quentin Tarantino', 1994, 154, 'THRILLER', 'R', 17.99, 30, true, 'https://example.com/pulp.jpg', 'https://example.com/pulp-trailer.mp4', CURRENT_TIMESTAMP),

('El Señor de los Anillos: La Comunidad del Anillo', 'Un hobbit de la Comarca y ocho compañeros se embarcan en un viaje para destruir el poderoso Anillo Único y salvar la Tierra Media del Señor Oscuro Sauron.', 'Peter Jackson', 2001, 178, 'FANTASIA', 'PG_13', 22.99, 40, true, 'https://example.com/lotr1.jpg', 'https://example.com/lotr1-trailer.mp4', CURRENT_TIMESTAMP),

('Matrix', 'Un hacker informático aprende de misteriosos rebeldes sobre la verdadera naturaleza de su realidad y su papel en la guerra contra sus controladores.', 'The Wachowskis', 1999, 136, 'CIENCIA_FICCION', 'R', 16.99, 35, true, 'https://example.com/matrix.jpg', 'https://example.com/matrix-trailer.mp4', CURRENT_TIMESTAMP),

('Forrest Gump', 'Las presidencias de Kennedy y Johnson, los eventos de Vietnam, Watergate y otros eventos históricos se desarrollan a través de la perspectiva de un hombre de Alabama con un coeficiente intelectual de 75.', 'Robert Zemeckis', 1994, 142, 'DRAMA', 'PG_13', 18.99, 20, true, 'https://example.com/forrest.jpg', 'https://example.com/forrest-trailer.mp4', CURRENT_TIMESTAMP),

('El Rey León', 'El príncipe león Simba y su padre son atacados por su tío, quien quiere ascender al trono él mismo.', 'Roger Allers', 1994, 88, 'ANIMACION', 'G', 14.99, 50, true, 'https://example.com/rey-leon.jpg', 'https://example.com/rey-leon-trailer.mp4', CURRENT_TIMESTAMP),

('Titanic', 'Un aristócrata de diecisiete años se enamora de un artista amable pero pobre a bordo del lujoso e infortunado R.M.S. Titanic.', 'James Cameron', 1997, 194, 'ROMANCE', 'PG_13', 21.99, 28, true, 'https://example.com/titanic.jpg', 'https://example.com/titanic-trailer.mp4', CURRENT_TIMESTAMP),

('Los Vengadores', 'Los superhéroes más poderosos de la Tierra deben unirse y aprender a luchar como un equipo si van a detener al malévolo Loki y su ejército alienígena de invadir la Tierra.', 'Joss Whedon', 2012, 143, 'ACCION', 'PG_13', 19.99, 45, true, 'https://example.com/vengadores.jpg', 'https://example.com/vengadores-trailer.mp4', CURRENT_TIMESTAMP),

('La La Land', 'Mientras navegan por sus carreras en Los Ángeles, un pianista y una actriz se enamoran mientras intentan reconciliar sus aspiraciones para el futuro.', 'Damien Chazelle', 2016, 128, 'MUSICAL', 'PG_13', 16.99, 22, true, 'https://example.com/lalaland.jpg', 'https://example.com/lalaland-trailer.mp4', CURRENT_TIMESTAMP),

('Jurassic Park', 'Un empresario pragmático y un equipo de científicos genéticos han creado un parque de atracciones safari en una isla remota poblada con dinosaurios clonados.', 'Steven Spielberg', 1993, 127, 'AVENTURA', 'PG_13', 18.99, 32, true, 'https://example.com/jurassic.jpg', 'https://example.com/jurassic-trailer.mp4', CURRENT_TIMESTAMP);

-- Insertar actores para las películas
INSERT INTO pelicula_actores (pelicula_id, actor) VALUES
(1, 'Marlon Brando'),
(1, 'Al Pacino'),
(1, 'James Caan'),
(2, 'John Travolta'),
(2, 'Samuel L. Jackson'),
(2, 'Uma Thurman'),
(3, 'Elijah Wood'),
(3, 'Ian McKellen'),
(3, 'Orlando Bloom'),
(4, 'Keanu Reeves'),
(4, 'Laurence Fishburne'),
(4, 'Carrie-Anne Moss'),
(5, 'Tom Hanks'),
(5, 'Robin Wright'),
(5, 'Gary Sinise'),
(6, 'Matthew Broderick'),
(6, 'Jeremy Irons'),
(6, 'James Earl Jones'),
(7, 'Leonardo DiCaprio'),
(7, 'Kate Winslet'),
(7, 'Billy Zane'),
(8, 'Robert Downey Jr.'),
(8, 'Chris Evans'),
(8, 'Mark Ruffalo'),
(9, 'Ryan Gosling'),
(9, 'Emma Stone'),
(9, 'John Legend'),
(10, 'Sam Neill'),
(10, 'Laura Dern'),
(10, 'Jeff Goldblum');