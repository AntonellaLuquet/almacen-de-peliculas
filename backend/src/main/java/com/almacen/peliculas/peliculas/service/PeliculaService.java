package com.almacen.peliculas.peliculas.service;

import com.almacen.peliculas.peliculas.domain.*;
import com.almacen.peliculas.peliculas.infra.PeliculaRepository;
import com.almacen.peliculas.common.exceptions.ResourceNotFoundException;
import com.almacen.peliculas.common.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de películas del sistema
 * 
 * Proporciona operaciones de negocio para:
 * - CRUD completo de películas
 * - Búsqueda y filtrado avanzado
 * - Gestión de stock e inventario
 * - Consultas de catálogo y recomendaciones
 * 
 * Implementa lógica de negocio para mantener consistencia
 * en precios, stock y disponibilidad.
 * 
 * @author Sistema de Almacén de Películas
 */
@Service
@Transactional
public class PeliculaService {
    
    private final PeliculaRepository peliculaRepository;
    private final PeliculaMapper peliculaMapper;
    
    @Autowired
    public PeliculaService(PeliculaRepository peliculaRepository, PeliculaMapper peliculaMapper) {
        this.peliculaRepository = peliculaRepository;
        this.peliculaMapper = peliculaMapper;
    }
    
    /**
     * Crea una nueva película en el sistema
     * @param crearPeliculaDTO datos de la película a crear
     * @return DTO con los datos de la película creada
     * @throws BadRequestException si ya existe una película similar
     */
    public PeliculaDTO crearPelicula(CrearPeliculaDTO crearPeliculaDTO) {
        // Validar que no exista una película similar
        if (peliculaRepository.existsByTituloIgnoreCaseAndDirectorIgnoreCase(
                crearPeliculaDTO.getTitulo(), crearPeliculaDTO.getDirector())) {
            throw new BadRequestException(
                String.format("Ya existe una película con título '%s' del director '%s'", 
                    crearPeliculaDTO.getTitulo(), crearPeliculaDTO.getDirector()));
        }
        
        // Crear nueva película
        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(crearPeliculaDTO.getTitulo().trim());
        pelicula.setDescripcion(crearPeliculaDTO.getDescripcion());
        pelicula.setDirector(crearPeliculaDTO.getDirector().trim());
        pelicula.setAnio(crearPeliculaDTO.getAnio());
        pelicula.setDuracion(crearPeliculaDTO.getDuracion());
        pelicula.setGenero(crearPeliculaDTO.getGenero());
        pelicula.setClasificacion(crearPeliculaDTO.getClasificacion());
        pelicula.setPrecio(crearPeliculaDTO.getPrecio());
        pelicula.setStock(crearPeliculaDTO.getStock());
        pelicula.setDisponible(crearPeliculaDTO.getDisponible());
        pelicula.setImagenUrl(crearPeliculaDTO.getImagenUrl());
        pelicula.setTrailerUrl(crearPeliculaDTO.getTrailerUrl());
        
        // Agregar actores si están presentes
        if (crearPeliculaDTO.getActores() != null) {
            pelicula.setActores(crearPeliculaDTO.getActores().stream()
                .map(String::trim)
                .filter(actor -> !actor.isEmpty())
                .collect(Collectors.toSet()));
        }
        
        Pelicula peliculaGuardada = peliculaRepository.save(pelicula);
        return peliculaMapper.toDTO(peliculaGuardada);
    }
    
    /**
     * Obtiene una película por su ID
     * @param id identificador de la película
     * @return DTO con los datos de la película
     * @throws ResourceNotFoundException si la película no existe
     */
    @Transactional(readOnly = true)
    public PeliculaDTO obtenerPeliculaPorId(Long id) {
        Pelicula pelicula = peliculaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con ID: " + id));
        return peliculaMapper.toDTO(pelicula);
    }
    
