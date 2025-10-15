package com.almacenpeliculas.pedidos.infra;

import com.almacenpeliculas.pedidos.domain.Pedido;
import com.almacenpeliculas.usuarios.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad Pedido.
 * 
 * Proporciona operaciones CRUD y consultas personalizadas.
 */
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    List<Pedido> findByUsuarioOrderByFechaPedidoDesc(Usuario usuario);
    
    List<Pedido> findByEstado(Pedido.EstadoPedido estado);
}
