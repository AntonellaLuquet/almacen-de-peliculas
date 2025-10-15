package com.almacenpeliculas.usuarios.infra;

import com.almacenpeliculas.usuarios.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio JPA para la entidad Usuario.
 * 
 * Proporciona operaciones CRUD y consultas personalizadas.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
