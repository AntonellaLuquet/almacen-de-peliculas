package com.almacenpeliculas.common.exceptions;

/**
 * Excepción lanzada cuando no se encuentra un recurso solicitado.
 * 
 * Ejemplos:
 * - Película no encontrada por ID
 * - Usuario no encontrado por email
 * - Pedido no encontrado
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceName, Long id) {
        super(String.format("%s con ID %d no encontrado", resourceName, id));
    }
    
    public ResourceNotFoundException(String resourceName, String field, String value) {
        super(String.format("%s con %s '%s' no encontrado", resourceName, field, value));
    }
}
