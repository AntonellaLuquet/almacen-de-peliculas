package com.almacen.peliculas.peliculas.domain;

/**
 * Enumeración de géneros cinematográficos
 * 
 * Define las categorías principales de películas disponibles en el almacén.
 * Cada género representa una clasificación temática de las películas.
 * 
 * @author Sistema de Almacén de Películas
 */
public enum Genero {
    ACCION("Acción"),
    AVENTURA("Aventura"),
    CIENCIA_FICCION("Ciencia Ficción"),
    COMEDIA("Comedia"),
    DRAMA("Drama"),
    FANTASIA("Fantasía"),
    HORROR("Horror"),
    MUSICAL("Musical"),
    ROMANCE("Romance"),
    THRILLER("Thriller"),
    WESTERN("Western"),
    DOCUMENTAL("Documental"),
    ANIMACION("Animación"),
    BIOGRAFIA("Biografía"),
    CRIMEN("Crimen"),
    FAMILIAR("Familiar"),
    GUERRA("Guerra"),
    HISTORIA("Historia"),
    MISTERIO("Misterio"),
    DEPORTES("Deportes");
    
    private final String displayName;
    
    Genero(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
}