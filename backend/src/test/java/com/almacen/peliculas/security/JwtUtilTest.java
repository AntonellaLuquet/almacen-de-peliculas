package com.almacen.peliculas.security;

import com.almacen.peliculas.common.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Date;

import static org.assertj.core.api.Assertions.*;

/**
 * Tests para JwtUtil
 * Verifica generación, validación y extracción de claims de tokens JWT
 */
@SpringBootTest
class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    private UserDetails userDetails;
    private String validToken;

    @BeforeEach
    void setUp() {
        // Crear UserDetails de prueba
        userDetails = User.builder()
            .username("test@example.com")
            .password("password")
            .authorities(new ArrayList<>())
            .build();

        // Generar token válido para pruebas
        validToken = jwtUtil.generateToken(userDetails);
    }

    @Test
    @DisplayName("Generar token exitosamente")
    void testGenerateToken_Success() {
        // When
        String token = jwtUtil.generateToken(userDetails);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // JWT tiene 3 partes
    }

    @Test
    @DisplayName("Extraer username del token")
    void testExtractUsername_Success() {
        // When
        String username = jwtUtil.extractUsername(validToken);

        // Then
        assertThat(username).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Extraer expiration del token")
    void testExtractExpiration_Success() {
        // When
        Date expiration = jwtUtil.extractExpiration(validToken);

        // Then
        assertThat(expiration).isNotNull();
        assertThat(expiration).isAfter(new Date());
    }

    @Test
    @DisplayName("Extraer claim específico del token")
    void testExtractClaim_Success() {
        // When
        String subject = jwtUtil.extractClaim(validToken, Claims::getSubject);

        // Then
        assertThat(subject).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Validar token válido retorna true")
    void testValidateToken_ValidToken_ReturnsTrue() {
        // When
        boolean isValid = jwtUtil.validateToken(validToken, userDetails);

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Validar token con username incorrecto retorna false")
    void testValidateToken_WrongUsername_ReturnsFalse() {
        // Given
        UserDetails wrongUser = User.builder()
            .username("wrong@example.com")
            .password("password")
            .authorities(new ArrayList<>())
            .build();

        // When
        boolean isValid = jwtUtil.validateToken(validToken, wrongUser);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Validar token malformado retorna false")
    void testValidateToken_MalformedToken_ReturnsFalse() {
        // Given
        String malformedToken = "malformed.token.here";

        // When
        boolean isValid = jwtUtil.validateToken(malformedToken, userDetails);

        // Then
        assertThat(isValid).isFalse(); // Token malformado retorna false
    }

    @Test
    @DisplayName("Generar dos tokens diferentes para el mismo usuario")
    void testGenerateToken_DifferentTokens() throws InterruptedException {
        // When
        String token1 = jwtUtil.generateToken(userDetails);
        
        // Esperar suficiente tiempo para asegurar timestamp diferente
        Thread.sleep(1001); // Más de 1 segundo para cambiar el timestamp
        
        String token2 = jwtUtil.generateToken(userDetails);

        // Then - Los tokens deberían ser diferentes y ambos válidos
        assertThat(token1).isNotEqualTo(token2);
        assertThat(jwtUtil.validateToken(token1, userDetails)).isTrue();
        assertThat(jwtUtil.validateToken(token2, userDetails)).isTrue();
    }

    @Test
    @DisplayName("Token contiene el subject correcto")
    void testToken_ContainsCorrectSubject() {
        // When
        String token = jwtUtil.generateToken(userDetails);
        String extractedUsername = jwtUtil.extractUsername(token);

        // Then
        assertThat(extractedUsername).isEqualTo(userDetails.getUsername());
    }
}
