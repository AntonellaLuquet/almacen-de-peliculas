package com.almacenpeliculas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación Almacén de Películas Online.
 * 
 * Esta aplicación web gestiona usuarios, catálogo de películas y compras mediante carrito.
 * Utiliza Spring Boot como framework principal y sigue una arquitectura de Vertical Slice
 * con módulos autónomos para Usuarios, Películas y Pedidos.
 */
@SpringBootApplication
public class AlmacenPeliculasApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlmacenPeliculasApplication.class, args);
    }
}
