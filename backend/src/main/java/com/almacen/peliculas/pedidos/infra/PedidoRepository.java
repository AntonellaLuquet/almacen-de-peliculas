package com.almacen.peliculas.pedidos.infra;

import com.almacen.peliculas.pedidos.domain.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);

    Optional<Pedido> findByIdAndUsuarioId(Long id, Long usuarioId);
}
