package com.almacen.peliculas.peliculas.service;

import com.almacen.peliculas.peliculas.domain.Pelicula;
import com.almacen.peliculas.peliculas.domain.PeliculaDTO;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-29T16:02:18-0300",
    comments = "version: 1.6.0, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class PeliculaMapperImpl implements PeliculaMapper {

    @Override
    public PeliculaDTO toDTO(Pelicula pelicula) {
        if ( pelicula == null ) {
            return null;
        }

        PeliculaDTO peliculaDTO = new PeliculaDTO();

        peliculaDTO.setId( pelicula.getId() );
        peliculaDTO.setTitulo( pelicula.getTitulo() );
        peliculaDTO.setDescripcion( pelicula.getDescripcion() );
        peliculaDTO.setDirector( pelicula.getDirector() );
        peliculaDTO.setAnio( pelicula.getAnio() );
        peliculaDTO.setDuracion( pelicula.getDuracion() );
        peliculaDTO.setGenero( pelicula.getGenero() );
        peliculaDTO.setClasificacion( pelicula.getClasificacion() );
        peliculaDTO.setPrecio( pelicula.getPrecio() );
        peliculaDTO.setStock( pelicula.getStock() );
        peliculaDTO.setDisponible( pelicula.getDisponible() );
        peliculaDTO.setImagenUrl( pelicula.getImagenUrl() );
        peliculaDTO.setTrailerUrl( pelicula.getTrailerUrl() );
        Set<String> set = pelicula.getActores();
        if ( set != null ) {
            peliculaDTO.setActores( new LinkedHashSet<String>( set ) );
        }
        peliculaDTO.setFechaCreacion( pelicula.getFechaCreacion() );
        peliculaDTO.setFechaActualizacion( pelicula.getFechaActualizacion() );

        peliculaDTO.setDuracionFormateada( pelicula.getDuracionFormateada() );

        return peliculaDTO;
    }

    @Override
    public Pelicula toEntity(PeliculaDTO peliculaDTO) {
        if ( peliculaDTO == null ) {
            return null;
        }

        Pelicula pelicula = new Pelicula();

        pelicula.setId( peliculaDTO.getId() );
        pelicula.setTitulo( peliculaDTO.getTitulo() );
        pelicula.setDescripcion( peliculaDTO.getDescripcion() );
        pelicula.setDirector( peliculaDTO.getDirector() );
        pelicula.setAnio( peliculaDTO.getAnio() );
        pelicula.setDuracion( peliculaDTO.getDuracion() );
        pelicula.setGenero( peliculaDTO.getGenero() );
        pelicula.setClasificacion( peliculaDTO.getClasificacion() );
        pelicula.setPrecio( peliculaDTO.getPrecio() );
        pelicula.setStock( peliculaDTO.getStock() );
        pelicula.setDisponible( peliculaDTO.getDisponible() );
        pelicula.setImagenUrl( peliculaDTO.getImagenUrl() );
        pelicula.setTrailerUrl( peliculaDTO.getTrailerUrl() );
        Set<String> set = peliculaDTO.getActores();
        if ( set != null ) {
            pelicula.setActores( new LinkedHashSet<String>( set ) );
        }

        return pelicula;
    }
}
