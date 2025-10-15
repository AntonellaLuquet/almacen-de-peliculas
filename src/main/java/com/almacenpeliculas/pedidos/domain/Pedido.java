package com.almacenpeliculas.pedidos.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entidad de dominio que representa un Pedido.
 * 
 * Atributos principales:
 * - Usuario que realizó el pedido
 * - Lista de items (películas y cantidades)
 * - Total de la compra
 * - Estado (PENDIENTE, PROCESADO, CANCELADO)
 * - Fecha de creación
 * - Fecha de procesamiento
 */
@Entity
@Table(name = "pedidos")
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // TODO: Agregar campos del pedido:
    //       - usuario (ManyToOne)
    //       - items (OneToMany)
    //       - total
    //       - estado
    //       - fechaCreacion
    //       - fechaProcesamiento
    
    // TODO: Agregar getters y setters
    // TODO: Agregar constructores
}
