package com.almacen.peliculas.pedidos.api;

import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import com.almacen.peliculas.pedidos.service.PedidoService;
import com.almacen.peliculas.pedidos.domain.EstadoPedido;
import org.springframework.security.access.prepost.PreAuthorize;
import com.almacen.peliculas.pedidos.domain.Pedido;
import com.almacen.peliculas.pedidos.service.PedidoQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedidos") // Corregido: Se elimina /api
public class PedidoController {

    private final PedidoQueryService pedidoQueryService;

    public PedidoController(PedidoQueryService pedidoQueryService) {
        this.pedidoQueryService = pedidoQueryService;
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<Pedido>> getMisPedidos() {
        return ResponseEntity.ok(pedidoQueryService.buscarPedidosPorUsuarioAutenticado());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoQueryService.buscarPedidoPorId(id));
    }

    // --- AÑADIR ESTE MÉTODO PARA PEDIDOS---
    /**
     * Endpoint para que un administrador obtenga todos los pedidos del sistema.
     * Protegido para que solo usuarios con rol 'ADMIN' puedan acceder.
     */
    @GetMapping("/admin/todos")///agrege esto para obtener los pedidos por admin
    @PreAuthorize("hasRole('ADMIN')") // <-- ¡MUY IMPORTANTE! Protege el endpoint
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        return ResponseEntity.ok(pedidoQueryService.buscarTodosLosPedidos());
    }


    //-----recien modificado para ver detalle pedido
    /**
     * CORRECCIÓN: Endpoint para que un admin vea el detalle de CUALQUIER pedido.
     * La ruta ahora es única y descriptiva.
     */
    @GetMapping("/admin/{id}") // <-- RUTA CORREGIDA Y ÚNICA
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Pedido> getPedidoPorIdParaAdmin(@PathVariable Long id) {
        // Este método no tiene restricciones de usuario
        return ResponseEntity.ok(pedidoQueryService.buscarPedidoPorIdParaAdmin(id));
    }

}
