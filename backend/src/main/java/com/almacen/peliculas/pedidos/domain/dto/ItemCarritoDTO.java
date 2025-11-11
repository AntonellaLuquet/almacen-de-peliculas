package com.almacen.peliculas.pedidos.domain.dto;

import com.almacen.peliculas.peliculas.domain.PeliculaDTO;
import java.math.BigDecimal;

/**
 * DTO para representar un item del carrito de cara al frontend.
 * 
 * @author Sistema de Almacén de Películas
 */
public class ItemCarritoDTO {
    
    private Long id;
    private PeliculaDTO pelicula;
    private int cantidad = 1;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PeliculaDTO getPelicula() {
        return pelicula;
    }

    public void setPelicula(PeliculaDTO pelicula) {
        this.pelicula = pelicula;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public String getNombrePelicula() {
        return this.pelicula.getTitulo();
    }
}
