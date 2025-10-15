package com.almacen.peliculas.pedidos.domain;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para agregar un item al carrito
 * 
 * @author Sistema de Almacén de Películas
 */
public class AgregarItemCarritoDTO {
    
    @NotNull(message = "El ID de la película es obligatorio")
    private Long peliculaId;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;
    
    // Constructores
    public AgregarItemCarritoDTO() {}
    
    public AgregarItemCarritoDTO(Long peliculaId, Integer cantidad) {
        this.peliculaId = peliculaId;
        this.cantidad = cantidad;
    }
    
    // Getters y Setters
    public Long getPeliculaId() {
        return peliculaId;
    }
    
    public void setPeliculaId(Long peliculaId) {
        this.peliculaId = peliculaId;
    }
    
    public Integer getCantidad() {
        return cantidad;
    }
    
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}