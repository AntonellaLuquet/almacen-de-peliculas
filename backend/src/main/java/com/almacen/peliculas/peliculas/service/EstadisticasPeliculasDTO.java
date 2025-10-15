package com.almacen.peliculas.peliculas.service;

import com.almacen.peliculas.peliculas.domain.Genero;
import java.util.List;

/**
 * DTO para mostrar estadísticas del catálogo de películas
 * 
 * @author Sistema de Almacén de Películas
 */
public class EstadisticasPeliculasDTO {
    
    private long totalPeliculas;
    private int totalGeneros;
    private List<Genero> generosDisponibles;
    private long peliculasConStock;
    private long peliculasSinStock;
    
    // Constructores
    public EstadisticasPeliculasDTO() {}
    
    public EstadisticasPeliculasDTO(long totalPeliculas, int totalGeneros, List<Genero> generosDisponibles) {
        this.totalPeliculas = totalPeliculas;
        this.totalGeneros = totalGeneros;
        this.generosDisponibles = generosDisponibles;
    }
    
    // Getters y Setters
    public long getTotalPeliculas() {
        return totalPeliculas;
    }
    
    public void setTotalPeliculas(long totalPeliculas) {
        this.totalPeliculas = totalPeliculas;
    }
    
    public int getTotalGeneros() {
        return totalGeneros;
    }
    
    public void setTotalGeneros(int totalGeneros) {
        this.totalGeneros = totalGeneros;
    }
    
    public List<Genero> getGenerosDisponibles() {
        return generosDisponibles;
    }
    
    public void setGenerosDisponibles(List<Genero> generosDisponibles) {
        this.generosDisponibles = generosDisponibles;
    }
    
    public long getPeliculasConStock() {
        return peliculasConStock;
    }
    
    public void setPeliculasConStock(long peliculasConStock) {
        this.peliculasConStock = peliculasConStock;
    }
    
    public long getPeliculasSinStock() {
        return peliculasSinStock;
    }
    
    public void setPeliculasSinStock(long peliculasSinStock) {
        this.peliculasSinStock = peliculasSinStock;
    }
}