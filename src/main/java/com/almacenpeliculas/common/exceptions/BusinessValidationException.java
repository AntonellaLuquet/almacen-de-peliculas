package com.almacenpeliculas.common.exceptions;

/**
 * Excepción lanzada cuando se viola una regla de negocio.
 * 
 * Ejemplos:
 * - Stock insuficiente para procesar compra
 * - Email ya registrado en el sistema
 * - Precio de película inválido
 * - Carrito vacío al intentar comprar
 */
public class BusinessValidationException extends RuntimeException {
    
    public BusinessValidationException(String message) {
        super(message);
    }
}
