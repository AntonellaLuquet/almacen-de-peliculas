package com.almacenpeliculas.peliculas.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para gestión de películas.
 * 
 * Endpoints:
 * - GET /api/peliculas - Listar todas las películas (con paginación y filtros)
 * - GET /api/peliculas/{id} - Obtener detalle de una película
 * - POST /api/peliculas - Crear nueva película (solo ADMIN)
 * - PUT /api/peliculas/{id} - Actualizar película (solo ADMIN)
 * - DELETE /api/peliculas/{id} - Eliminar película (solo ADMIN)
 * - GET /api/peliculas/buscar - Buscar películas por título, género, etc.
 */
@RestController
@RequestMapping("/api/peliculas")
public class PeliculaController {
    // TODO: Implementar endpoints de películas
}
