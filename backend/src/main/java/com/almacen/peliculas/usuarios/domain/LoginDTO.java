package com.almacen.peliculas.usuarios.domain;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO para el login de usuarios
 * 
 * Contiene las credenciales necesarias para la autenticación:
 * - Email como nombre de usuario
 * - Password para verificación
 * 
 * @author Sistema de Almacén de Películas
 */
public class LoginDTO {
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;
    
    @NotBlank(message = "El password es obligatorio")
    private String password;
    
    // Constructores
    public LoginDTO() {}
    
    public LoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    // Getters y Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}