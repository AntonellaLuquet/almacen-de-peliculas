package com.almacenpeliculas.pedidos.domain;

import com.almacenpeliculas.peliculas.domain.Pelicula;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Entidad PedidoItem.
 * 
 * Representa un ítem (película) dentro de un pedido.
 */
@Entity
@Table(name = "pedido_items")
@Data
public class PedidoItem {
    
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
    
    @Column(name = "precio_unitario", precision = 10, scale = 2, nullable = false)
    private BigDecimal precioUnitario;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;
}
