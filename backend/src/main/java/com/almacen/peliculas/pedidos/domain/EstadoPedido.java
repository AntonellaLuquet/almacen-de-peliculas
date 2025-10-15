package com.almacen.peliculas.pedidos.domain;

/**
 * Enumeración de estados de pedido
 * 
 * Define los diferentes estados por los que puede pasar un pedido
 * en su ciclo de vida desde la creación hasta la entrega.
 * 
 * @author Sistema de Almacén de Películas
 */
public enum EstadoPedido {
    /**
     * Pedido creado pero no confirmado (carrito de compras)
     */
    PENDIENTE("Pendiente"),
    
    /**
     * Pedido confirmado y pagado
     */
    CONFIRMADO("Confirmado"),
    
    /**
     * Pedido en proceso de preparación
     */
    PROCESANDO("Procesando"),
    
    /**
     * Pedido enviado al cliente
     */
    ENVIADO("Enviado"),
    
    /**
     * Pedido entregado exitosamente
     */
    ENTREGADO("Entregado"),
    
    /**
     * Pedido cancelado por el usuario o sistema
     */
    CANCELADO("Cancelado"),
    
    /**
     * Pedido devuelto por el cliente
     */
    DEVUELTO("Devuelto");
    
    private final String displayName;
    
    EstadoPedido(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    /**
     * Verifica si el pedido está en un estado final
     * @return true si el estado es final (no puede cambiar)
     */
    public boolean esFinal() {
        return this == ENTREGADO || this == CANCELADO || this == DEVUELTO;
    }
    
    /**
     * Verifica si el pedido puede ser cancelado desde este estado
     * @return true si se puede cancelar
     */
    public boolean puedeCancelarse() {
        return this == PENDIENTE || this == CONFIRMADO || this == PROCESANDO;
    }
}