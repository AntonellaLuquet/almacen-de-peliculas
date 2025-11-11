package com.almacen.peliculas.pedidos.api;

import com.almacen.peliculas.pedidos.domain.AgregarItemCarritoDTO;
import com.almacen.peliculas.pedidos.domain.Pedido;
import com.almacen.peliculas.pedidos.domain.dto.CarritoDTO;
import com.almacen.peliculas.pedidos.domain.dto.CheckoutDTO;
import com.almacen.peliculas.pedidos.service.CarritoService;
import com.almacen.peliculas.pedidos.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/carrito") // Corregido: Se elimina /api
public class CarritoController {

    private final CarritoService carritoService;
    private final PedidoService pedidoService;

    public CarritoController(CarritoService carritoService, PedidoService pedidoService) {
        this.carritoService = carritoService;
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<CarritoDTO> getCarrito() {
        return ResponseEntity.ok(carritoService.getCarrito());
    }

    @PostMapping("/agregar")
    public ResponseEntity<CarritoDTO> agregarItem(@Valid @RequestBody AgregarItemCarritoDTO itemDTO) {
        return ResponseEntity.ok(carritoService.agregarItem(itemDTO));
    }

    @PutMapping("/actualizar/{itemId}")
    public ResponseEntity<CarritoDTO> actualizarItem(@PathVariable Long itemId, @RequestBody Map<String, Integer> payload) {
        Integer cantidad = payload.get("cantidad");
        return ResponseEntity.ok(carritoService.actualizarItem(itemId, cantidad));
    }

    @DeleteMapping("/eliminar/{itemId}")
    public ResponseEntity<CarritoDTO> eliminarItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(carritoService.eliminarItem(itemId));
    }

    @PostMapping("/vaciar")
    public ResponseEntity<CarritoDTO> limpiarCarrito() {
        return ResponseEntity.ok(carritoService.limpiarCarrito());
    }

    @PostMapping("/checkout")
    public ResponseEntity<Pedido> checkout(@RequestBody CheckoutDTO checkoutDTO) {
        Pedido pedidoCreado = pedidoService.crearPedidoDesdeCheckout(checkoutDTO, checkoutDTO.getMetodoPago());
        carritoService.limpiarCarrito();
        return ResponseEntity.ok(pedidoCreado);
    }
}
