package com.almacen.peliculas.peliculas.api;

import com.almacen.peliculas.peliculas.domain.*;
import com.almacen.peliculas.peliculas.service.PeliculaService;
import com.almacen.peliculas.peliculas.service.EstadisticasPeliculasDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para la gestión de películas
 * 
 * Endpoints disponibles:
 * - GET /peliculas: Listar películas disponibles
 * - GET /peliculas/{id}: Obtener película por ID
 * - POST /peliculas: Crear nueva película (solo admin)
 * - PUT /peliculas/{id}: Actualizar película (solo admin)
 * - DELETE /peliculas/{id}: Eliminar película (solo admin)
 * - GET /peliculas/buscar: Búsqueda general de películas
 * - GET /peliculas/filtrar: Búsqueda avanzada con filtros
 * - GET /peliculas/genero/{genero}: Filtrar por género
 * - GET /peliculas/recientes: Películas más recientes
 * - GET /peliculas/populares: Películas más populares
 * - PUT /peliculas/{id}/stock: Actualizar stock (solo admin)
 * - GET /peliculas/generos: Obtener géneros disponibles
 * - GET /peliculas/anios: Obtener años disponibles
 * - GET /peliculas/estadisticas: Estadísticas del catálogo (solo admin)
 * - GET /peliculas/stock-bajo: Películas con stock bajo (solo admin)
 * 
 * @author Sistema de Almacén de Películas
 */
@RestController
@RequestMapping("/peliculas")
@Tag(name = "Películas", description = "Gestión del catálogo de películas")
public class PeliculaController {
    
    private final PeliculaService peliculaService;
    
    @Autowired
    public PeliculaController(PeliculaService peliculaService) {
        this.peliculaService = peliculaService;
    }
    
    /**
     * Lista todas las películas disponibles con paginación
     */
    @Operation(summary = "Listar películas", 
               description = "Obtiene todas las películas disponibles con paginación")
    @ApiResponse(responseCode = "200", description = "Lista de películas obtenida exitosamente")
    @GetMapping
    public ResponseEntity<Page<PeliculaDTO>> listarPeliculas(
            @PageableDefault(size = 12) Pageable pageable) {
        
        Page<PeliculaDTO> peliculas = peliculaService.obtenerPeliculasDisponibles(pageable);
        return ResponseEntity.ok(peliculas);
    }
    
    /**
     * Obtiene una película específica por su ID
     */
    @Operation(summary = "Obtener película por ID", 
               description = "Obtiene los detalles completos de una película")
    @ApiResponse(responseCode = "200", description = "Película encontrada")
    @ApiResponse(responseCode = "404", description = "Película no encontrada")
    @GetMapping("/{id}")
    public ResponseEntity<PeliculaDTO> obtenerPelicula(@PathVariable Long id) {
        PeliculaDTO pelicula = peliculaService.obtenerPeliculaPorId(id);
        return ResponseEntity.ok(pelicula);
    }
    
