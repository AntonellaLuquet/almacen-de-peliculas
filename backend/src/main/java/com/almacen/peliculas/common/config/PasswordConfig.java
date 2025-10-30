package com.almacen.peliculas.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuración para el codificador de passwords
 * 
 * Separado de SecurityConfig para evitar dependencias circulares
 * 
 * @author Sistema de Almacén de Películas
 */
@Configuration
public class PasswordConfig {
    
    /**
     * Bean para codificar passwords usando BCrypt
     * @return PasswordEncoder configurado con BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}