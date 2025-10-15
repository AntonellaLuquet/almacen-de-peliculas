package com.almacen.peliculas.usuarios.domain;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para el registro de nuevos usuarios
 * 
 * Contiene las validaciones necesarias para el registro:
 * - Email válido y único
 * - Nombre y apellido obligatorios
 * - Password con longitud mínima de seguridad
 * - Campos opcionales: teléfono y dirección
 * 
 * @author Sistema de Almacén de Películas
 */
public class RegistroUsuarioDTO {
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    @Size(max = 100, message = "El email no debe superar los 100 caracteres")
    private String email;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no debe superar los 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no debe superar los 100 caracteres")
    private String apellido;
    
    @NotBlank(message = "El password es obligatorio")
    @Size(min = 6, message = "El password debe tener al menos 6 caracteres")
    private String password;
    
    @Size(max = 15, message = "El teléfono no debe superar los 15 caracteres")
    private String telefono;
    
    @Size(max = 500, message = "La dirección no debe superar los 500 caracteres")
    private String direccion;
    
    // Constructores
    public RegistroUsuarioDTO() {}
    
    public RegistroUsuarioDTO(String email, String nombre, String apellido, String password) {
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.password = password;
    }
    
    // Getters y Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getApellido() {
        return apellido;
    }
    
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public String getDireccion() {
        return direccion;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}