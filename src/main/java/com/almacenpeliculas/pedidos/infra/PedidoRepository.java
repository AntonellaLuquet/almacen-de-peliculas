package com.almacenpeliculas.pedidos.infra;

import com.almacenpeliculas.pedidos.domain.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad Pedido.
 * 
 * Proporciona operaciones CRUD básicas y consultas personalizadas
 * para gestión de pedidos y carritos.
 */
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    // TODO: Agregar métodos de consulta:
    //       - findByUsuarioId()
    //       - findByEstado()
    //       - findByUsuarioIdAndEstado()
    List<Pedido> findByUsuarioId(Long usuarioId);
}
