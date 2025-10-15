package com.almacenpeliculas.peliculas.infra;

import com.almacenpeliculas.peliculas.domain.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad Película.
 * 
 * Proporciona operaciones CRUD básicas y permite definir
 * consultas personalizadas para búsqueda y filtrado.
 */
@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    
    // TODO: Agregar métodos de consulta personalizados:
    //       - findByTituloContaining()
    //       - findByGenero()
    //       - findByAnioLanzamiento()
    //       - findByPrecioBetween()
}
