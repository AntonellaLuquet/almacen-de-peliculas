package com.almacen.peliculas.pedidos.domain;

import com.almacen.peliculas.peliculas.domain.Pelicula;
import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * Entidad ItemCarrito que representa un item específico dentro de un carrito
 * 
 * Similar a ItemPedido pero para el carrito temporal.
 * Se convierte en ItemPedido cuando el carrito se confirma.
 * 
 * @author Sistema de Almacén de Películas
 */
@Entity
@Table(name = "items_carrito")
public class ItemCarrito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrito_id", nullable = false)
    private Carrito carrito;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pelicula_id", nullable = false)
    private Pelicula pelicula;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    // Constructores
    public ItemCarrito() {}
    
    public ItemCarrito(Pelicula pelicula, Integer cantidad) {
        this.pelicula = pelicula;
        this.cantidad = cantidad;
        this.precioUnitario = pelicula.getPrecio();
        this.subtotal = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Carrito getCarrito() {
        return carrito;
    }
    
    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }
    
    public Pelicula getPelicula() {
        return pelicula;
    }
    
    public void setPelicula(Pelicula pelicula) {
        this.pelicula = pelicula;
    }
    
    public Integer getCantidad() {
        return cantidad;
    }
    
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
        recalcularSubtotal();
    }
    
    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }
    
    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
        recalcularSubtotal();
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    // Métodos de utilidad
    
    /**
     * Recalcula el subtotal basado en cantidad y precio unitario
     */
    private void recalcularSubtotal() {
        if (cantidad != null && precioUnitario != null) {
            this.subtotal = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
        }
    }
    
    /**
     * Actualiza la cantidad y recalcula el subtotal
     * @param nuevaCantidad nueva cantidad
     */
    public void actualizarCantidad(Integer nuevaCantidad) {
        this.cantidad = nuevaCantidad;
        recalcularSubtotal();
    }
    
    /**
     * Actualiza el precio unitario (en caso de cambio de precio)
     * @param nuevoPrecio nuevo precio unitario
     */
    public void actualizarPrecio(BigDecimal nuevoPrecio) {
        this.precioUnitario = nuevoPrecio;
        recalcularSubtotal();
    }
}