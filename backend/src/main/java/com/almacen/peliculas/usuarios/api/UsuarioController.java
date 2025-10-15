package com.almacen.peliculas.usuarios.api;

import com.almacen.peliculas.usuarios.domain.*;
import com.almacen.peliculas.usuarios.service.UsuarioService;
import com.almacen.peliculas.usuarios.service.EstadisticasUsuariosDTO;
import com.almacen.peliculas.common.utils.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

/**
 * Controlador REST para la gestión de usuarios
 * 
 * Endpoints disponibles:
 * - POST /usuarios/registro: Registro de nuevos usuarios
 * - POST /usuarios/login: Autenticación de usuarios
 * - GET /usuarios/perfil: Obtener perfil del usuario autenticado
 * - PUT /usuarios/perfil: Actualizar perfil del usuario
 * - PUT /usuarios/password: Cambiar password del usuario
 * - GET /usuarios: Listar usuarios (solo admin)
 * - GET /usuarios/buscar: Buscar usuarios (solo admin)
 * - DELETE /usuarios/{id}: Desactivar usuario (solo admin)
 * - PUT /usuarios/{id}/reactivar: Reactivar usuario (solo admin)
 * - GET /usuarios/estadisticas: Estadísticas de usuarios (solo admin)
 * - GET /usuarios/email-disponible: Verificar disponibilidad de email
 * 
 * @author Sistema de Almacén de Películas
 */
@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema")
public class UsuarioController {
    
    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    
    @Autowired
    public UsuarioController(UsuarioService usuarioService, 
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }
    
    /**
     * Registra un nuevo usuario en el sistema
     */
    @Operation(summary = "Registrar nuevo usuario", 
               description = "Crea una nueva cuenta de usuario en el sistema")
    @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos inválidos o email ya existe")
    @PostMapping("/registro")
    public ResponseEntity<UsuarioDTO> registrarUsuario(@Valid @RequestBody RegistroUsuarioDTO registroDTO) {
        UsuarioDTO usuario = usuarioService.registrarUsuario(registroDTO);
        return new ResponseEntity<>(usuario, HttpStatus.CREATED);
    }
    
    /**
     * Autentica un usuario y devuelve un token JWT
     */
    @Operation(summary = "Login de usuario", 
               description = "Autentica un usuario y devuelve un token JWT")
    @ApiResponse(responseCode = "200", description = "Login exitoso")
    @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        // Autenticar usuario
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );
        
        // Obtener datos del usuario autenticado
        Usuario usuario = (Usuario) authentication.getPrincipal();
        
        // Generar token JWT
        String token = jwtUtil.generateToken(usuario);
        
        // Crear respuesta
        UsuarioDTO usuarioDTO = usuarioService.obtenerUsuarioPorEmail(usuario.getEmail());
        AuthResponseDTO response = new AuthResponseDTO(token, usuarioDTO);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Obtiene el perfil del usuario autenticado
     */
    @Operation(summary = "Obtener perfil", 
               description = "Obtiene el perfil del usuario autenticado",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Perfil obtenido exitosamente")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @GetMapping("/perfil")
    public ResponseEntity<UsuarioDTO> obtenerPerfil(Principal principal) {
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorEmail(principal.getName());
        return ResponseEntity.ok(usuario);
    }
    
    /**
     * Actualiza el perfil del usuario autenticado
     */
    @Operation(summary = "Actualizar perfil", 
               description = "Actualiza el perfil del usuario autenticado",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Perfil actualizado exitosamente")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @PutMapping("/perfil")
    public ResponseEntity<UsuarioDTO> actualizarPerfil(
            Principal principal,
            @Valid @RequestBody ActualizarPerfilDTO perfilDTO) {
        
        UsuarioDTO usuarioActual = usuarioService.obtenerUsuarioPorEmail(principal.getName());
        UsuarioDTO usuarioActualizado = usuarioService.actualizarPerfil(usuarioActual.getId(), perfilDTO);
        
        return ResponseEntity.ok(usuarioActualizado);
    }
    
    /**
     * Cambia el password del usuario autenticado
     */
    @Operation(summary = "Cambiar password", 
               description = "Cambia el password del usuario autenticado",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Password cambiado exitosamente")
    @ApiResponse(responseCode = "400", description = "Password actual incorrecto")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> cambiarPassword(
            Principal principal,
            @RequestBody Map<String, String> passwordData) {
        
        String passwordActual = passwordData.get("passwordActual");
        String passwordNuevo = passwordData.get("passwordNuevo");
        
        UsuarioDTO usuario = usuarioService.obtenerUsuarioPorEmail(principal.getName());
        usuarioService.cambiarPassword(usuario.getId(), passwordActual, passwordNuevo);
        
        return ResponseEntity.ok(Map.of("mensaje", "Password cambiado exitosamente"));
    }
    
    /**
     * Lista todos los usuarios (solo administradores)
     */
    @Operation(summary = "Listar usuarios", 
               description = "Lista todos los usuarios del sistema (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida")
    @ApiResponse(responseCode = "403", description = "Acceso denegado")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UsuarioDTO>> listarUsuarios(
            @PageableDefault(size = 10) Pageable pageable) {
        
        Page<UsuarioDTO> usuarios = usuarioService.obtenerUsuarios(pageable);
        return ResponseEntity.ok(usuarios);
    }
    
    /**
     * Busca usuarios por término de búsqueda (solo administradores)
     */
    @Operation(summary = "Buscar usuarios", 
               description = "Busca usuarios por nombre o apellido (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Resultados de búsqueda obtenidos")
    @GetMapping("/buscar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UsuarioDTO>> buscarUsuarios(
            @Parameter(description = "Término de búsqueda") @RequestParam String q,
            @PageableDefault(size = 10) Pageable pageable) {
        
        Page<UsuarioDTO> usuarios = usuarioService.buscarUsuarios(q, pageable);
        return ResponseEntity.ok(usuarios);
    }
    
    /**
     * Desactiva un usuario (solo administradores)
     */
    @Operation(summary = "Desactivar usuario", 
               description = "Desactiva un usuario del sistema (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Usuario desactivado exitosamente")
    @ApiResponse(responseCode = "403", description = "Acceso denegado")
    @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> desactivarUsuario(@PathVariable Long id) {
        usuarioService.desactivarUsuario(id);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario desactivado exitosamente"));
    }
    
    /**
     * Reactiva un usuario (solo administradores)
     */
    @Operation(summary = "Reactivar usuario", 
               description = "Reactiva un usuario del sistema (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Usuario reactivado exitosamente")
    @PutMapping("/{id}/reactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> reactivarUsuario(@PathVariable Long id) {
        usuarioService.reactivarUsuario(id);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario reactivado exitosamente"));
    }
    
    /**
     * Obtiene estadísticas de usuarios (solo administradores)
     */
    @Operation(summary = "Estadísticas de usuarios", 
               description = "Obtiene estadísticas básicas de usuarios (solo administradores)",
               security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/estadisticas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EstadisticasUsuariosDTO> obtenerEstadisticas() {
        EstadisticasUsuariosDTO estadisticas = usuarioService.obtenerEstadisticas();
        return ResponseEntity.ok(estadisticas);
    }
    
    /**
     * Verifica si un email está disponible
     */
    @Operation(summary = "Verificar disponibilidad de email", 
               description = "Verifica si un email está disponible para registro")
    @GetMapping("/email-disponible")
    public ResponseEntity<Map<String, Boolean>> verificarEmailDisponible(@RequestParam String email) {
        boolean disponible = usuarioService.isEmailDisponible(email);
        return ResponseEntity.ok(Map.of("disponible", disponible));
    }
}