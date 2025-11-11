package com.almacen.peliculas.pedidos.service;

import com.almacen.peliculas.peliculas.common.exceptions.PeliculaNotFoundException;
import com.almacen.peliculas.pedidos.common.exceptions.CarritoNotFoundException;
import com.almacen.peliculas.pedidos.common.exceptions.ItemCarritoNotFoundException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.almacen.peliculas.pedidos.domain.AgregarItemCarritoDTO;
import com.almacen.peliculas.pedidos.domain.Carrito;
import com.almacen.peliculas.pedidos.domain.ItemCarrito;
import com.almacen.peliculas.pedidos.domain.dto.CarritoDTO;
import com.almacen.peliculas.pedidos.infra.CarritoRepository;
import com.almacen.peliculas.peliculas.domain.Pelicula;
import com.almacen.peliculas.peliculas.infra.PeliculaRepository;
import com.almacen.peliculas.usuarios.domain.Usuario;
import com.almacen.peliculas.usuarios.infra.UsuarioRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final PeliculaRepository peliculaRepository;
    private final UsuarioRepository usuarioRepository;
    private final CarritoMapper carritoMapper;

    public CarritoService(CarritoRepository carritoRepository, PeliculaRepository peliculaRepository,
            UsuarioRepository usuarioRepository, CarritoMapper carritoMapper) {
        this.carritoRepository = carritoRepository;
        this.peliculaRepository = peliculaRepository;
        this.usuarioRepository = usuarioRepository;
        this.carritoMapper = carritoMapper;
    }

    /**
     * Obtiene el carrito del usuario actual, o crea uno si no existe.
     * 
     * @return El DTO del carrito del usuario.
     */
    public CarritoDTO getCarrito() {
        Usuario usuario = getCurrentUser();
        Carrito carrito = getOrCreateCarrito(usuario);
        return carritoMapper.toCarritoDTO(carrito);
    }

    /**
     * Agrega un item al carrito del usuario actual.
     * 
     * @param itemDTO DTO con la información del item a agregar.
     * @return El DTO del carrito actualizado.
     */
    public CarritoDTO agregarItem(AgregarItemCarritoDTO itemDTO) {
        Usuario usuario = getCurrentUser();
        Carrito carrito = getOrCreateCarrito(usuario);
        Pelicula pelicula = peliculaRepository.findById(itemDTO.getPeliculaId())
                .orElseThrow(() -> new PeliculaNotFoundException("No se encontró una pelicula con id: " + itemDTO.getPeliculaId()));

        ItemCarrito nuevoItem = new ItemCarrito(pelicula, itemDTO.getCantidad());
        carrito.agregarItem(nuevoItem);

        carritoRepository.save(carrito);
        return carritoMapper.toCarritoDTO(carrito);
    }

    /**
     * Actualiza la cantidad de un item en el carrito.
     * 
     * @param itemId   ID del item a actualizar.
     * @param cantidad Nueva cantidad.
     * @return El DTO del carrito actualizado.
     */
    public CarritoDTO actualizarItem(Long itemId, Integer cantidad) {
        Usuario usuario = getCurrentUser();
        Carrito carrito = getCarritoByUsuario(usuario);
        ItemCarrito item = findItemInCarrito(carrito, itemId);

        if (cantidad <= 0) {
            carrito.removerItem(item);
        } else {
            item.setCantidad(cantidad);
            carrito.recalcularTotales();
        }

        carritoRepository.save(carrito);
        return carritoMapper.toCarritoDTO(carrito);
    }

    /**
     * Elimina un item del carrito.
     * 
     * @param itemId ID del item a eliminar.
     * @return El DTO del carrito actualizado.
     */
    public CarritoDTO eliminarItem(Long itemId) {
        Usuario usuario = getCurrentUser();
        Carrito carrito = getCarritoByUsuario(usuario);
        ItemCarrito item = findItemInCarrito(carrito, itemId);

        carrito.removerItem(item);

        carritoRepository.save(carrito);
        return carritoMapper.toCarritoDTO(carrito);
    }

    /**
     * Vacía el carrito del usuario actual.
     * 
     * @return El DTO del carrito vacío.
     */
    public CarritoDTO limpiarCarrito() {
        Usuario usuario = getCurrentUser();
        Carrito carrito = getCarritoByUsuario(usuario);

        carrito.limpiar();

        carritoRepository.save(carrito);
        return carritoMapper.toCarritoDTO(carrito);
    }

    private Carrito getOrCreateCarrito(Usuario usuario) {
        return carritoRepository.findByUsuario(usuario)
                .orElseGet(() -> {
                    Carrito nuevoCarrito = new Carrito(usuario);
                    return carritoRepository.save(nuevoCarrito);
                });
    }

    private Carrito getCarritoByUsuario(Usuario usuario) {
        return carritoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new CarritoNotFoundException("No se encontró un carrito para el usuario con id: " + usuario.getId()));
    }

    private ItemCarrito findItemInCarrito(Carrito carrito, Long itemId) {
        return carrito.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ItemCarritoNotFoundException("No se encontró un item en el carrito con id: " + itemId));
    }

    private Usuario getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmailAndActivo(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }
}
