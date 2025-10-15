package com.almacenpeliculas.common.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Utilidades para manejo de fechas y tiempos.
 * 
 * Proporciona métodos helper para:
 * - Formateo de fechas
 * - Conversiones de zona horaria
 * - Cálculos de diferencias de tiempo
 */
public class DateUtils {
    
    private static final DateTimeFormatter DEFAULT_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * Formatea una fecha al formato por defecto.
     */
    public static String format(LocalDateTime dateTime) {
        return dateTime.format(DEFAULT_FORMATTER);
    }
    
    /**
     * Obtiene la fecha y hora actual.
     */
    public static LocalDateTime now() {
        return LocalDateTime.now();
    }
    
    // TODO: Agregar más métodos útiles según necesidades del proyecto
}
