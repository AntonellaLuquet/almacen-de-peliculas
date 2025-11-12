package com.almacen.peliculas.common.security;

import com.almacen.peliculas.common.utils.JwtUtil;
import com.almacen.peliculas.usuarios.domain.Rol;
import com.almacen.peliculas.usuarios.domain.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests de integración para JWT
 * Prueba generación y validación de tokens
 * 
 * @author Sistema de Almacén de Películas
 */
@SpringBootTest
@TestPropertySource(properties = {
    "jwt.secret=testSecretKeyForJWTThatIsLongEnoughForHS256Algorithm",
    "jwt.expiration=3600000"
})
class JwtSecurityTest {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private Usuario usuario;
    
    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Test User");
        usuario.setEmail("test@test.com");
        usuario.setPassword("encodedPassword");
        usuario.setRol(Rol.CLIENTE);
    }
    
    @Test
    void testGenerarToken_Success() {
        // When
        String token = jwtUtil.generateToken(usuario);
        
        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT tiene 3 partes
    }
    
    @Test
    void testExtraerUsername_Success() {
        // Given
        String token = jwtUtil.generateToken(usuario);
        
        // When
        String username = jwtUtil.extractUsername(token);
        
        // Then
        assertEquals("test@test.com", username);
    }
    
    @Test
    void testValidarToken_TokenValido() {
        // Given
        String token = jwtUtil.generateToken(usuario);
        
        // When
        boolean isValid = jwtUtil.validateToken(token, usuario);
        
        // Then
        assertTrue(isValid);
    }
    
    @Test
    void testValidarToken_TokenInvalido() {
        // Given
        String tokenInvalido = "eyJhbGciOiJIUzI1NiJ9.invalid.token";
        
        // When
        boolean isValid = jwtUtil.validateToken(tokenInvalido, usuario);
        
        // Then
        assertFalse(isValid); // Token malformado retorna false, no lanza excepción
    }
    
    @Test
    void testExtraerExpiration_Success() {
        // Given
        String token = jwtUtil.generateToken(usuario);
        
        // When
        var expiration = jwtUtil.extractExpiration(token);
        
        // Then
        assertNotNull(expiration);
        assertTrue(expiration.getTime() > System.currentTimeMillis());
    }
    
    @Test
    void testTokenNoExpirado() {
        // Given
        String token = jwtUtil.generateToken(usuario);
        
        // When
        boolean isValid = jwtUtil.validateToken(token, usuario);
        
        // Then
        assertTrue(isValid); // Un token válido implica que no está expirado
    }
    
    @Test
    void testValidarToken_UsuarioIncorrecto() {
        // Given
        String token = jwtUtil.generateToken(usuario);
        
        Usuario otroUsuario = new Usuario();
        otroUsuario.setEmail("otro@test.com");
        
        // When
        boolean isValid = jwtUtil.validateToken(token, otroUsuario);
        
        // Then
        assertFalse(isValid);
    }
}
