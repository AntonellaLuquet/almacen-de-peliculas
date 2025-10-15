package com.almacen.peliculas.usuarios.domain;

/**
 * DTO para la respuesta de autenticación
 * 
 * Contiene el token JWT y la información básica del usuario
 * después de un login exitoso.
 * 
 * @author Sistema de Almacén de Películas
 */
public class AuthResponseDTO {
    
    private String token;
    private String tipo = "Bearer";
    private UsuarioDTO usuario;
    
    // Constructores
    public AuthResponseDTO() {}
    
    public AuthResponseDTO(String token, UsuarioDTO usuario) {
        this.token = token;
        this.usuario = usuario;
    }
    
    // Getters y Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public UsuarioDTO getUsuario() {
        return usuario;
    }
    
    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }
}