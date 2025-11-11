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
    COMEDIA("Comedia"),
    DRAMA("Drama"),
    HORROR("Horror"),
    CIENCIA_FICCION("Ciencia Ficción"),
    FANTASIA("Fantasía"),
    ROMANCE("Romance"),
    THRILLER("Thriller"),
    MISTERIO("Misterio"),
    DOCUMENTAL("Documental"),
    ANIMACION("Animación"),
    MUSICAL("Musical"),
    WESTERN("Western"),
    BIOGRAFIA("Biografía"),
    CRIMEN("Crimen"),
    FAMILIAR("Familiar"),
    GUERRA("Guerra"),
    HISTORIA("Historia"),
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