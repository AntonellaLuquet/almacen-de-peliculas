package com.almacen.peliculas.pedidos.service;

import com.almacen.peliculas.pedidos.domain.Pedido;

import java.util.List;

public interface PedidoQueryService {

    List<Pedido> buscarPedidosPorUsuarioAutenticado();

    Pedido buscarPedidoPorId(Long id);
}
