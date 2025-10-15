package com.almacenpeliculas.peliculas.infra;

import com.almacenpeliculas.peliculas.domain.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad Película.
 * 
 * Proporciona operaciones CRUD y consultas personalizadas.
 */
@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    
    List<Pelicula> findByDisponibleTrue();
    
    List<Pelicula> findByGenero(String genero);
    
    List<Pelicula> findByTituloContainingIgnoreCase(String titulo);
}