    /**
     * Crea una nueva película (solo administradores)
     */
    @Operation(summary = "Crear película", 
               description = "Crea una nueva película en el catálogo (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "201", description = "Película creada exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @ApiResponse(responseCode = "403", description = "Acceso denegado")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PeliculaDTO> crearPelicula(@Valid @RequestBody CrearPeliculaDTO crearPeliculaDTO) {
        PeliculaDTO pelicula = peliculaService.crearPelicula(crearPeliculaDTO);
        return new ResponseEntity<>(pelicula, HttpStatus.CREATED);
    }
    
    /**
     * Actualiza una película existente (solo administradores)
     */
    @Operation(summary = "Actualizar película", 
               description = "Actualiza los datos de una película existente (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Película actualizada exitosamente")
    @ApiResponse(responseCode = "404", description = "Película no encontrada")
    @ApiResponse(responseCode = "403", description = "Acceso denegado")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PeliculaDTO> actualizarPelicula(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarPeliculaDTO actualizarDTO) {
        
        PeliculaDTO pelicula = peliculaService.actualizarPelicula(id, actualizarDTO);
        return ResponseEntity.ok(pelicula);
    }
    
    /**
     * Elimina una película (marca como no disponible) - solo administradores
     */
    @Operation(summary = "Eliminar película", 
               description = "Marca una película como no disponible (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Película eliminada exitosamente")
    @ApiResponse(responseCode = "404", description = "Película no encontrada")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> eliminarPelicula(@PathVariable Long id) {
        peliculaService.eliminarPelicula(id);
        return ResponseEntity.ok(Map.of("mensaje", "Película eliminada exitosamente"));
    }
    
    /**
     * Busca películas por término general (título, director, actor)
     */
    @Operation(summary = "Buscar películas", 
               description = "Busca películas por título, director o actor")
    @GetMapping("/buscar")
    public ResponseEntity<Page<PeliculaDTO>> buscarPeliculas(
            @Parameter(description = "Término de búsqueda") @RequestParam String q,
            @PageableDefault(size = 12) Pageable pageable) {
        
        Page<PeliculaDTO> peliculas = peliculaService.buscarPeliculas(q, pageable);
        return ResponseEntity.ok(peliculas);
    }
    
    /**
     * Búsqueda avanzada con múltiples filtros
     */
    @Operation(summary = "Búsqueda avanzada", 
               description = "Busca películas con filtros múltiples")
    @GetMapping("/filtrar")
    public ResponseEntity<Page<PeliculaDTO>> filtrarPeliculas(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Genero genero,
            @RequestParam(required = false) Integer anioDesde,
            @RequestParam(required = false) Integer anioHasta,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax,
            @PageableDefault(size = 12) Pageable pageable) {
        
        FiltrosPeliculaDTO filtros = new FiltrosPeliculaDTO(q, genero, anioDesde, anioHasta, precioMin, precioMax);
        Page<PeliculaDTO> peliculas = peliculaService.buscarConFiltros(filtros, pageable);
        return ResponseEntity.ok(peliculas);
    }
    
    /**
     * Filtra películas por género
     */
    @Operation(summary = "Filtrar por género", 
               description = "Obtiene películas de un género específico")
    @GetMapping("/genero/{genero}")
    public ResponseEntity<Page<PeliculaDTO>> obtenerPeliculasPorGenero(
            @PathVariable Genero genero,
            @PageableDefault(size = 12) Pageable pageable) {
        
        Page<PeliculaDTO> peliculas = peliculaService.obtenerPeliculasPorGenero(genero, pageable);
        return ResponseEntity.ok(peliculas);
    }
    
    /**
     * Obtiene las películas más recientes
     */
    @Operation(summary = "Películas recientes", 
               description = "Obtiene las películas agregadas más recientemente")
    @GetMapping("/recientes")
    public ResponseEntity<List<PeliculaDTO>> obtenerPeliculasRecientes(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<PeliculaDTO> peliculas = peliculaService.obtenerPeliculasMasRecientes(limit);
        return ResponseEntity.ok(peliculas);
    }
    
    /**
     * Obtiene las películas más populares
     */
    @Operation(summary = "Películas populares", 
               description = "Obtiene las películas más populares")
    @GetMapping("/populares")
    public ResponseEntity<Page<PeliculaDTO>> obtenerPeliculasPopulares(
            @PageableDefault(size = 12) Pageable pageable) {
        
        Page<PeliculaDTO> peliculas = peliculaService.obtenerPeliculasMasPopulares(pageable);
        return ResponseEntity.ok(peliculas);
    }
    
    /**
     * Actualiza el stock de una película (solo administradores)
     */
    @Operation(summary = "Actualizar stock", 
               description = "Actualiza el stock de una película (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Stock actualizado exitosamente")
    @PutMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> actualizarStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> stockData) {
        
        Integer nuevoStock = stockData.get("stock");
        peliculaService.actualizarStock(id, nuevoStock);
        
        return ResponseEntity.ok(Map.of("mensaje", "Stock actualizado exitosamente"));
    }
    
    /**
     * Obtiene los géneros disponibles
     */
    @Operation(summary = "Géneros disponibles", 
               description = "Obtiene la lista de géneros que tienen películas disponibles")
    @GetMapping("/generos")
    public ResponseEntity<List<Genero>> obtenerGenerosDisponibles() {
        List<Genero> generos = peliculaService.obtenerGenerosDisponibles();
        return ResponseEntity.ok(generos);
    }
    
    /**
     * Obtiene los años disponibles
     */
    @Operation(summary = "Años disponibles", 
               description = "Obtiene la lista de años que tienen películas disponibles")
    @GetMapping("/anios")
    public ResponseEntity<List<Integer>> obtenerAniosDisponibles() {
        List<Integer> anios = peliculaService.obtenerAniosDisponibles();
        return ResponseEntity.ok(anios);
    }
    
    /**
     * Obtiene estadísticas del catálogo (solo administradores)
     */
    @Operation(summary = "Estadísticas del catálogo", 
               description = "Obtiene estadísticas generales del catálogo de películas (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/estadisticas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EstadisticasPeliculasDTO> obtenerEstadisticas() {
        EstadisticasPeliculasDTO estadisticas = peliculaService.obtenerEstadisticas();
        return ResponseEntity.ok(estadisticas);
    }
    
    /**
     * Obtiene películas con stock bajo (solo administradores)
     */
    @Operation(summary = "Películas con stock bajo", 
               description = "Obtiene películas que necesitan reposición (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/stock-bajo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PeliculaDTO>> obtenerPeliculasStockBajo(
            @RequestParam(defaultValue = "5") int stockMinimo) {
        
        List<PeliculaDTO> peliculas = peliculaService.obtenerPeliculasConStockBajo(stockMinimo);
        return ResponseEntity.ok(peliculas);
    }
}