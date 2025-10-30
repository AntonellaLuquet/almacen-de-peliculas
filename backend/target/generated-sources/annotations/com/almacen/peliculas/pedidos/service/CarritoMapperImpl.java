package com.almacen.peliculas.pedidos.service;

import com.almacen.peliculas.pedidos.domain.Carrito;
import com.almacen.peliculas.pedidos.domain.ItemCarrito;
import com.almacen.peliculas.pedidos.domain.dto.CarritoDTO;
import com.almacen.peliculas.pedidos.domain.dto.ItemCarritoDTO;
import com.almacen.peliculas.peliculas.service.PeliculaMapper;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.mapstruct.factory.Mappers;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-30T16:25:51-0300",
    comments = "version: 1.6.0, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
public class CarritoMapperImpl implements CarritoMapper {

    private final PeliculaMapper peliculaMapper = Mappers.getMapper( PeliculaMapper.class );

    @Override
    public ItemCarritoDTO toItemCarritoDTO(ItemCarrito itemCarrito) {
        if ( itemCarrito == null ) {
            return null;
        }

        ItemCarritoDTO itemCarritoDTO = new ItemCarritoDTO();

        if ( itemCarrito.getCantidad() != null ) {
            itemCarritoDTO.setCantidad( itemCarrito.getCantidad() );
        }
        itemCarritoDTO.setId( itemCarrito.getId() );
        itemCarritoDTO.setPelicula( peliculaMapper.toDTO( itemCarrito.getPelicula() ) );
        itemCarritoDTO.setPrecioUnitario( itemCarrito.getPrecioUnitario() );
        itemCarritoDTO.setSubtotal( itemCarrito.getSubtotal() );

        return itemCarritoDTO;
    }

    @Override
    public CarritoDTO toCarritoDTO(Carrito carrito) {
        if ( carrito == null ) {
            return null;
        }

        CarritoDTO carritoDTO = new CarritoDTO();

        if ( carrito.getTotalItems() != null ) {
            carritoDTO.setTotalItems( carrito.getTotalItems() );
        }
        carritoDTO.setId( carrito.getId() );
        carritoDTO.setImpuestos( carrito.getImpuestos() );
        carritoDTO.setItems( itemCarritoListToItemCarritoDTOList( carrito.getItems() ) );
        carritoDTO.setSubtotal( carrito.getSubtotal() );
        carritoDTO.setTotal( carrito.getTotal() );

        return carritoDTO;
    }

    protected List<ItemCarritoDTO> itemCarritoListToItemCarritoDTOList(List<ItemCarrito> list) {
        if ( list == null ) {
            return null;
        }

        List<ItemCarritoDTO> list1 = new ArrayList<ItemCarritoDTO>( list.size() );
        for ( ItemCarrito itemCarrito : list ) {
            list1.add( toItemCarritoDTO( itemCarrito ) );
        }

        return list1;
    }
}
