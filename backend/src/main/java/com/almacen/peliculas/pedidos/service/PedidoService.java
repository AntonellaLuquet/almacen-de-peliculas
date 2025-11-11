package com.almacen.peliculas.pedidos.service;

import com.almacen.peliculas.pedidos.domain.Pedido;
import com.almacen.peliculas.pedidos.domain.dto.CheckoutDTO;

public interface PedidoService {

    Pedido crearPedidoDesdeCheckout(CheckoutDTO checkoutDTO, String metodoPago);

}
