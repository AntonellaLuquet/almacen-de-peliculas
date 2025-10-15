package com.almacenpeliculas.common.utils;

import java.util.regex.Pattern;

/**
 * Utilidades para validación de datos.
 * 
 * Proporciona métodos helper para:
 * - Validación de emails
 * - Validación de passwords
 * - Validación de datos de negocio
 */
public class ValidationUtils {
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    
    /**
     * Valida el formato de un email.
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Valida que un password cumpla requisitos mínimos.
     */
    public static boolean isValidPassword(String password) {
        if (password == null) {
            return false;
        }
        // Mínimo 8 caracteres
        return password.length() >= 8;
    }
    
    /**
     * Valida que un string no esté vacío.
     */
    public static boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }
    
    // TODO: Agregar más validaciones según necesidades del proyecto
}
