package com.almacenpeliculas.usuarios.infra;

import com.almacenpeliculas.usuarios.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio JPA para la entidad Usuario.
 * 
 * Proporciona operaciones CRUD básicas y consultas personalizadas
 * para autenticación y gestión de usuarios.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // TODO: Agregar métodos de consulta:
    //       - findByEmail()
    //       - existsByEmail()
    Optional<Usuario> findByEmail(String email);
}
