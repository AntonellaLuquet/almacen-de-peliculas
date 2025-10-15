package com.almacenpeliculas.pedidos.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para gestión de pedidos y carrito.
 * 
 * Endpoints:
 * - GET /api/pedidos/carrito - Obtener carrito del usuario actual
 * - POST /api/pedidos/carrito/items - Agregar película al carrito
 * - PUT /api/pedidos/carrito/items/{id} - Actualizar cantidad en el carrito
 * - DELETE /api/pedidos/carrito/items/{id} - Eliminar película del carrito
 * - POST /api/pedidos/confirmar - Procesar compra y crear pedido
 * - GET /api/pedidos - Listar pedidos del usuario
 * - GET /api/pedidos/{id} - Obtener detalle de un pedido
 */
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    // TODO: Implementar endpoints de pedidos y carrito
}
