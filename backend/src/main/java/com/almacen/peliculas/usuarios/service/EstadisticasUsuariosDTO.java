package com.almacen.peliculas.usuarios.service;

/**
 * DTO para mostrar estadísticas de usuarios del sistema
 * 
 * @author Sistema de Almacén de Películas
 */
public class EstadisticasUsuariosDTO {
    
    private long totalUsuarios;
    private long totalAdministradores;
    private long totalClientes;
    
    // Constructores
    public EstadisticasUsuariosDTO() {}
    
    public EstadisticasUsuariosDTO(long totalUsuarios, long totalAdministradores) {
        this.totalUsuarios = totalUsuarios;
        this.totalAdministradores = totalAdministradores;
        this.totalClientes = totalUsuarios - totalAdministradores;
    }
    
    // Getters y Setters
    public long getTotalUsuarios() {
        return totalUsuarios;
    }
    
    public void setTotalUsuarios(long totalUsuarios) {
        this.totalUsuarios = totalUsuarios;
    }
    
    public long getTotalAdministradores() {
        return totalAdministradores;
    }
    
    public void setTotalAdministradores(long totalAdministradores) {
        this.totalAdministradores = totalAdministradores;
    }
    
    public long getTotalClientes() {
        return totalClientes;
    }
    
    public void setTotalClientes(long totalClientes) {
        this.totalClientes = totalClientes;
    }
}