package com.almacen.peliculas.peliculas.domain;

import java.math.BigDecimal;

/**
 * DTO para filtros de búsqueda avanzada de películas
 * 
 * Permite especificar múltiples criterios de filtrado:
 * - Término de búsqueda general
 * - Filtros por género, rango de años y precios
 * - Todos los campos son opcionales
 * 
 * @author Sistema de Almacén de Películas
 */
public class FiltrosPeliculaDTO {

    private String searchTerm;
    private Genero genero;
    private Integer anioDesde;
    private Integer anioHasta;
    private BigDecimal precioMin;
    private BigDecimal precioMax;

    // Constructores
    public FiltrosPeliculaDTO() {
    }

    public FiltrosPeliculaDTO(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    public FiltrosPeliculaDTO(String searchTerm, Genero genero,
            Integer anioDesde, Integer anioHasta,
            BigDecimal precioMin, BigDecimal precioMax) {
        this.searchTerm = searchTerm;
        this.genero = genero;
        this.anioDesde = anioDesde;
        this.anioHasta = anioHasta;
        this.precioMin = precioMin;
        this.precioMax = precioMax;
    }

    // Getters y Setters
    public String getSearchTerm() {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            this.searchTerm = null;
        } else {
            this.searchTerm = searchTerm;
        }
    }

    public Genero getGenero() {
        return genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public Integer getAnioDesde() {
        return anioDesde;
    }

    public void setAnioDesde(Integer anioDesde) {
        this.anioDesde = anioDesde;
    }

    public Integer getAnioHasta() {
        return anioHasta;
    }

    public void setAnioHasta(Integer anioHasta) {
        this.anioHasta = anioHasta;
    }

    public BigDecimal getPrecioMin() {
        return precioMin;
    }

    public void setPrecioMin(BigDecimal precioMin) {
        this.precioMin = precioMin;
    }

    public BigDecimal getPrecioMax() {
        return precioMax;
    }

    public void setPrecioMax(BigDecimal precioMax) {
        this.precioMax = precioMax;
    }

    /**
     * Verifica si hay algún filtro aplicado
     * 
     * @return true si al menos un filtro está configurado
     */
    public boolean tieneFiltros() {
        return (searchTerm != null && !searchTerm.trim().isEmpty()) ||
                genero != null ||
                anioDesde != null ||
                anioHasta != null ||
                precioMin != null ||
                precioMax != null;
    }
}