package com.almacenpeliculas.common.utils;

/**
 * Utilidades comunes para la aplicación.
 * 
 * Proporciona métodos helper reutilizables en todo el proyecto.
 */
public class AppUtils {
    
    private AppUtils() {
        // Constructor privado para clase de utilidades
    }
    
    /**
     * Valida que un email tenga formato válido.
     */
    public static boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
    
    /**
     * Genera un código de pedido único.
     */
    public static String generarCodigoPedido() {
        return "PED-" + System.currentTimeMillis();
    }
}
