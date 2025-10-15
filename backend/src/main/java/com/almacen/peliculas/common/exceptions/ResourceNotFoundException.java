package com.almacen.peliculas.common.exceptions;

/**
 * Excepción para recursos no encontrados
 * 
 * @author Sistema de Almacén de Películas
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}