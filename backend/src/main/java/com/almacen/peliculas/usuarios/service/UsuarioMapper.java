package com.almacen.peliculas.usuarios.service;

import com.almacen.peliculas.usuarios.domain.Usuario;
import com.almacen.peliculas.usuarios.domain.UsuarioDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioDTO toDTO(Usuario usuario);
}
