package com.almacen.peliculas.pedidos.service;

import com.almacen.peliculas.pedidos.domain.Carrito;
import com.almacen.peliculas.pedidos.domain.ItemCarrito;
import com.almacen.peliculas.pedidos.domain.dto.CarritoDTO;
import com.almacen.peliculas.pedidos.domain.dto.ItemCarritoDTO;
import com.almacen.peliculas.peliculas.service.PeliculaMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

/**
 * Mapper para convertir entre entidades Carrito/ItemCarrito y sus DTOs.
 * 
 * @author Sistema de Almacén de Películas
 */
@Mapper(uses = {PeliculaMapper.class})
public interface CarritoMapper {

    CarritoMapper INSTANCE = Mappers.getMapper(CarritoMapper.class);

    /**
     * Convierte una entidad ItemCarrito a ItemCarritoDTO.
     * @param itemCarrito La entidad a convertir.
     * @return El DTO resultante.
     */
    ItemCarritoDTO toItemCarritoDTO(ItemCarrito itemCarrito);

    /**
     * Convierte una entidad Carrito a CarritoDTO.
     * @param carrito La entidad a convertir.
     * @return El DTO resultante.
     */
    @Mapping(source = "totalItems", target = "totalItems")
    CarritoDTO toCarritoDTO(Carrito carrito);
}
