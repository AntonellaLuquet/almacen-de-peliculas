package com.almacen.peliculas.peliculas.service;

import com.almacen.peliculas.peliculas.domain.*;
import com.almacen.peliculas.peliculas.infra.PeliculaRepository;
import com.almacen.peliculas.common.exceptions.BadRequestException;
import com.almacen.peliculas.common.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

/**
 * Tests de integración para PeliculaService
 * Prueba la lógica de negocio con base de datos real (H2)
 */
@SpringBootTest
@Transactional
class PeliculaServiceIntegrationTest {

    @Autowired
    private PeliculaService peliculaService;

    @Autowired
    private PeliculaRepository peliculaRepository;

    private CrearPeliculaDTO crearDTO;

    @BeforeEach
    void setUp() {
        // Limpiar base de datos
        peliculaRepository.deleteAll();

        // Preparar DTO para crear película
        crearDTO = new CrearPeliculaDTO();
        crearDTO.setTitulo("El Padrino");
        crearDTO.setDescripcion("La historia de la familia Corleone");
        crearDTO.setDirector("Francis Ford Coppola");
        crearDTO.setAnio(1972);
        crearDTO.setDuracion(175);
        crearDTO.setGenero(Genero.DRAMA);
        crearDTO.setClasificacion(ClasificacionEdad.R);
        crearDTO.setPrecio(new BigDecimal("1500.00"));
        crearDTO.setStock(50);
        crearDTO.setDisponible(true);
        crearDTO.setImagenUrl("https://example.com/padrino.jpg");
        crearDTO.setActores(new HashSet<>(List.of("Marlon Brando", "Al Pacino")));
    }

    @Test
    @DisplayName("Crear película exitosamente")
    void testCrearPelicula_Success() {
        // When
        PeliculaDTO resultado = peliculaService.crearPelicula(crearDTO);

        // Then
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isNotNull();
        assertThat(resultado.getTitulo()).isEqualTo("El Padrino");
        assertThat(resultado.getDirector()).isEqualTo("Francis Ford Coppola");
        assertThat(resultado.getAnio()).isEqualTo(1972);
        assertThat(resultado.getPrecio()).isEqualByComparingTo(new BigDecimal("1500.00"));
        assertThat(resultado.getStock()).isEqualTo(50);
    }

    @Test
    @DisplayName("No crear película duplicada")
    void testCrearPelicula_Duplicada_ThrowsException() {
        // Given
        peliculaService.crearPelicula(crearDTO);

        // When & Then
        assertThatThrownBy(() -> peliculaService.crearPelicula(crearDTO))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Ya existe una película");
    }

    @Test
    @DisplayName("Obtener película por ID existente")
    void testObtenerPeliculaPorId_Success() {
        // Given
        PeliculaDTO creada = peliculaService.crearPelicula(crearDTO);

        // When
        PeliculaDTO resultado = peliculaService.obtenerPeliculaPorId(creada.getId());

        // Then
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(creada.getId());
        assertThat(resultado.getTitulo()).isEqualTo("El Padrino");
    }

    @Test
    @DisplayName("Obtener película por ID inexistente lanza excepción")
    void testObtenerPeliculaPorId_NotFound_ThrowsException() {
        // When & Then
        assertThatThrownBy(() -> peliculaService.obtenerPeliculaPorId(999L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("no encontrada");
    }

    @Test
    @DisplayName("Actualizar película exitosamente")
    void testActualizarPelicula_Success() {
        // Given
        PeliculaDTO creada = peliculaService.crearPelicula(crearDTO);
        
        ActualizarPeliculaDTO actualizarDTO = new ActualizarPeliculaDTO();
        actualizarDTO.setPrecio(new BigDecimal("1800.00"));
        actualizarDTO.setStock(60);

        // When
        PeliculaDTO resultado = peliculaService.actualizarPelicula(creada.getId(), actualizarDTO);

        // Then
        assertThat(resultado.getPrecio()).isEqualByComparingTo(new BigDecimal("1800.00"));
        assertThat(resultado.getStock()).isEqualTo(60);
        assertThat(resultado.getTitulo()).isEqualTo("El Padrino"); // No cambió
    }

    @Test
    @DisplayName("Eliminar película (soft delete)")
    void testEliminarPelicula_Success() {
        // Given
        PeliculaDTO creada = peliculaService.crearPelicula(crearDTO);

        // When
        peliculaService.eliminarPelicula(creada.getId());

        // Then
        PeliculaDTO resultado = peliculaService.obtenerPeliculaPorId(creada.getId());
        assertThat(resultado.getDisponible()).isFalse();
    }

    @Test
    @DisplayName("Obtener películas disponibles con paginación")
    void testObtenerPeliculasDisponibles_Success() {
        // Given
        peliculaService.crearPelicula(crearDTO);
        
        CrearPeliculaDTO pelicula2 = new CrearPeliculaDTO();
        pelicula2.setTitulo("Inception");
        pelicula2.setDirector("Christopher Nolan");
        pelicula2.setAnio(2010);
        pelicula2.setDuracion(148);
        pelicula2.setGenero(Genero.CIENCIA_FICCION);
        pelicula2.setClasificacion(ClasificacionEdad.PG_13);
        pelicula2.setPrecio(new BigDecimal("1200.00"));
        pelicula2.setStock(30);
        pelicula2.setDisponible(true);
        peliculaService.crearPelicula(pelicula2);

        // When
        Page<PeliculaDTO> resultado = peliculaService.obtenerPeliculasDisponibles(PageRequest.of(0, 10));

        // Then
        assertThat(resultado.getContent()).hasSize(2);
        assertThat(resultado.getTotalElements()).isEqualTo(2);
    }

    @Test
    @DisplayName("Buscar películas por género")
    void testObtenerPeliculasPorGenero_Success() {
        // Given
        peliculaService.crearPelicula(crearDTO);

        // When
        Page<PeliculaDTO> resultado = peliculaService.obtenerPeliculasPorGenero(
            Genero.DRAMA, 
            PageRequest.of(0, 10)
        );

        // Then
        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getGenero()).isEqualTo(Genero.DRAMA);
    }

    @Test
    @DisplayName("Buscar películas con filtros avanzados")
    void testBuscarConFiltros_Success() {
        // Given
        peliculaService.crearPelicula(crearDTO);

        FiltrosPeliculaDTO filtros = new FiltrosPeliculaDTO();
        filtros.setSearchTerm("Padrino");
        filtros.setAnioDesde(1970);
        filtros.setAnioHasta(1975);

        // When
        Page<PeliculaDTO> resultado = peliculaService.buscarConFiltros(filtros, PageRequest.of(0, 10));

        // Then
        assertThat(resultado.getContent()).hasSize(1);
        assertThat(resultado.getContent().get(0).getTitulo()).contains("Padrino");
    }

    @Test
    @DisplayName("Obtener películas más recientes")
    void testObtenerPeliculasMasRecientes_Success() {
        // Given
        peliculaService.crearPelicula(crearDTO);

        // When
        List<PeliculaDTO> resultado = peliculaService.obtenerPeliculasMasRecientes(5);

        // Then
        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getTitulo()).isEqualTo("El Padrino");
    }
}
