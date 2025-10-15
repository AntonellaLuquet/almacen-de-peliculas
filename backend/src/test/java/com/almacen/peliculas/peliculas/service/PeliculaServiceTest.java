package com.almacen.peliculas.peliculas.service;

import com.almacen.peliculas.peliculas.domain.*;
import com.almacen.peliculas.peliculas.infra.PeliculaRepository;
import com.almacen.peliculas.common.exceptions.BadRequestException;
import com.almacen.peliculas.common.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para PeliculaService
 * 
 * @author Sistema de Almacén de Películas
 */
@ExtendWith(MockitoExtension.class)
class PeliculaServiceTest {
    
    @Mock
    private PeliculaRepository peliculaRepository;
    
    @Mock
    private PeliculaMapper peliculaMapper;
    
    @InjectMocks
    private PeliculaService peliculaService;
    
    private Pelicula pelicula;
    private CrearPeliculaDTO crearDTO;
    private PeliculaDTO peliculaDTO;
    
    @BeforeEach
    void setUp() {
        pelicula = new Pelicula();
        pelicula.setId(1L);
        pelicula.setTitulo("El Padrino");
        pelicula.setDirector("Francis Ford Coppola");
        pelicula.setAnio(1972);
        pelicula.setGenero(Genero.DRAMA);
        pelicula.setClasificacion(ClasificacionEdad.R);
        pelicula.setPrecio(BigDecimal.valueOf(19.99));
        pelicula.setStock(25);
        pelicula.setDisponible(true);
        
        crearDTO = new CrearPeliculaDTO();
        crearDTO.setTitulo("El Padrino");
        crearDTO.setDirector("Francis Ford Coppola");
        crearDTO.setAnio(1972);
        crearDTO.setGenero(Genero.DRAMA);
        crearDTO.setClasificacion(ClasificacionEdad.R);
        crearDTO.setPrecio(BigDecimal.valueOf(19.99));
        crearDTO.setStock(25);
        
        peliculaDTO = new PeliculaDTO();
        peliculaDTO.setId(1L);
        peliculaDTO.setTitulo("El Padrino");
        peliculaDTO.setDirector("Francis Ford Coppola");
        peliculaDTO.setAnio(1972);
        peliculaDTO.setGenero(Genero.DRAMA);
        peliculaDTO.setPrecio(BigDecimal.valueOf(19.99));
        peliculaDTO.setDisponible(true);
    }
    
    @Test
    void crearPelicula_Success() {
        // Given
        when(peliculaRepository.existsByTituloIgnoreCaseAndDirectorIgnoreCase(anyString(), anyString()))
            .thenReturn(false);
        when(peliculaRepository.save(any(Pelicula.class))).thenReturn(pelicula);
        when(peliculaMapper.toDTO(any(Pelicula.class))).thenReturn(peliculaDTO);
        
        // When
        PeliculaDTO result = peliculaService.crearPelicula(crearDTO);
        
        // Then
        assertNotNull(result);
        assertEquals("El Padrino", result.getTitulo());
        verify(peliculaRepository).existsByTituloIgnoreCaseAndDirectorIgnoreCase("El Padrino", "Francis Ford Coppola");
        verify(peliculaRepository).save(any(Pelicula.class));
    }
    
    @Test
    void crearPelicula_AlreadyExists_ThrowsException() {
        // Given
        when(peliculaRepository.existsByTituloIgnoreCaseAndDirectorIgnoreCase(anyString(), anyString()))
            .thenReturn(true);
        
        // When & Then
        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> peliculaService.crearPelicula(crearDTO)
        );
        
        assertTrue(exception.getMessage().contains("Ya existe una película"));
        verify(peliculaRepository, never()).save(any(Pelicula.class));
    }
    
    @Test
    void obtenerPeliculaPorId_Success() {
        // Given
        when(peliculaRepository.findById(1L)).thenReturn(Optional.of(pelicula));
        when(peliculaMapper.toDTO(pelicula)).thenReturn(peliculaDTO);
        
        // When
        PeliculaDTO result = peliculaService.obtenerPeliculaPorId(1L);
        
        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(peliculaRepository).findById(1L);
    }
    
    @Test
    void obtenerPeliculaPorId_NotFound_ThrowsException() {
        // Given
        when(peliculaRepository.findById(1L)).thenReturn(Optional.empty());
        
        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> peliculaService.obtenerPeliculaPorId(1L)
        );
        
        assertTrue(exception.getMessage().contains("Película no encontrada con ID: 1"));
    }
    
    @Test
    void actualizarStock_Success() {
        // Given
        when(peliculaRepository.findById(1L)).thenReturn(Optional.of(pelicula));
        when(peliculaRepository.save(any(Pelicula.class))).thenReturn(pelicula);
        
        // When
        peliculaService.actualizarStock(1L, 50);
        
        // Then
        verify(peliculaRepository).findById(1L);
        verify(peliculaRepository).save(pelicula);
        assertEquals(50, pelicula.getStock());
    }
    
    @Test
    void actualizarStock_NegativeStock_ThrowsException() {
        // When & Then
        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> peliculaService.actualizarStock(1L, -5)
        );
        
        assertTrue(exception.getMessage().contains("El stock no puede ser negativo"));
        verify(peliculaRepository, never()).save(any(Pelicula.class));
    }
    
    @Test
    void reducirStock_Success() {
        // Given
        when(peliculaRepository.findById(1L)).thenReturn(Optional.of(pelicula));
        when(peliculaRepository.save(any(Pelicula.class))).thenReturn(pelicula);
        
        // When
        peliculaService.reducirStock(1L, 5);
        
        // Then
        verify(peliculaRepository).findById(1L);
        verify(peliculaRepository).save(pelicula);
        assertEquals(20, pelicula.getStock()); // 25 - 5 = 20
    }
    
    @Test
    void reducirStock_InsufficientStock_ThrowsException() {
        // Given
        when(peliculaRepository.findById(1L)).thenReturn(Optional.of(pelicula));
        
        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> peliculaService.reducirStock(1L, 30) // Más del stock disponible (25)
        );
        
        assertTrue(exception.getMessage().contains("Stock insuficiente"));
    }
}