package com.almacen.peliculas.usuarios.domain;

/**
 * Enumeración de roles de usuario en el sistema
 * 
 * Define los diferentes niveles de acceso y permisos:
 * - CLIENTE: Usuario estándar con permisos básicos de compra
 * - ADMIN: Usuario administrador con permisos completos
 * 
 * @author Sistema de Almacén de Películas
 */
public enum Rol {
    /**
     * Cliente estándar - puede navegar, buscar y comprar películas
     */
    CLIENTE,
    
    /**
     * Administrador - acceso completo al sistema, gestión de películas y usuarios
     */
    ADMIN
}