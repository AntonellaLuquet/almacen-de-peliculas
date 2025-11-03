package com.almacen.peliculas.pedidos.api;

import com.almacen.peliculas.pedidos.domain.Pedido;
import com.almacen.peliculas.pedidos.service.PedidoQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
