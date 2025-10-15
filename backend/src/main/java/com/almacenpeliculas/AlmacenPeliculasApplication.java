package com.almacenpeliculas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación Almacén de Películas Online.
 * 
 * Esta aplicación implementa un sistema completo de tienda de películas online con:
 * - Autenticación y gestión de usuarios
 * - Catálogo de películas con búsqueda y filtros
 * - Carrito de compras y procesamiento de pedidos
 * - Panel administrativo para gestión de stock
 * 
 * Arquitectura: Monolito modular con patrón Vertical Slice
 * - Cada módulo contiene: Controller, Service, Domain, Repository
 * - Módulos: usuarios, peliculas, pedidos, common
 */
@SpringBootApplication
public class AlmacenPeliculasApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlmacenPeliculasApplication.class, args);
    }
}
