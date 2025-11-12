package com.almacen.peliculas.peliculas.infra;

import com.almacen.peliculas.peliculas.domain.Pelicula;
import com.almacen.peliculas.peliculas.domain.Genero;
import com.almacen.peliculas.peliculas.domain.ClasificacionEdad;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la gestión de películas en la base de datos
 * 
 * Proporciona operaciones CRUD y consultas personalizadas para la entidad
 * Película.
 * Incluye métodos para búsqueda, filtrado por múltiples criterios y gestión de
 * stock.
 * 
 * @author Sistema de Almacén de Películas
 */
@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {

    /**
     * Busca películas por título (case-insensitive)
     * 
     * @param titulo título de la película
     * @return lista de películas que coinciden
     */
    List<Pelicula> findByTituloContainingIgnoreCase(String titulo);

    /**
     * Busca películas disponibles por título con paginación
     * 
     * @param titulo   término de búsqueda en el título
     * @param pageable información de paginación
     * @return página de películas disponibles
     */
    Page<Pelicula> findByTituloContainingIgnoreCaseAndDisponibleTrue(String titulo, Pageable pageable);

    /**
     * Busca películas por director (case-insensitive)
     * 
     * @param director nombre del director
     * @param pageable información de paginación
     * @return página de películas del director
     */
    Page<Pelicula> findByDirectorContainingIgnoreCaseAndDisponibleTrue(String director, Pageable pageable);

    /**
     * Filtra películas por género
     * 
     * @param genero   género de la película
     * @param pageable información de paginación
     * @return página de películas del género especificado
     */
    Page<Pelicula> findByGeneroAndDisponibleTrue(Genero genero, Pageable pageable);

    /**
     * Filtra películas por año
     * 
     * @param anio     año de la película
     * @param pageable información de paginación
     * @return página de películas del año especificado
     */
    Page<Pelicula> findByAnioAndDisponibleTrue(Integer anio, Pageable pageable);

    /**
     * Filtra películas por rango de años
     * 
     * @param anioDesde año inicial
     * @param anioHasta año final
     * @param pageable  información de paginación
     * @return página de películas en el rango de años
     */
    Page<Pelicula> findByAnioBetweenAndDisponibleTrue(Integer anioDesde, Integer anioHasta, Pageable pageable);

    /**
     * Filtra películas por rango de precios
     * 
     * @param precioMin precio mínimo
     * @param precioMax precio máximo
     * @param pageable  información de paginación
     * @return página de películas en el rango de precios
     */
    Page<Pelicula> findByPrecioBetweenAndDisponibleTrue(BigDecimal precioMin, BigDecimal precioMax, Pageable pageable);

    /**
     * Obtiene todas las películas disponibles
     * 
     * @param pageable información de paginación
     * @return página de películas disponibles
     */
    Page<Pelicula> findByDisponibleTrue(Pageable pageable);

    /**
     * Obtiene películas con stock disponible
     * 
     * @param pageable información de paginación
     * @return página de películas con stock
     */
    @Query("SELECT p FROM Pelicula p WHERE p.disponible = true AND p.stock > 0")
    Page<Pelicula> findPeliculasConStock(Pageable pageable);

    /**
     * Búsqueda compleja por múltiples criterios
     * 
     * @param searchTerm término de búsqueda (título, director, actor)
     * @param pageable   información de paginación
     * @return página de películas que coinciden
     */
    @Query("SELECT DISTINCT p FROM Pelicula p LEFT JOIN p.actores a " +
            "WHERE p.disponible = true AND " +
            "(LOWER(p.titulo) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(p.director) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(a) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Pelicula> buscarPeliculas(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Búsqueda avanzada con filtros múltiples
     * 
     * @param searchTerm término de búsqueda general
     * @param genero     género específico (opcional)
     * @param anioDesde  año desde (opcional)
     * @param anioHasta  año hasta (opcional)
     * @param precioMin  precio mínimo (opcional)
     * @param precioMax  precio máximo (opcional)
     * @param pageable   información de paginación
     * @return página de películas filtradas
     */
    @Query("SELECT DISTINCT p FROM Pelicula p " +
            "WHERE p.disponible = true " +
            "AND (:searchTerm IS NULL OR " +
            "     LOWER(p.titulo) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "     LOWER(p.director) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "     EXISTS (SELECT a FROM p.actores a WHERE LOWER(a) LIKE LOWER(CONCAT('%', :searchTerm, '%')))) " +
            "AND (:genero IS NULL OR p.genero = :genero) " +
            "AND (:anioDesde IS NULL OR p.anio >= :anioDesde) " +
            "AND (:anioHasta IS NULL OR p.anio <= :anioHasta) " +
            "AND (:precioMin IS NULL OR p.precio >= :precioMin) " +
            "AND (:precioMax IS NULL OR p.precio <= :precioMax)")
    Page<Pelicula> buscarConFiltros(
            @Param("searchTerm") String searchTerm,
            @Param("genero") Genero genero,
            @Param("anioDesde") Integer anioDesde,
            @Param("anioHasta") Integer anioHasta,
            @Param("precioMin") BigDecimal precioMin,
            @Param("precioMax") BigDecimal precioMax,
            Pageable pageable);

    /**
     * Obtiene películas más recientes
     * 
     * @param limit número máximo de películas
     * @return lista de películas más recientes
     */
    @Query("SELECT p FROM Pelicula p WHERE p.disponible = true ORDER BY p.fechaCreacion DESC LIMIT :limit")
    List<Pelicula> findPeliculasMasRecientes(@Param("limit") int limit);

    /**
     * Obtiene películas más populares (por ventas - implementar cuando tengamos
     * pedidos)
     * Por ahora ordena por stock (más stock = más popular)
     * 
     * @param pageable información de paginación
     * @return página de películas ordenadas por popularidad
     */
    @Query("SELECT p FROM Pelicula p WHERE p.disponible = true ORDER BY p.stock DESC")
    Page<Pelicula> findPeliculasMasPopulares(Pageable pageable);

    /**
     * Cuenta películas disponibles por género
     * 
     * @param genero género a contar
     * @return número de películas del género
     */
    long countByGeneroAndDisponibleTrue(Genero genero);

    /**
     * Cuenta películas disponibles totales
     * 
     * @return número total de películas disponibles
     */
    long countByDisponibleTrue();

    /**
     * Obtiene los géneros disponibles con películas
     * 
     * @return lista de géneros que tienen al menos una película disponible
     */
    @Query("SELECT DISTINCT p.genero FROM Pelicula p WHERE p.disponible = true ORDER BY p.genero")
    List<Genero> findGenerosDisponibles();

    /**
     * Obtiene los años disponibles con películas
     * 
     * @return lista de años que tienen al menos una película disponible
     */
    @Query("SELECT DISTINCT p.anio FROM Pelicula p WHERE p.disponible = true ORDER BY p.anio DESC")
    List<Integer> findAniosDisponibles();

    /**
     * Verifica si existe una película con el mismo título y director
     * 
     * @param titulo   título de la película
     * @param director director de la película
     * @return true si existe una película similar
     */
    boolean existsByTituloIgnoreCaseAndDirectorIgnoreCase(String titulo, String director);

    /**
     * Busca películas que necesitan restock (stock bajo)
     * 
     * @param stockMinimo stock mínimo considerado como bajo
     * @return lista de películas con stock bajo
     */
    @Query("SELECT p FROM Pelicula p WHERE p.disponible = true AND p.stock <= :stockMinimo ORDER BY p.stock ASC")
    List<Pelicula> findPeliculasConStockBajo(@Param("stockMinimo") int stockMinimo);
}