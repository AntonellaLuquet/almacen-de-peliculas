package com.almacenpeliculas.peliculas.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entidad de dominio que representa una Película.
 * 
 * Atributos principales:
 * - Título
 * - Género
 * - Director
 * - Año de lanzamiento
 * - Precio
 * - Stock disponible
 * - Descripción
 */
@Entity
@Table(name = "peliculas")
public class Pelicula {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // TODO: Agregar campos de la película:
    //       - titulo
    //       - genero
    //       - director
    //       - anioLanzamiento
    //       - precio
    //       - stock
    //       - descripcion
    
    // TODO: Agregar getters y setters
    // TODO: Agregar constructores
}
