package com.almacen.peliculas.pedidos.domain.mappers;

import com.almacen.peliculas.pedidos.domain.Pedido;
import com.almacen.peliculas.pedidos.domain.dto.DatosEnvioDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {DireccionMapper.class})
public interface DatosEnvioMapper {

    @Mapping(target = "direccionEnvio", source = "direccion")
    void updatePedidoFromDto(DatosEnvioDTO dto, @MappingTarget Pedido pedido);
}
