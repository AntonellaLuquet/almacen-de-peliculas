package com.almacen.peliculas.pedidos.service;

import com.almacen.peliculas.common.service.EmailService;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoServiceImpl implements PedidoService {

    private static final Logger logger = LoggerFactory.getLogger(PedidoServiceImpl.class);

    private final PedidoRepository pedidoRepository;
    private final PeliculaRepository peliculaRepository;
    private final UsuarioService usuarioService;
    private final DatosEnvioMapper datosEnvioMapper;
    private final EmailService emailService;

    public PedidoServiceImpl(PedidoRepository pedidoRepository, PeliculaRepository peliculaRepository, UsuarioService usuarioService, DatosEnvioMapper datosEnvioMapper, EmailService emailService) {
        this.pedidoRepository = pedidoRepository;
        this.peliculaRepository = peliculaRepository;
        this.usuarioService = usuarioService;
        this.datosEnvioMapper = datosEnvioMapper;
        this.emailService = emailService;
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

        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Enviar email de confirmación
        try {
            emailService.enviarEmailConfirmacionPedido(pedidoGuardado);
        } catch (Exception e) {
            // No relanzar la excepción para no afectar la transacción principal
            logger.error("Error al intentar enviar el email de confirmación para el pedido ID: {}. La compra fue exitosa igualmente.", pedidoGuardado.getId(), e);
        }

        return pedidoGuardado;
    }

}
