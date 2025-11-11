package com.almacen.peliculas.pedidos.domain.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para representar el carrito completo de cara al frontend.
 * 
 * @author Sistema de Almacén de Películas
 */
public class CarritoDTO {
    
    private Long id;
    private List<ItemCarritoDTO> items;
    private int totalItems;
    private BigDecimal subtotal;
    private BigDecimal impuestos;
    private BigDecimal total;

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<ItemCarritoDTO> getItems() {
        return items;
    }

    public void setItems(List<ItemCarritoDTO> items) {
        this.items = items;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getImpuestos() {
        return impuestos;
    }

    public void setImpuestos(BigDecimal impuestos) {
        this.impuestos = impuestos;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