    /**
     * Actualiza una película existente
     * @param id identificador de la película
     * @param actualizarDTO datos actualizados
     * @return DTO con los datos actualizados
     * @throws ResourceNotFoundException si la película no existe
     */
    public PeliculaDTO actualizarPelicula(Long id, ActualizarPeliculaDTO actualizarDTO) {
        Pelicula pelicula = peliculaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con ID: " + id));
        
        // Actualizar campos no nulos
        if (actualizarDTO.getTitulo() != null) {
            pelicula.setTitulo(actualizarDTO.getTitulo().trim());
        }
        if (actualizarDTO.getDescripcion() != null) {
            pelicula.setDescripcion(actualizarDTO.getDescripcion());
        }
        if (actualizarDTO.getDirector() != null) {
            pelicula.setDirector(actualizarDTO.getDirector().trim());
        }
        if (actualizarDTO.getAnio() != null) {
            pelicula.setAnio(actualizarDTO.getAnio());
        }
        if (actualizarDTO.getDuracion() != null) {
            pelicula.setDuracion(actualizarDTO.getDuracion());
        }
        if (actualizarDTO.getGenero() != null) {
            pelicula.setGenero(actualizarDTO.getGenero());
        }
        if (actualizarDTO.getClasificacion() != null) {
            pelicula.setClasificacion(actualizarDTO.getClasificacion());
        }
        if (actualizarDTO.getPrecio() != null) {
            pelicula.setPrecio(actualizarDTO.getPrecio());
        }
        if (actualizarDTO.getImagenUrl() != null) {
            pelicula.setImagenUrl(actualizarDTO.getImagenUrl());
        }
        if (actualizarDTO.getTrailerUrl() != null) {
            pelicula.setTrailerUrl(actualizarDTO.getTrailerUrl());
        }
        if (actualizarDTO.getActores() != null) {
            pelicula.setActores(actualizarDTO.getActores().stream()
                .map(String::trim)
                .filter(actor -> !actor.isEmpty())
                .collect(Collectors.toSet()));
        }
        if (actualizarDTO.getDisponible() != null) {
            pelicula.setDisponible(actualizarDTO.getDisponible());
        }
        
        Pelicula peliculaActualizada = peliculaRepository.save(pelicula);
        return peliculaMapper.toDTO(peliculaActualizada);
    }
    
    /**
     * Elimina una película (marca como no disponible)
     * @param id identificador de la película
     * @throws ResourceNotFoundException si la película no existe
     */
    public void eliminarPelicula(Long id) {
        Pelicula pelicula = peliculaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con ID: " + id));
        
        pelicula.setDisponible(false);
        peliculaRepository.save(pelicula);
    }
    
    /**
     * Obtiene todas las películas disponibles con paginación
     * @param pageable información de paginación
     * @return página de películas disponibles
     */
    @Transactional(readOnly = true)
    public Page<PeliculaDTO> obtenerPeliculasDisponibles(Pageable pageable) {
        Page<Pelicula> peliculas = peliculaRepository.findByDisponibleTrue(pageable);
        return peliculas.map(peliculaMapper::toDTO);
    }
    
    /**
     * Busca películas por término de búsqueda general
     * @param searchTerm término de búsqueda (título, director, actor)
     * @param pageable información de paginación
     * @return página de películas que coinciden
     */
    @Transactional(readOnly = true)
    public Page<PeliculaDTO> buscarPeliculas(String searchTerm, Pageable pageable) {
        Page<Pelicula> peliculas = peliculaRepository.buscarPeliculas(searchTerm, pageable);
        return peliculas.map(peliculaMapper::toDTO);
    }
    
    /**
     * Búsqueda avanzada con múltiples filtros
     * @param filtros objeto con criterios de filtrado
     * @param pageable información de paginación
     * @return página de películas filtradas
     */
    @Transactional(readOnly = true)
    public Page<PeliculaDTO> buscarConFiltros(FiltrosPeliculaDTO filtros, Pageable pageable) {
        Page<Pelicula> peliculas = peliculaRepository.buscarConFiltros(
            filtros.getSearchTerm(),
            filtros.getGenero(),
            filtros.getAnioDesde(),
            filtros.getAnioHasta(),
            filtros.getPrecioMin(),
            filtros.getPrecioMax(),
            pageable
        );
        return peliculas.map(peliculaMapper::toDTO);
    }
    
