package com.almacen.peliculas.usuarios.service;

import com.almacen.peliculas.usuarios.domain.*;
import com.almacen.peliculas.usuarios.infra.UsuarioRepository;
import com.almacen.peliculas.common.exceptions.ResourceNotFoundException;
import com.almacen.peliculas.common.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para la gestión de usuarios del sistema
 * 
 * Proporciona operaciones de negocio para:
 * - Registro de nuevos usuarios
 * - Autenticación y autorización
 * - Gestión de perfiles de usuario
 * - Consultas y búsquedas de usuarios
 * 
 * Implementa UserDetailsService para integración con Spring Security.
 * 
 * @author Sistema de Almacén de Películas
 */
@Service
@Transactional
public class UsuarioService implements UserDetailsService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;
    
    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, 
                         PasswordEncoder passwordEncoder,
                         UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.usuarioMapper = usuarioMapper;
    }
    
    /**
     * Carga un usuario por su email para Spring Security
     * @param email el email del usuario
     * @return UserDetails del usuario
     * @throws UsernameNotFoundException si el usuario no existe o no está activo
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmailAndActivo(email)
            .orElseThrow(() -> new UsernameNotFoundException(
                "Usuario no encontrado con email: " + email));
    }
    
    /**
     * Registra un nuevo usuario en el sistema
     * @param registroDTO datos del usuario a registrar
     * @return DTO con los datos del usuario registrado
     * @throws BadRequestException si el email ya existe
     */
    public UsuarioDTO registrarUsuario(RegistroUsuarioDTO registroDTO) {
        // Validar que el email no exista
        if (usuarioRepository.existsByEmailIgnoreCase(registroDTO.getEmail())) {
            throw new BadRequestException("Ya existe un usuario con el email: " + registroDTO.getEmail());
        }
        
        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setEmail(registroDTO.getEmail().toLowerCase().trim());
        usuario.setNombre(registroDTO.getNombre().trim());
        usuario.setApellido(registroDTO.getApellido().trim());
        usuario.setPassword(passwordEncoder.encode(registroDTO.getPassword()));
        usuario.setTelefono(registroDTO.getTelefono());
        usuario.setDireccion(registroDTO.getDireccion());
        usuario.setRol(Rol.CLIENTE); // Por defecto es cliente
        usuario.setActivo(true);
        
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(usuarioGuardado);
    }
    
    /**
     * Busca un usuario por su ID
     * @param id identificador del usuario
     * @return DTO con los datos del usuario
     * @throws ResourceNotFoundException si el usuario no existe
     */
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return usuarioMapper.toDTO(usuario);
    }
    
    /**
     * Busca un usuario por su email
     * @param email email del usuario
     * @return DTO con los datos del usuario
     * @throws ResourceNotFoundException si el usuario no existe
     */
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerUsuarioPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
        return usuarioMapper.toDTO(usuario);
    }
    
    /**
     * Actualiza el perfil de un usuario
     * @param id identificador del usuario
     * @param perfilDTO datos actualizados del perfil
     * @return DTO con los datos actualizados
     * @throws ResourceNotFoundException si el usuario no existe
     */
    public UsuarioDTO actualizarPerfil(Long id, ActualizarPerfilDTO perfilDTO) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        
        // Actualizar solo los campos proporcionados
        if (perfilDTO.getNombre() != null && !perfilDTO.getNombre().trim().isEmpty()) {
            usuario.setNombre(perfilDTO.getNombre().trim());
        }
        if (perfilDTO.getApellido() != null && !perfilDTO.getApellido().trim().isEmpty()) {
            usuario.setApellido(perfilDTO.getApellido().trim());
        }
        if (perfilDTO.getTelefono() != null) {
            usuario.setTelefono(perfilDTO.getTelefono().trim());
        }
        if (perfilDTO.getDireccion() != null) {
            usuario.setDireccion(perfilDTO.getDireccion().trim());
        }
        
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(usuarioActualizado);
    }
    
    /**
     * Cambia el password de un usuario
     * @param id identificador del usuario
     * @param passwordActual password actual para verificación
     * @param passwordNuevo nuevo password
     * @throws ResourceNotFoundException si el usuario no existe
     * @throws BadRequestException si el password actual no es correcto
     */
    public void cambiarPassword(Long id, String passwordActual, String passwordNuevo) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        
        // Verificar password actual
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new BadRequestException("El password actual no es correcto");
        }
        
        // Actualizar password
        usuario.setPassword(passwordEncoder.encode(passwordNuevo));
        usuarioRepository.save(usuario);
    }
    
    /**
     * Desactiva un usuario (soft delete)
     * @param id identificador del usuario
     * @throws ResourceNotFoundException si el usuario no existe
     * @throws BadRequestException si se intenta desactivar el último admin
     */
    public void desactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        
        // Verificar que no sea el último administrador
        if (usuario.esAdmin() && usuarioRepository.countAdministradoresActivos() <= 1) {
            throw new BadRequestException("No se puede desactivar el último administrador del sistema");
        }
        
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Reactiva un usuario
     * @param id identificador del usuario
     * @throws ResourceNotFoundException si el usuario no existe
     */
    public void reactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Obtiene todos los usuarios activos con paginación
     * @param pageable información de paginación
     * @return página de usuarios
     */
    @Transactional(readOnly = true)
    public Page<UsuarioDTO> obtenerUsuarios(Pageable pageable) {
        Page<Usuario> usuarios = usuarioRepository.findByActivoTrue(pageable);
        return usuarios.map(usuarioMapper::toDTO);
    }
    
    /**
     * Busca usuarios por nombre o apellido
     * @param searchTerm término de búsqueda
     * @param pageable información de paginación
     * @return página de usuarios que coinciden con la búsqueda
     */
    @Transactional(readOnly = true)
    public Page<UsuarioDTO> buscarUsuarios(String searchTerm, Pageable pageable) {
        Page<Usuario> usuarios = usuarioRepository
            .findByNombreOrApellidoContainingIgnoreCaseAndActivoTrue(searchTerm, pageable);
        return usuarios.map(usuarioMapper::toDTO);
    }
    
    /**
     * Obtiene estadísticas básicas de usuarios
     * @return objeto con estadísticas
     */
    @Transactional(readOnly = true)
    public EstadisticasUsuariosDTO obtenerEstadisticas() {
        long totalUsuarios = usuarioRepository.countByActivoTrue();
        long totalAdministradores = usuarioRepository.countAdministradoresActivos();
        
        return new EstadisticasUsuariosDTO(totalUsuarios, totalAdministradores);
    }
    
    /**
     * Verifica si un email está disponible
     * @param email email a verificar
     * @return true si el email está disponible
     */
    @Transactional(readOnly = true)
    public boolean isEmailDisponible(String email) {
        return !usuarioRepository.existsByEmailIgnoreCase(email);
    }
}