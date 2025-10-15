package com.almacenpeliculas.usuarios.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para gestión de usuarios.
 * 
 * Endpoints:
 * - POST /api/usuarios/registro - Registro de nuevo usuario
 * - POST /api/usuarios/login - Autenticación de usuario
 * - GET /api/usuarios/perfil - Obtener perfil del usuario actual
 * - PUT /api/usuarios/perfil - Actualizar perfil del usuario
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    // TODO: Implementar endpoints de usuarios
}
