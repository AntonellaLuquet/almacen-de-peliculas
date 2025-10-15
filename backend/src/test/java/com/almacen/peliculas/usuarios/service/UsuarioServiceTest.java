package com.almacen.peliculas.usuarios.service;

import com.almacen.peliculas.usuarios.domain.*;
import com.almacen.peliculas.usuarios.infra.UsuarioRepository;
import com.almacen.peliculas.common.exceptions.BadRequestException;
import com.almacen.peliculas.common.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para UsuarioService
 * 
 * @author Sistema de Almacén de Películas
 */
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {
    
    @Mock
    private UsuarioRepository usuarioRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private UsuarioMapper usuarioMapper;
    
    @InjectMocks
    private UsuarioService usuarioService;
    
    private Usuario usuario;
    private RegistroUsuarioDTO registroDTO;
    private UsuarioDTO usuarioDTO;
    
    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("test@example.com");
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setPassword("hashedPassword");
        usuario.setRol(Rol.CLIENTE);
        usuario.setActivo(true);
        
        registroDTO = new RegistroUsuarioDTO();
        registroDTO.setEmail("test@example.com");
        registroDTO.setNombre("Juan");
        registroDTO.setApellido("Pérez");
        registroDTO.setPassword("password123");
        
        usuarioDTO = new UsuarioDTO();
        usuarioDTO.setId(1L);
        usuarioDTO.setEmail("test@example.com");
        usuarioDTO.setNombre("Juan");
        usuarioDTO.setApellido("Pérez");
        usuarioDTO.setRol(Rol.CLIENTE);
    }
    
    @Test
    void registrarUsuario_Success() {
        // Given
        when(usuarioRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        when(usuarioMapper.toDTO(any(Usuario.class))).thenReturn(usuarioDTO);
        
        // When
        UsuarioDTO result = usuarioService.registrarUsuario(registroDTO);
        
        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(usuarioRepository).existsByEmailIgnoreCase("test@example.com");
        verify(passwordEncoder).encode("password123");
        verify(usuarioRepository).save(any(Usuario.class));
    }
    
    @Test
    void registrarUsuario_EmailExists_ThrowsException() {
        // Given
        when(usuarioRepository.existsByEmailIgnoreCase(anyString())).thenReturn(true);
        
        // When & Then
        BadRequestException exception = assertThrows(
            BadRequestException.class, 
            () -> usuarioService.registrarUsuario(registroDTO)
        );
        
        assertTrue(exception.getMessage().contains("Ya existe un usuario con el email"));
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
    
    @Test
    void obtenerUsuarioPorId_Success() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioMapper.toDTO(usuario)).thenReturn(usuarioDTO);
        
        // When
        UsuarioDTO result = usuarioService.obtenerUsuarioPorId(1L);
        
        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(usuarioRepository).findById(1L);
    }
    
    @Test
    void obtenerUsuarioPorId_NotFound_ThrowsException() {
        // Given
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());
        
        // When & Then
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> usuarioService.obtenerUsuarioPorId(1L)
        );
        
        assertTrue(exception.getMessage().contains("Usuario no encontrado con ID: 1"));
    }
    
    @Test
    void loadUserByUsername_Success() {
        // Given
        when(usuarioRepository.findByEmailAndActivo("test@example.com")).thenReturn(Optional.of(usuario));
        
        // When
        Usuario result = (Usuario) usuarioService.loadUserByUsername("test@example.com");
        
        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertTrue(result.getActivo());
    }
    
    @Test
    void cambiarPassword_Success() {
        // Given
        String passwordActual = "oldPassword";
        String passwordNuevo = "newPassword123";
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(passwordActual, usuario.getPassword())).thenReturn(true);
        when(passwordEncoder.encode(passwordNuevo)).thenReturn("newHashedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        
        // When
        usuarioService.cambiarPassword(1L, passwordActual, passwordNuevo);
        
        // Then
        verify(passwordEncoder).matches(passwordActual, usuario.getPassword());
        verify(passwordEncoder).encode(passwordNuevo);
        verify(usuarioRepository).save(usuario);
    }
    
    @Test
    void cambiarPassword_WrongCurrentPassword_ThrowsException() {
        // Given
        String passwordActual = "wrongPassword";
        String passwordNuevo = "newPassword123";
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(passwordActual, usuario.getPassword())).thenReturn(false);
        
        // When & Then
        BadRequestException exception = assertThrows(
            BadRequestException.class,
            () -> usuarioService.cambiarPassword(1L, passwordActual, passwordNuevo)
        );
        
        assertTrue(exception.getMessage().contains("El password actual no es correcto"));
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}