package com.almacen.peliculas.peliculas.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO para mostrar información de películas
 * 
 * Utilizado para devolver datos de películas al frontend,
 * incluyendo toda la información relevante para el catálogo y detalles.
 * 
 * @author Sistema de Almacén de Películas
 */
public class PeliculaDTO {
    
    private Long id;
    private String titulo;
    private String descripcion;
    private String director;
    private Integer anio;
    private Integer duracion;
    private String duracionFormateada;
    private Genero genero;
    private ClasificacionEdad clasificacion;
    private BigDecimal precio;
    private Integer stock;
    private Boolean disponible;
    private String imagenUrl;
    private String trailerUrl;
    private Set<String> actores;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    
    // Constructores
    public PeliculaDTO() {}
    
    public PeliculaDTO(Long id, String titulo, String director, Integer anio, 
                      Genero genero, BigDecimal precio, Boolean disponible) {
        this.id = id;
        this.titulo = titulo;
        this.director = director;
        this.anio = anio;
        this.genero = genero;
        this.precio = precio;
        this.disponible = disponible;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDirector() {
        return director;
    }
    
    public void setDirector(String director) {
        this.director = director;
    }
    
    public Integer getAnio() {
        return anio;
    }
    
    public void setAnio(Integer anio) {
        this.anio = anio;
    }
    
    public Integer getDuracion() {
        return duracion;
    }
    
    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }
    
    public String getDuracionFormateada() {
        return duracionFormateada;
    }
    
    public void setDuracionFormateada(String duracionFormateada) {
        this.duracionFormateada = duracionFormateada;
    }
    
    public Genero getGenero() {
        return genero;
    }
    
    public void setGenero(Genero genero) {
        this.genero = genero;
    }
    
    public ClasificacionEdad getClasificacion() {
        return clasificacion;
    }
    
    public void setClasificacion(ClasificacionEdad clasificacion) {
        this.clasificacion = clasificacion;
    }
    
    public BigDecimal getPrecio() {
        return precio;
    }
    
    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    public Boolean getDisponible() {
        return disponible;
    }
    
    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
    
    public String getImagenUrl() {
        return imagenUrl;
    }
    
    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
    
    public String getTrailerUrl() {
        return trailerUrl;
    }
    
    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }
    
    public Set<String> getActores() {
        return actores;
    }
    
    public void setActores(Set<String> actores) {
        this.actores = actores;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
    
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
    
    // Métodos de utilidad
    
    /**
     * Verifica si la película está disponible para compra
     * @return true si está disponible y tiene stock
     */
    public boolean estaDisponibleParaCompra() {
        return disponible && stock > 0;
    }
}