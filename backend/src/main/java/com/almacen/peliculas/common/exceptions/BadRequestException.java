package com.almacen.peliculas.common.exceptions;

/**
 * Excepción para peticiones incorrectas
 * 
 * @author Sistema de Almacén de Películas
 */
public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }
    
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}