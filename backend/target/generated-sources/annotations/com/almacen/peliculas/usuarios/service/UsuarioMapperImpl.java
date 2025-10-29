package com.almacen.peliculas.usuarios.service;

import com.almacen.peliculas.usuarios.domain.Usuario;
import com.almacen.peliculas.usuarios.domain.UsuarioDTO;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-29T16:02:18-0300",
    comments = "version: 1.6.0, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class UsuarioMapperImpl implements UsuarioMapper {

    @Override
    public UsuarioDTO toDTO(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }

        UsuarioDTO usuarioDTO = new UsuarioDTO();

        usuarioDTO.setId( usuario.getId() );
        usuarioDTO.setEmail( usuario.getEmail() );
        usuarioDTO.setNombre( usuario.getNombre() );
        usuarioDTO.setApellido( usuario.getApellido() );
        usuarioDTO.setRol( usuario.getRol() );
        usuarioDTO.setActivo( usuario.getActivo() );
        usuarioDTO.setTelefono( usuario.getTelefono() );
        usuarioDTO.setDireccion( usuario.getDireccion() );
        usuarioDTO.setFechaCreacion( usuario.getFechaCreacion() );
        usuarioDTO.setFechaActualizacion( usuario.getFechaActualizacion() );

        return usuarioDTO;
    }

    @Override
    public Usuario toEntity(UsuarioDTO usuarioDTO) {
        if ( usuarioDTO == null ) {
            return null;
        }

        Usuario usuario = new Usuario();

        usuario.setId( usuarioDTO.getId() );
        usuario.setEmail( usuarioDTO.getEmail() );
        usuario.setNombre( usuarioDTO.getNombre() );
        usuario.setApellido( usuarioDTO.getApellido() );
        usuario.setRol( usuarioDTO.getRol() );
        usuario.setActivo( usuarioDTO.getActivo() );
        usuario.setTelefono( usuarioDTO.getTelefono() );
        usuario.setDireccion( usuarioDTO.getDireccion() );
        usuario.setFechaCreacion( usuarioDTO.getFechaCreacion() );
        usuario.setFechaActualizacion( usuarioDTO.getFechaActualizacion() );

        return usuario;
    }
}
