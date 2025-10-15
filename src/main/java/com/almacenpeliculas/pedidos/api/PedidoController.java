package com.almacenpeliculas.pedidos.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para el módulo de Pedidos y Carrito.
 * 
 * Expone endpoints para:
 * - Gestionar items del carrito (agregar, modificar, eliminar)
 * - Ver contenido del carrito
 * - Procesar compra del carrito
 * - Consultar historial de pedidos
 */
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    
    // TODO: Inyectar PedidoService
    // TODO: Implementar endpoints:
    //       - GET /carrito
    //       - POST /carrito/items
    //       - DELETE /carrito/items/{id}
    //       - POST /checkout
    //       - GET /historial
}
