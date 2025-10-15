package com.almacen.peliculas.pedidos.domain;

import com.almacen.peliculas.peliculas.domain.Pelicula;
import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * Entidad ItemPedido que representa un item específico dentro de un pedido
 * 
 * Contiene información del item:
 * - Referencia a la película comprada
 * - Cantidad solicitada
 * - Precio unitario al momento de la compra (histórico)
 * - Subtotal calculado
 * 
 * @author Sistema de Almacén de Películas
 */
@Entity
@Table(name = "items_pedido")
public class ItemPedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pelicula_id", nullable = false)
    private Pelicula pelicula;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    // Campos desnormalizados para mantener histórico
    @Column(nullable = false, length = 200)
    private String tituloPelicula;
    
    @Column(length = 100)
    private String directorPelicula;
    
    @Column
    private Integer anioPelicula;
    
    // Constructores
    public ItemPedido() {}
    
    public ItemPedido(Pelicula pelicula, Integer cantidad) {
        this.pelicula = pelicula;
        this.cantidad = cantidad;
        this.precioUnitario = pelicula.getPrecio();
        this.subtotal = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
        
        // Guardar información histórica
        this.tituloPelicula = pelicula.getTitulo();
        this.directorPelicula = pelicula.getDirector();
        this.anioPelicula = pelicula.getAnio();
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Pedido getPedido() {
        return pedido;
    }
    
    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
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
    
    public String getTituloPelicula() {
        return tituloPelicula;
    }
    
    public void setTituloPelicula(String tituloPelicula) {
        this.tituloPelicula = tituloPelicula;
    }
    
    public String getDirectorPelicula() {
        return directorPelicula;
    }
    
    public void setDirectorPelicula(String directorPelicula) {
        this.directorPelicula = directorPelicula;
    }
    
    public Integer getAnioPelicula() {
        return anioPelicula;
    }
    
    public void setAnioPelicula(Integer anioPelicula) {
        this.anioPelicula = anioPelicula;
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
}