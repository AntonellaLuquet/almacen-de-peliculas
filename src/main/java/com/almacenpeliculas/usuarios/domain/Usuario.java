package com.almacenpeliculas.usuarios.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entidad de dominio que representa un Usuario del sistema.
 * 
 * Atributos principales:
 * - Email (único, usado como username)
 * - Password (encriptado)
 * - Nombre completo
 * - Rol (USER, ADMIN)
 * - Fecha de registro
 * - Estado (activo/inactivo)
 */
@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // TODO: Agregar campos del usuario:
    //       - email (unique)
    //       - password (hash)
    //       - nombreCompleto
    //       - rol
    //       - fechaRegistro
    //       - activo
    
    // TODO: Agregar getters y setters
    // TODO: Agregar constructores
}
