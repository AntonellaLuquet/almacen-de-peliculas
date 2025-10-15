package com.almacen.peliculas.usuarios.infra;

import com.almacen.peliculas.usuarios.domain.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la gestión de usuarios en la base de datos
 * 
 * Proporciona operaciones CRUD y consultas personalizadas para la entidad Usuario.
 * Incluye métodos para buscar por email, validar existencia y filtrar usuarios activos.
 * 
 * @author Sistema de Almacén de Películas
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    /**
     * Busca un usuario por su email (case-insensitive)
     * @param email el email del usuario
     * @return Optional con el usuario si existe
     */
    Optional<Usuario> findByEmailIgnoreCase(String email);
    
    /**
     * Verifica si existe un usuario con el email dado
     * @param email el email a verificar
     * @return true si existe un usuario con ese email
     */
    boolean existsByEmailIgnoreCase(String email);
    
    /**
     * Busca un usuario activo por email
     * @param email el email del usuario
     * @return Optional con el usuario si existe y está activo
     */
    @Query("SELECT u FROM Usuario u WHERE LOWER(u.email) = LOWER(:email) AND u.activo = true")
    Optional<Usuario> findByEmailAndActivo(@Param("email") String email);
    
    /**
     * Obtiene todos los usuarios activos con paginación
     * @param pageable información de paginación
     * @return página de usuarios activos
     */
    Page<Usuario> findByActivoTrue(Pageable pageable);
    
    /**
     * Busca usuarios por nombre o apellido (case-insensitive) que estén activos
     * @param searchTerm término de búsqueda
     * @param pageable información de paginación
     * @return página de usuarios que coinciden con la búsqueda
     */
    @Query("SELECT u FROM Usuario u WHERE u.activo = true AND " +
           "(LOWER(u.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.apellido) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Usuario> findByNombreOrApellidoContainingIgnoreCaseAndActivoTrue(
        @Param("searchTerm") String searchTerm, Pageable pageable);
    
    /**
     * Cuenta el número de usuarios activos
     * @return número de usuarios activos
     */
    long countByActivoTrue();
    
    /**
     * Cuenta el número de administradores activos
     * @return número de administradores activos
     */
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.activo = true AND u.rol = 'ADMIN'")
    long countAdministradoresActivos();
}