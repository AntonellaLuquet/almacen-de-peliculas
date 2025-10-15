package com.almacen.peliculas.usuarios.service;

import com.almacen.peliculas.usuarios.domain.Usuario;
import com.almacen.peliculas.usuarios.domain.UsuarioDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidades Usuario y DTOs
 * 
 * Utiliza MapStruct para generar automáticamente las implementaciones
 * de conversión entre objetos de dominio y DTOs.
 * 
 * @author Sistema de Almacén de Películas
 */
@Mapper(componentModel = "spring")
@Component
public interface UsuarioMapper {
    
    /**
     * Convierte una entidad Usuario a UsuarioDTO
     * Excluye el password por seguridad
     * @param usuario entidad Usuario
     * @return DTO del usuario
     */
    @Mapping(target = "password", ignore = true)
    UsuarioDTO toDTO(Usuario usuario);
    
    /**
     * Convierte un UsuarioDTO a entidad Usuario
     * @param usuarioDTO DTO del usuario
     * @return entidad Usuario
     */
    Usuario toEntity(UsuarioDTO usuarioDTO);
}