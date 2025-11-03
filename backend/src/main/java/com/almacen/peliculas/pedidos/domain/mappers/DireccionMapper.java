package com.almacen.peliculas.pedidos.domain.mappers;

import com.almacen.peliculas.pedidos.domain.Direccion;
import com.almacen.peliculas.pedidos.domain.dto.DireccionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DireccionMapper {

    Direccion toEntity(DireccionDTO dto);

    DireccionDTO toDto(Direccion entity);
}
