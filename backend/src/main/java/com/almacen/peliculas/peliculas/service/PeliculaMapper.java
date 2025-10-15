package com.almacen.peliculas.peliculas.service;

import com.almacen.peliculas.peliculas.domain.Pelicula;
import com.almacen.peliculas.peliculas.domain.PeliculaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidades Película y DTOs
 * 
 * Utiliza MapStruct para generar automáticamente las implementaciones
 * de conversión entre objetos de dominio y DTOs.
 * 
 * @author Sistema de Almacén de Películas
 */
@Mapper(componentModel = "spring")
@Component
public interface PeliculaMapper {
    
    /**
     * Convierte una entidad Película a PeliculaDTO
     * Incluye el cálculo automático de duración formateada
     * @param pelicula entidad Película
     * @return DTO de la película
     */
    @Mapping(target = "duracionFormateada", expression = "java(pelicula.getDuracionFormateada())")
    PeliculaDTO toDTO(Pelicula pelicula);
    
    /**
     * Convierte un PeliculaDTO a entidad Película
     * @param peliculaDTO DTO de la película
     * @return entidad Película
     */
    @Mapping(target = "fechaCreacion", ignore = true)
    @Mapping(target = "fechaActualizacion", ignore = true)
    Pelicula toEntity(PeliculaDTO peliculaDTO);
}