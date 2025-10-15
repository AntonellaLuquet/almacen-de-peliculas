package com.almacen.peliculas.peliculas.domain;

/**
 * Enumeración de clasificación por edad
 * 
 * Define las categorías de edad recomendadas para las películas
 * basadas en el sistema de clasificación estándar.
 * 
 * @author Sistema de Almacén de Películas
 */
public enum ClasificacionEdad {
    G("General - Apta para toda la familia"),
    PG("Parental Guidance - Se sugiere supervisión parental"),
    PG_13("PG-13 - No recomendada para menores de 13 años"),
    R("Restringida - Menores de 17 requieren acompañamiento de adulto"),
    NC_17("NC-17 - No admite menores de 17 años"),
    ATP("Apta para todo público"),
    SAM_13("Solo mayores de 13 años"),
    SAM_16("Solo mayores de 16 años"),
    SAM_18("Solo mayores de 18 años");
    
    private final String descripcion;
    
    ClasificacionEdad(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    @Override
    public String toString() {
        return descripcion;
    }
}