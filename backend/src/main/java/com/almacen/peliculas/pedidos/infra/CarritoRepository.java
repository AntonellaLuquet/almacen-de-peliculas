package com.almacen.peliculas.pedidos.infra;

import com.almacen.peliculas.pedidos.domain.Carrito;
import com.almacen.peliculas.usuarios.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad Carrito
 * Proporciona métodos para acceder a los datos de carritos en la base de datos.
 * 
 * @author Sistema de Almacén de Películas
 */
@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {

    /**
     * Busca un carrito por la entidad de usuario.
     * @param usuario El usuario dueño del carrito.
     * @return Un Optional que contiene el carrito si se encuentra.
     */
    Optional<Carrito> findByUsuario(Usuario usuario);

    /**
     * Busca un carrito por el ID del usuario.
     * @param usuarioId El ID del usuario dueño del carrito.
     * @return Un Optional que contiene el carrito si se encuentra.
     */
    Optional<Carrito> findByUsuarioId(Long usuarioId);
}
