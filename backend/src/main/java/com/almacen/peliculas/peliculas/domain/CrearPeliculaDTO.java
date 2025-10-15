package com.almacen.peliculas.peliculas.domain;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;

/**
 * DTO para crear una nueva película
 * 
 * Contiene validaciones para asegurar la integridad de los datos:
 * - Título obligatorio y con longitud máxima
 * - Director, año y género obligatorios
 * - Precio positivo y duración válida
 * - URLs opcionales con formato válido
 * 
 * @author Sistema de Almacén de Películas
 */
public class CrearPeliculaDTO {
    
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no debe superar los 200 caracteres")
    private String titulo;
    
    @Size(max = 2000, message = "La descripción no debe superar los 2000 caracteres")
    private String descripcion;
    
    @NotBlank(message = "El director es obligatorio")
    @Size(max = 100, message = "El director no debe superar los 100 caracteres")
    private String director;
    
    @NotNull(message = "El año es obligatorio")
    @Min(value = 1900, message = "El año debe ser mayor a 1900")
    @Max(value = 2030, message = "El año no puede ser mayor a 2030")
    private Integer anio;
    
    @Min(value = 1, message = "La duración debe ser mayor a 0 minutos")
    @Max(value = 600, message = "La duración no puede superar las 10 horas (600 minutos)")
    private Integer duracion;
    
    @NotNull(message = "El género es obligatorio")
    private Genero genero;
    
    @NotNull(message = "La clasificación por edad es obligatoria")
    private ClasificacionEdad clasificacion;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    @Digits(integer = 8, fraction = 2, message = "El precio debe tener máximo 8 dígitos enteros y 2 decimales")
    private BigDecimal precio;
    
    @NotNull(message = "El stock inicial es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;
    
    @Size(max = 500, message = "La URL de imagen no debe superar los 500 caracteres")
    private String imagenUrl;
    
    @Size(max = 500, message = "La URL del trailer no debe superar los 500 caracteres")
    private String trailerUrl;
    
    private Set<String> actores;
    
    private Boolean disponible = true;
    
    // Constructores
    public CrearPeliculaDTO() {}
    
    public CrearPeliculaDTO(String titulo, String director, Integer anio, 
                           Genero genero, ClasificacionEdad clasificacion, BigDecimal precio) {
        this.titulo = titulo;
        this.director = director;
        this.anio = anio;
        this.genero = genero;
        this.clasificacion = clasificacion;
        this.precio = precio;
    }
    
    // Getters y Setters
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
    
    public Boolean getDisponible() {
        return disponible;
    }
    
    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}