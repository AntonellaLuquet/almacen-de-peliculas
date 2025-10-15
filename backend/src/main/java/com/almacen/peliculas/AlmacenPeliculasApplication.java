package com.almacen.peliculas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Clase principal de la aplicación Spring Boot
 * Almacén de Películas Online - API REST
 * 
 * Esta aplicación proporciona servicios REST para:
 * - Gestión de usuarios (registro, login, perfil)
 * - CRUD de películas con búsqueda y filtros
 * - Gestión de carrito de compras y pedidos
 * 
 * Arquitectura: Vertical Slice por módulo
 * - usuarios/: Gestión de usuarios
 * - peliculas/: CRUD y búsqueda de películas
 * - pedidos/: Carrito y gestión de compras
 * - common/: Configuración global y utilidades
 * 
 * @author Sistema de Almacén de Películas
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class AlmacenPeliculasApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlmacenPeliculasApplication.class, args);
    }
}