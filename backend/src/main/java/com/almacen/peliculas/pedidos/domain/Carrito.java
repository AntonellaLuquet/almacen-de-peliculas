package com.almacen.peliculas.pedidos.domain;

import com.almacen.peliculas.usuarios.domain.Usuario;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Carrito que representa el carrito de compras temporal de un usuario
 * 
 * El carrito es temporal y se convierte en pedido cuando se confirma la compra.
 * Un usuario solo puede tener un carrito activo a la vez.
 * 
 * @author Sistema de Almacén de Películas
 */
@Entity
@Table(name = "carritos")
@EntityListeners(AuditingEntityListener.class)
public class Carrito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;
    
    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ItemCarrito> items = new ArrayList<>();
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal impuestos = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime fechaCreacion;
    
    @LastModifiedDate
    private LocalDateTime fechaActualizacion;
    
    // Constructores
    public Carrito() {}
    
    public Carrito(Usuario usuario) {
        this.usuario = usuario;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public List<ItemCarrito> getItems() {
        return items;
    }
    
    public void setItems(List<ItemCarrito> items) {
        this.items = items;
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
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
    
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
    
    // Métodos de utilidad
    
    /**
     * Agrega un item al carrito o actualiza la cantidad si ya existe
     * @param item item a agregar
     */
    public void agregarItem(ItemCarrito item) {
        // Buscar si ya existe un item con la misma película
        ItemCarrito itemExistente = items.stream()
            .filter(i -> i.getPelicula().getId().equals(item.getPelicula().getId()))
            .findFirst()
            .orElse(null);
            
        if (itemExistente != null) {
            // Actualizar cantidad del item existente
            itemExistente.setCantidad(itemExistente.getCantidad() + item.getCantidad());
        } else {
            // Agregar nuevo item
            items.add(item);
            item.setCarrito(this);
        }
        
        recalcularTotales();
    }
    
    /**
     * Remueve un item del carrito
     * @param item item a remover
     */
    public void removerItem(ItemCarrito item) {
        items.remove(item);
        item.setCarrito(null);
        recalcularTotales();
    }
    
    /**
     * Remueve un item del carrito por ID de película
     * @param peliculaId ID de la película
     */
    public void removerItemPorPeliculaId(Long peliculaId) {
        items.removeIf(item -> item.getPelicula().getId().equals(peliculaId));
        recalcularTotales();
    }
    
    /**
     * Actualiza la cantidad de un item específico
     * @param peliculaId ID de la película
     * @param nuevaCantidad nueva cantidad
     */
    public void actualizarCantidadItem(Long peliculaId, Integer nuevaCantidad) {
        ItemCarrito item = items.stream()
            .filter(i -> i.getPelicula().getId().equals(peliculaId))
            .findFirst()
            .orElse(null);
            
        if (item != null) {
            if (nuevaCantidad <= 0) {
                removerItem(item);
            } else {
                item.setCantidad(nuevaCantidad);
                recalcularTotales();
            }
        }
    }
    
    /**
     * Recalcula los totales del carrito basándose en los items
     */
    public void recalcularTotales() {
        subtotal = items.stream()
            .map(ItemCarrito::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calcular impuestos (ejemplo: 21% IVA)
        impuestos = subtotal.multiply(BigDecimal.valueOf(0.21));
        
        // Calcular total
        total = subtotal.add(impuestos);
    }
    
    /**
     * Vacía completamente el carrito
     */
    public void limpiar() {
        items.clear();
        recalcularTotales();
    }
    
    /**
     * Obtiene el número total de items en el carrito
     * @return suma de todas las cantidades
     */
    public Integer getTotalItems() {
        return items.stream()
            .mapToInt(ItemCarrito::getCantidad)
            .sum();
    }
    
    /**
     * Verifica si el carrito está vacío
     * @return true si no tiene items
     */
    public boolean estaVacio() {
        return items.isEmpty();
    }
    
    /**
     * Busca un item por ID de película
     * @param peliculaId ID de la película
     * @return el item si existe, null en caso contrario
     */
    public ItemCarrito buscarItemPorPelicula(Long peliculaId) {
        return items.stream()
            .filter(item -> item.getPelicula().getId().equals(peliculaId))
            .findFirst()
            .orElse(null);
    }
}