    /**
     * Filtra películas por género
     * @param genero género de películas
     * @param pageable información de paginación
     * @return página de películas del género
     */
    @Transactional(readOnly = true)
    public Page<PeliculaDTO> obtenerPeliculasPorGenero(Genero genero, Pageable pageable) {
        Page<Pelicula> peliculas = peliculaRepository.findByGeneroAndDisponibleTrue(genero, pageable);
        return peliculas.map(peliculaMapper::toDTO);
    }
    
    /**
     * Obtiene películas más recientes
     * @param limit número máximo de películas
     * @return lista de películas más recientes
     */
    @Transactional(readOnly = true)
    public List<PeliculaDTO> obtenerPeliculasMasRecientes(int limit) {
        List<Pelicula> peliculas = peliculaRepository.findPeliculasMasRecientes(limit);
        return peliculas.stream()
            .map(peliculaMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene películas más populares
     * @param pageable información de paginación
     * @return página de películas populares
     */
    @Transactional(readOnly = true)
    public Page<PeliculaDTO> obtenerPeliculasMasPopulares(Pageable pageable) {
        Page<Pelicula> peliculas = peliculaRepository.findPeliculasMasPopulares(pageable);
        return peliculas.map(peliculaMapper::toDTO);
    }
    
    /**
     * Actualiza el stock de una película
     * @param id identificador de la película
     * @param nuevoStock nuevo valor de stock
     * @throws ResourceNotFoundException si la película no existe
     * @throws BadRequestException si el stock es negativo
     */
    public void actualizarStock(Long id, Integer nuevoStock) {
        if (nuevoStock < 0) {
            throw new BadRequestException("El stock no puede ser negativo");
        }
        
        Pelicula pelicula = peliculaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con ID: " + id));
        
        pelicula.setStock(nuevoStock);
        peliculaRepository.save(pelicula);
    }
    
    /**
     * Reduce el stock de una película (usado en ventas)
     * @param id identificador de la película
     * @param cantidad cantidad a reducir
     * @throws ResourceNotFoundException si la película no existe
     * @throws BadRequestException si no hay suficiente stock
     */
    public void reducirStock(Long id, Integer cantidad) {
        Pelicula pelicula = peliculaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con ID: " + id));
        
        pelicula.reducirStock(cantidad);
        peliculaRepository.save(pelicula);
    }
    
    /**
     * Aumenta el stock de una película (usado en reposición)
     * @param id identificador de la película
     * @param cantidad cantidad a agregar
     * @throws ResourceNotFoundException si la película no existe
     */
    public void aumentarStock(Long id, Integer cantidad) {
        Pelicula pelicula = peliculaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con ID: " + id));
        
        pelicula.agregarStock(cantidad);
        peliculaRepository.save(pelicula);
    }
    
    /**
     * Obtiene géneros disponibles con películas
     * @return lista de géneros que tienen películas disponibles
     */
    @Transactional(readOnly = true)
    public List<Genero> obtenerGenerosDisponibles() {
        return peliculaRepository.findGenerosDisponibles();
    }
    
    /**
     * Obtiene años disponibles con películas
     * @return lista de años que tienen películas disponibles
     */
    @Transactional(readOnly = true)
    public List<Integer> obtenerAniosDisponibles() {
        return peliculaRepository.findAniosDisponibles();
    }
    
    /**
     * Obtiene estadísticas del catálogo de películas
     * @return objeto con estadísticas
     */
    @Transactional(readOnly = true)
    public EstadisticasPeliculasDTO obtenerEstadisticas() {
        long totalPeliculas = peliculaRepository.countByDisponibleTrue();
        List<Genero> generos = peliculaRepository.findGenerosDisponibles();
        
        return new EstadisticasPeliculasDTO(totalPeliculas, generos.size(), generos);
    }
    
    /**
     * Obtiene películas con stock bajo
     * @param stockMinimo umbral de stock bajo
     * @return lista de películas con stock bajo
     */
    @Transactional(readOnly = true)
    public List<PeliculaDTO> obtenerPeliculasConStockBajo(int stockMinimo) {
        List<Pelicula> peliculas = peliculaRepository.findPeliculasConStockBajo(stockMinimo);
        return peliculas.stream()
            .map(peliculaMapper::toDTO)
            .collect(Collectors.toList());
    }
}