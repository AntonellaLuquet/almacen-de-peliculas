package com.almacen.peliculas.usuarios.domain;

import jakarta.validation.constraints.Size;

/**
 * DTO para actualizar el perfil de usuario
 * 
 * Permite actualizar información del perfil excluyendo campos críticos
 * como email, password y rol que requieren procesos especiales.
 * 
 * @author Sistema de Almacén de Películas
 */
public class ActualizarPerfilDTO {
    
    @Size(max = 100, message = "El nombre no debe superar los 100 caracteres")
    private String nombre;
    
    @Size(max = 100, message = "El apellido no debe superar los 100 caracteres")
    private String apellido;
    
    @Size(max = 15, message = "El teléfono no debe superar los 15 caracteres")
    private String telefono;
    
    @Size(max = 500, message = "La dirección no debe superar los 500 caracteres")
    private String direccion;
    
    // Constructores
    public ActualizarPerfilDTO() {}
    
    public ActualizarPerfilDTO(String nombre, String apellido, String telefono, String direccion) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.direccion = direccion;
    }
    
    // Getters y Setters
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