package com.almacen.peliculas.pedidos.service;

import com.almacen.peliculas.common.exceptions.ResourceNotFoundException;
import com.almacen.peliculas.pedidos.domain.Pedido;
import com.almacen.peliculas.pedidos.infra.PedidoRepository;
import com.almacen.peliculas.usuarios.domain.Usuario;
import com.almacen.peliculas.usuarios.service.UsuarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class PedidoQueryServiceImpl implements PedidoQueryService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioService usuarioService;

    public PedidoQueryServiceImpl(PedidoRepository pedidoRepository, UsuarioService usuarioService) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioService = usuarioService;
    }

    @Override
    public List<Pedido> buscarPedidosPorUsuarioAutenticado() {
        Usuario usuario = usuarioService.getUsuarioAutenticado();
        return pedidoRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuario.getId());
    }

    @Override
    public Pedido buscarPedidoPorId(Long id) {
        Usuario usuario = usuarioService.getUsuarioAutenticado();
        return pedidoRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado o no pertenece al usuario"));
    }
}
