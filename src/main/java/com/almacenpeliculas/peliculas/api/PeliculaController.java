package com.almacenpeliculas.peliculas.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para el módulo de Películas.
 * 
 * Expone endpoints para:
 * - Listar películas (con búsqueda y filtros)
 * - Obtener detalle de una película
 * - Crear, actualizar y eliminar películas (admin)
 */
@RestController
@RequestMapping("/api/peliculas")
public class PeliculaController {
    
    // TODO: Inyectar PeliculaService
    // TODO: Implementar endpoints CRUD
    // TODO: Implementar endpoints de búsqueda y filtrado
}
