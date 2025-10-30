package com.almacen.peliculas.pedidos.api;

import com.almacen.peliculas.pedidos.domain.AgregarItemCarritoDTO;
import com.almacen.peliculas.pedidos.domain.dto.CarritoDTO;
import com.almacen.peliculas.pedidos.service.CarritoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @GetMapping
    public ResponseEntity<CarritoDTO> getCarrito() {
        return ResponseEntity.ok(carritoService.getCarrito());
    }

    @PostMapping("/items")
    public ResponseEntity<CarritoDTO> agregarItem(@Valid @RequestBody AgregarItemCarritoDTO itemDTO) {
        return ResponseEntity.ok(carritoService.agregarItem(itemDTO));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CarritoDTO> actualizarItem(@PathVariable Long itemId, @RequestBody Map<String, Integer> payload) {
        Integer cantidad = payload.get("cantidad");
        return ResponseEntity.ok(carritoService.actualizarItem(itemId, cantidad));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CarritoDTO> eliminarItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(carritoService.eliminarItem(itemId));
    }

    @DeleteMapping
    public ResponseEntity<CarritoDTO> limpiarCarrito() {
        return ResponseEntity.ok(carritoService.limpiarCarrito());
    }
}
