package com.almacen.peliculas.usuarios.service;

import com.almacen.peliculas.usuarios.domain.*;
import com.almacen.peliculas.usuarios.infra.UsuarioRepository;
import com.almacen.peliculas.common.exceptions.BadRequestException;
import com.almacen.peliculas.common.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;

/**
 * Tests de integración para UsuarioService
 * Prueba la lógica de negocio con base de datos real (H2)
 */
@SpringBootTest
@Transactional
class UsuarioServiceIntegrationTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private RegistroUsuarioDTO registroDTO;

    @BeforeEach
    void setUp() {
        // Limpiar base de datos
        usuarioRepository.deleteAll();

        // Preparar DTO para registrar usuario
        registroDTO = new RegistroUsuarioDTO();
        registroDTO.setEmail("test@example.com");
        registroDTO.setNombre("Juan");
        registroDTO.setApellido("Pérez");
        registroDTO.setPassword("Password123!");
        registroDTO.setTelefono("123456789");
        registroDTO.setDireccion("Calle Falsa 123");
    }

    @Test
    @DisplayName("Registrar usuario exitosamente")
    void testRegistrarUsuario_Success() {
        // When
        UsuarioDTO resultado = usuarioService.registrarUsuario(registroDTO);

        // Then
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isNotNull();
        assertThat(resultado.getEmail()).isEqualTo("test@example.com");
        assertThat(resultado.getNombre()).isEqualTo("Juan");
        assertThat(resultado.getApellido()).isEqualTo("Pérez");
        assertThat(resultado.getRol()).isEqualTo(Rol.CLIENTE);
        assertThat(resultado.getActivo()).isTrue();
    }

    @Test
    @DisplayName("No registrar usuario con email duplicado")
    void testRegistrarUsuario_EmailDuplicado_ThrowsException() {
        // Given
        usuarioService.registrarUsuario(registroDTO);

        // When & Then
        assertThatThrownBy(() -> usuarioService.registrarUsuario(registroDTO))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Ya existe un usuario");
    }

    @Test
    @DisplayName("Obtener usuario por ID existente")
    void testObtenerUsuarioPorId_Success() {
        // Given
        UsuarioDTO creado = usuarioService.registrarUsuario(registroDTO);

        // When
        UsuarioDTO resultado = usuarioService.obtenerUsuarioPorId(creado.getId());

        // Then
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(creado.getId());
        assertThat(resultado.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Obtener usuario por ID inexistente lanza excepción")
    void testObtenerUsuarioPorId_NotFound_ThrowsException() {
        // When & Then
        assertThatThrownBy(() -> usuarioService.obtenerUsuarioPorId(999L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("no encontrado");
    }

    @Test
    @DisplayName("Obtener usuario por email existente")
    void testObtenerUsuarioPorEmail_Success() {
        // Given
        usuarioService.registrarUsuario(registroDTO);

        // When
        UsuarioDTO resultado = usuarioService.obtenerUsuarioPorEmail("test@example.com");

        // Then
        assertThat(resultado).isNotNull();
        assertThat(resultado.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Obtener usuario por email inexistente lanza excepción")
    void testObtenerUsuarioPorEmail_NotFound_ThrowsException() {
        // When & Then
        assertThatThrownBy(() -> usuarioService.obtenerUsuarioPorEmail("noexiste@example.com"))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("no encontrado");
    }

    @Test
    @DisplayName("Actualizar perfil de usuario exitosamente")
    void testActualizarPerfil_Success() {
        // Given
        UsuarioDTO creado = usuarioService.registrarUsuario(registroDTO);
        
        ActualizarPerfilDTO actualizarDTO = new ActualizarPerfilDTO();
        actualizarDTO.setNombre("Carlos");
        actualizarDTO.setApellido("García");
        actualizarDTO.setTelefono("987654321");

        // When
        UsuarioDTO resultado = usuarioService.actualizarPerfil(creado.getId(), actualizarDTO);

        // Then
        assertThat(resultado.getNombre()).isEqualTo("Carlos");
        assertThat(resultado.getApellido()).isEqualTo("García");
        assertThat(resultado.getTelefono()).isEqualTo("987654321");
        assertThat(resultado.getEmail()).isEqualTo("test@example.com"); // No cambió
    }

    @Test
    @DisplayName("Cambiar password exitosamente")
    void testCambiarPassword_Success() {
        // Given
        UsuarioDTO creado = usuarioService.registrarUsuario(registroDTO);

        // When & Then - No debe lanzar excepción
        assertThatCode(() -> 
            usuarioService.cambiarPassword(
                creado.getId(), 
                "Password123!", 
                "NewPassword456!"
            )
        ).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("Cambiar password con password actual incorrecto")
    void testCambiarPassword_PasswordIncorrecto_ThrowsException() {
        // Given
        UsuarioDTO creado = usuarioService.registrarUsuario(registroDTO);

        // When & Then
        assertThatThrownBy(() -> 
            usuarioService.cambiarPassword(
                creado.getId(), 
                "PasswordIncorrecto", 
                "NewPassword456!"
            )
        )
        .isInstanceOf(BadRequestException.class)
        .hasMessageContaining("password actual no es correcto");
    }

    @Test
    @DisplayName("Desactivar usuario (soft delete)")
    void testDesactivarUsuario_Success() {
        // Given
        UsuarioDTO creado = usuarioService.registrarUsuario(registroDTO);

        // When
        usuarioService.desactivarUsuario(creado.getId());

        // Then
        UsuarioDTO resultado = usuarioService.obtenerUsuarioPorId(creado.getId());
        assertThat(resultado.getActivo()).isFalse();
    }

    @Test
    @DisplayName("Cargar usuario por email para Spring Security")
    void testLoadUserByUsername_Success() {
        // Given
        usuarioService.registrarUsuario(registroDTO);

        // When
        UserDetails userDetails = usuarioService.loadUserByUsername("test@example.com");

        // Then
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("test@example.com");
        assertThat(userDetails.isEnabled()).isTrue();
    }

    @Test
    @DisplayName("Cargar usuario inexistente lanza excepción")
    void testLoadUserByUsername_NotFound_ThrowsException() {
        // When & Then
        assertThatThrownBy(() -> usuarioService.loadUserByUsername("noexiste@example.com"))
            .isInstanceOf(UsernameNotFoundException.class)
            .hasMessageContaining("no encontrado");
    }
}
