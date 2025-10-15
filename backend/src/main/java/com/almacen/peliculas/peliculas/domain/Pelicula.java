package com.almacen.peliculas.peliculas.domain;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad Película que representa una película en el almacén
 * 
 * Contiene información completa de la película:
 * - Datos básicos: título, descripción, director, año
 * - Información comercial: precio, stock, disponibilidad
 * - Categorización: género, clasificación por edad
 * - Metadatos: duración, URL de imagen, fechas de auditoría
 * 
 * @author Sistema de Almacén de Películas
 */
@Entity
@Table(name = "peliculas")
@EntityListeners(AuditingEntityListener.class)
public class Pelicula {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String titulo;
    
    @Column(length = 2000)
    private String descripcion;
    
    @Column(nullable = false, length = 100)
    private String director;
    
    @Column(nullable = false)
    private Integer anio;
    
    @Column(nullable = false)
    private Integer duracion; // duración en minutos
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Genero genero;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClasificacionEdad clasificacion;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;
    
    @Column(nullable = false)
    private Integer stock = 0;
    
    @Column(nullable = false)
    private Boolean disponible = true;
    
    @Column(length = 500)
    private String imagenUrl;
    
    @Column(length = 500)
    private String trailerUrl;
    
    @ElementCollection
    @CollectionTable(name = "pelicula_actores", joinColumns = @JoinColumn(name = "pelicula_id"))
    @Column(name = "actor")
    private Set<String> actores = new HashSet<>();
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime fechaCreacion;
    
    @LastModifiedDate
    private LocalDateTime fechaActualizacion;
    
    // Constructores
    public Pelicula() {}
    
    public Pelicula(String titulo, String director, Integer anio, Genero genero, 
                   ClasificacionEdad clasificacion, BigDecimal precio) {
        this.titulo = titulo;
        this.director = director;
        this.anio = anio;
        this.genero = genero;
        this.clasificacion = clasificacion;
        this.precio = precio;
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
     * Verifica si la película está en stock
     * @return true si hay stock disponible
     */
    public boolean tieneStock() {
        return stock > 0 && disponible;
    }
    
    /**
     * Reduce el stock en la cantidad especificada
     * @param cantidad cantidad a reducir
     * @throws IllegalArgumentException si no hay suficiente stock
     */
    public void reducirStock(int cantidad) {
        if (stock < cantidad) {
            throw new IllegalArgumentException("Stock insuficiente. Disponible: " + stock + ", Solicitado: " + cantidad);
        }
        this.stock -= cantidad;
    }
    
    /**
     * Aumenta el stock en la cantidad especificada
     * @param cantidad cantidad a agregar
     */
    public void agregarStock(int cantidad) {
        this.stock += cantidad;
    }
    
    /**
     * Obtiene la duración formateada como "XhYm"
     * @return duración formateada
     */
    public String getDuracionFormateada() {
        if (duracion == null) return "N/A";
        
        int horas = duracion / 60;
        int minutos = duracion % 60;
        
        if (horas > 0) {
            return horas + "h " + minutos + "m";
        } else {
            return minutos + "m";
        }
    }
    
    /**
     * Agrega un actor a la película
     * @param actor nombre del actor
     */
    public void agregarActor(String actor) {
        if (actor != null && !actor.trim().isEmpty()) {
            this.actores.add(actor.trim());
        }
    }
    
    /**
     * Remueve un actor de la película
     * @param actor nombre del actor
     */
    public void removerActor(String actor) {
        this.actores.remove(actor);
    }
}