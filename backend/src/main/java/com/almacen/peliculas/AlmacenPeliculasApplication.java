package com.almacen.peliculas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync // Habilitar procesamiento asíncrono
public class AlmacenPeliculasApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlmacenPeliculasApplication.class, args);
    }

}
