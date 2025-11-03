package com.almacen.peliculas.pedidos.service;

import com.almacen.peliculas.pedidos.domain.EstadoPedido;
import com.almacen.peliculas.pedidos.domain.ItemPedido;
import com.almacen.peliculas.pedidos.domain.Pedido;
import com.almacen.peliculas.pedidos.domain.dto.CheckoutDTO;
import com.almacen.peliculas.pedidos.domain.mappers.DatosEnvioMapper;
import com.almacen.peliculas.pedidos.infra.PedidoRepository;
import com.almacen.peliculas.peliculas.domain.Pelicula;
import com.almacen.peliculas.peliculas.infra.PeliculaRepository;
import com.almacen.peliculas.usuarios.domain.Usuario;
import com.almacen.peliculas.usuarios.service.UsuarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final PeliculaRepository peliculaRepository;
    private final UsuarioService usuarioService;
    private final DatosEnvioMapper datosEnvioMapper;

    public PedidoServiceImpl(PedidoRepository pedidoRepository, PeliculaRepository peliculaRepository, UsuarioService usuarioService, DatosEnvioMapper datosEnvioMapper) {
        this.pedidoRepository = pedidoRepository;
        this.peliculaRepository = peliculaRepository;
        this.usuarioService = usuarioService;
        this.datosEnvioMapper = datosEnvioMapper;
    }

    @Override
    @Transactional
    public Pedido crearPedidoDesdeCheckout(CheckoutDTO checkoutDTO, String metodoPago) {
        Usuario usuario = usuarioService.getUsuarioAutenticado();

        Pedido pedido = new Pedido(usuario);
        pedido.setMetodoPago(metodoPago);
        pedido.setEstado(EstadoPedido.PENDIENTE);

        datosEnvioMapper.updatePedidoFromDto(checkoutDTO.getDatosEnvio(), pedido);

        checkoutDTO.getItems().forEach(itemDTO -> {
            Pelicula pelicula = peliculaRepository.findById(itemDTO.getPelicula().getId())
                    .orElseThrow(() -> new RuntimeException("Película no encontrada"));
            
            ItemPedido itemPedido = new ItemPedido(pelicula, itemDTO.getCantidad());
            
            pedido.agregarItem(itemPedido);
        });

        pedido.recalcularTotales();

        return pedidoRepository.save(pedido);
    }
}
