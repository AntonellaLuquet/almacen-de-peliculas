package com.almacenpeliculas.usuarios.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para el módulo de Usuarios.
 * 
 * Expone endpoints para:
 * - Registro de nuevos usuarios
 * - Login y autenticación
 * - Obtener y actualizar perfil de usuario
 * - Gestión de roles (admin)
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    // TODO: Inyectar UsuarioService
    // TODO: Implementar endpoints:
    //       - POST /registro
    //       - POST /login
    //       - GET /perfil
    //       - PUT /perfil
}
