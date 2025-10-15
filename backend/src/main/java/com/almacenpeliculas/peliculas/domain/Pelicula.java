package com.almacenpeliculas.peliculas.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad Película.
 * 
 * Representa una película en el catálogo.
 */
@Entity
@Table(name = "peliculas")
@Data
public class Pelicula {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(length = 2000)
    private String descripcion;
    
    @Column(nullable = false)
    private String genero;
    
    @Column(name = "anio_lanzamiento")
    private Integer anioLanzamiento;
    
    private String director;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;
    
    @Column(nullable = false)
    private Integer stock = 0;
    
    @Column(name = "url_imagen")
    private String urlImagen;
    
    @Column(nullable = false)
    private boolean disponible = true;
    
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
}
