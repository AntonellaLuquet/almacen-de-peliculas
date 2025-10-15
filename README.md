# Almacén de Películas Online

## Descripción del Proyecto
El sistema **Almacén de Películas Online** es una aplicación web para gestión de usuarios, catálogo de películas y compras mediante carrito.  

- **Frontend:** React, maneja la interfaz, navegación y consumo de la API REST.  
- **Backend:** Java 21 + Spring Boot, expone servicios REST.  
- **Base de datos:** Relacional, gestiona usuarios, películas, carritos y compras.  

Objetivo: construir un MVP funcional que permita el registro de usuarios, visualización de películas, agregar al carrito, procesar compras y envío de confirmación por correo electrónico.

---

## Arquitectura del Sistema

### Estructura General
- **Monolito modular** con patrón **Vertical Slice**: cada módulo contiene su propio stack (Controller, Service, Domain/DTO, Repository).  
- **Capas internas:** claridad en responsabilidades y mantenibilidad.  
- **common/:** configuración global, manejo de errores y utilidades compartidas.

### Módulos Funcionales
- **Usuarios:** autenticación, registro, edición de perfil.  
- **Películas:** catálogo, búsqueda, filtros, CRUD.  
- **Pedidos / Carrito:** gestión de carrito, procesamiento de compras, envío de emails.  

### Estructura de Carpetas Propuesta
src
└── main
└── java/com/almacenpeliculas
├── common/
│ ├── config/
│ ├── exceptions/
│ └── utils/
├── peliculas/
│ ├── api/
│ │ └── PeliculaController.java
│ ├── service/
│ │ └── PeliculaService.java
│ ├── domain/
│ │ └── Pelicula.java
│ └── infra/
│ └── PeliculaRepository.java
├── usuarios/
│ ├── api/
│ │ └── UsuarioController.java
│ ├── service/
│ │ └── UsuarioService.java
│ ├── domain/
│ │ └── Usuario.java
│ └── infra/
│ └── UsuarioRepository.java
├── pedidos/
│ ├── api/
│ │ └── PedidoController.java
│ ├── service/
│ │ └── PedidoService.java
│ ├── domain/
│ │ └── Pedido.java
│ └── infra/
│ └── PedidoRepository.java
└── AlmacenPeliculasApplication.java


### Justificación de la Estructura
1. **Vertical Slice:** módulos autónomos y cohesivos.  
2. **Capas internas:** separación clara de responsabilidades.  
3. **common/:** centraliza configuraciones, seguridad, excepciones y utilidades globales.  
4. **Beneficios:** desarrollo paralelo, escalabilidad, mantenibilidad y claridad académica.  

---

## Ejemplos de Código

### Backend - Spring Boot

#### 1. Entidad Película (domain/Pelicula.java)

```java
package com.almacenpeliculas.peliculas.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "peliculas")
@Data
public class Pelicula {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El título es obligatorio")
    @Size(min = 1, max = 200)
    @Column(nullable = false)
    private String titulo;
    
    @NotBlank(message = "La descripción es obligatoria")
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;
    
    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock;
    
    @NotBlank
    private String genero;
    
    @NotNull
    @Min(1900)
    @Max(2100)
    private Integer anio;
    
    private String director;
    
    private String imageUrl;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
    
    private LocalDateTime fechaActualizacion;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
```

#### 2. Repositorio de Películas (infra/PeliculaRepository.java)

```java
package com.almacenpeliculas.peliculas.infra;

import com.almacenpeliculas.peliculas.domain.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    
    List<Pelicula> findByGenero(String genero);
    
    List<Pelicula> findByAnio(Integer anio);
    
    @Query("SELECT p FROM Pelicula p WHERE LOWER(p.titulo) LIKE LOWER(CONCAT('%', :busqueda, '%')) " +
           "OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    List<Pelicula> buscarPeliculas(@Param("busqueda") String busqueda);
    
    @Query("SELECT p FROM Pelicula p WHERE p.stock > 0")
    List<Pelicula> findDisponibles();
}
```

#### 3. Servicio de Películas (service/PeliculaService.java)

```java
package com.almacenpeliculas.peliculas.service;

import com.almacenpeliculas.common.exceptions.ResourceNotFoundException;
import com.almacenpeliculas.peliculas.domain.Pelicula;
import com.almacenpeliculas.peliculas.infra.PeliculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PeliculaService {
    
    private final PeliculaRepository peliculaRepository;
    
    @Transactional(readOnly = true)
    public List<Pelicula> obtenerTodas() {
        return peliculaRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Pelicula obtenerPorId(Long id) {
        return peliculaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<Pelicula> buscarPeliculas(String busqueda) {
        return peliculaRepository.buscarPeliculas(busqueda);
    }
    
    @Transactional(readOnly = true)
    public List<Pelicula> obtenerDisponibles() {
        return peliculaRepository.findDisponibles();
    }
    
    @Transactional
    public Pelicula crearPelicula(Pelicula pelicula) {
        return peliculaRepository.save(pelicula);
    }
    
    @Transactional
    public Pelicula actualizarPelicula(Long id, Pelicula peliculaActualizada) {
        Pelicula pelicula = obtenerPorId(id);
        pelicula.setTitulo(peliculaActualizada.getTitulo());
        pelicula.setDescripcion(peliculaActualizada.getDescripcion());
        pelicula.setPrecio(peliculaActualizada.getPrecio());
        pelicula.setStock(peliculaActualizada.getStock());
        pelicula.setGenero(peliculaActualizada.getGenero());
        pelicula.setAnio(peliculaActualizada.getAnio());
        pelicula.setDirector(peliculaActualizada.getDirector());
        pelicula.setImageUrl(peliculaActualizada.getImageUrl());
        return peliculaRepository.save(pelicula);
    }
    
    @Transactional
    public void eliminarPelicula(Long id) {
        if (!peliculaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Película no encontrada con id: " + id);
        }
        peliculaRepository.deleteById(id);
    }
    
    @Transactional
    public void actualizarStock(Long id, Integer cantidad) {
        Pelicula pelicula = obtenerPorId(id);
        int nuevoStock = pelicula.getStock() - cantidad;
        if (nuevoStock < 0) {
            throw new IllegalArgumentException("Stock insuficiente");
        }
        pelicula.setStock(nuevoStock);
        peliculaRepository.save(pelicula);
    }
}
```

#### 4. Controlador de Películas (api/PeliculaController.java)

```java
package com.almacenpeliculas.peliculas.api;

import com.almacenpeliculas.peliculas.domain.Pelicula;
import com.almacenpeliculas.peliculas.service.PeliculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PeliculaController {
    
    private final PeliculaService peliculaService;
    
    @GetMapping
    public ResponseEntity<List<Pelicula>> obtenerTodas() {
        return ResponseEntity.ok(peliculaService.obtenerTodas());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pelicula> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(peliculaService.obtenerPorId(id));
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<Pelicula>> buscarPeliculas(@RequestParam String q) {
        return ResponseEntity.ok(peliculaService.buscarPeliculas(q));
    }
    
    @GetMapping("/disponibles")
    public ResponseEntity<List<Pelicula>> obtenerDisponibles() {
        return ResponseEntity.ok(peliculaService.obtenerDisponibles());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Pelicula> crearPelicula(@Valid @RequestBody Pelicula pelicula) {
        Pelicula nuevaPelicula = peliculaService.crearPelicula(pelicula);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPelicula);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Pelicula> actualizarPelicula(
            @PathVariable Long id,
            @Valid @RequestBody Pelicula pelicula) {
        return ResponseEntity.ok(peliculaService.actualizarPelicula(id, pelicula));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarPelicula(@PathVariable Long id) {
        peliculaService.eliminarPelicula(id);
        return ResponseEntity.noContent().build();
    }
}
```

#### 5. Entidad Usuario (domain/Usuario.java)

```java
package com.almacenpeliculas.usuarios.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 50)
    @Column(unique = true, nullable = false)
    private String username;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email debe ser válido")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6)
    @Column(nullable = false)
    private String password;
    
    @NotBlank
    private String nombre;
    
    @NotBlank
    private String apellido;
    
    private String telefono;
    
    private String direccion;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_roles", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "rol")
    private Set<String> roles = new HashSet<>();
    
    @Column(nullable = false)
    private Boolean activo = true;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;
    
    private LocalDateTime ultimoAcceso;
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }
}
```

#### 6. Controlador de Usuarios (api/UsuarioController.java)

```java
package com.almacenpeliculas.usuarios.api;

import com.almacenpeliculas.usuarios.domain.Usuario;
import com.almacenpeliculas.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {
    
    private final UsuarioService usuarioService;
    
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrarUsuario(@Valid @RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }
    
    @GetMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Usuario> obtenerPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = usuarioService.obtenerPorUsername(userDetails.getUsername());
        return ResponseEntity.ok(usuario);
    }
    
    @PutMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Usuario> actualizarPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody Usuario usuarioActualizado) {
        Usuario usuario = usuarioService.actualizarUsuario(userDetails.getUsername(), usuarioActualizado);
        return ResponseEntity.ok(usuario);
    }
}
```

#### 7. Configuración de Seguridad (common/config/SecurityConfig.java)

```java
package com.almacenpeliculas.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/usuarios/registro", "/api/auth/**").permitAll()
                .requestMatchers("/api/peliculas/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }
}
```

#### 8. Excepciones Personalizadas (common/exceptions/ResourceNotFoundException.java)

```java
package com.almacenpeliculas.common.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

#### 9. Clase de Respuesta de Error (common/exceptions/ErrorResponse.java)

```java
package com.almacenpeliculas.common.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
}
```

#### 10. Manejo Global de Excepciones (common/exceptions/GlobalExceptionHandler.java)

```java
package com.almacenpeliculas.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.badRequest().body(error);
    }
}
```

#### 11. Servicio de Usuarios (service/UsuarioService.java)

```java
package com.almacenpeliculas.usuarios.service;

import com.almacenpeliculas.common.exceptions.ResourceNotFoundException;
import com.almacenpeliculas.usuarios.domain.Usuario;
import com.almacenpeliculas.usuarios.infra.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya existe");
        }
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        usuario.setRoles(roles);
        
        return usuarioRepository.save(usuario);
    }
    
    @Transactional(readOnly = true)
    public Usuario obtenerPorUsername(String username) {
        return usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
    }
    
    @Transactional
    public Usuario actualizarUsuario(String username, Usuario usuarioActualizado) {
        Usuario usuario = obtenerPorUsername(username);
        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setApellido(usuarioActualizado.getApellido());
        usuario.setTelefono(usuarioActualizado.getTelefono());
        usuario.setDireccion(usuarioActualizado.getDireccion());
        return usuarioRepository.save(usuario);
    }
}
```

#### 12. Repositorio de Usuarios (infra/UsuarioRepository.java)

```java
package com.almacenpeliculas.usuarios.infra;

import com.almacenpeliculas.usuarios.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
```

#### 13. Configuración de la Aplicación (application.properties)

```properties
# Configuración del servidor
server.port=8080

# Configuración de la base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/almacen_peliculas?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.org.springframework.web=INFO
logging.level.com.almacenpeliculas=DEBUG

# Configuración de email (para envío de confirmaciones)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

#### 14. Clase Principal de la Aplicación (AlmacenPeliculasApplication.java)

```java
package com.almacenpeliculas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AlmacenPeliculasApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(AlmacenPeliculasApplication.class, args);
    }
}
```

### Frontend - React

#### 1. Componente Catálogo de Películas (components/CatalogoPeliculas.jsx)

```jsx
import React, { useState, useEffect } from 'react';
import { peliculasService } from '../services/peliculasService';
import './CatalogoPeliculas.css';

const CatalogoPeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPeliculas();
  }, []);

  const cargarPeliculas = async () => {
    try {
      setCargando(true);
      const data = await peliculasService.obtenerTodas();
      setPeliculas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las películas');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const buscarPeliculas = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) {
      cargarPeliculas();
      return;
    }
    
    try {
      setCargando(true);
      const data = await peliculasService.buscar(busqueda);
      setPeliculas(data);
      setError(null);
    } catch (err) {
      setError('Error al buscar películas');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const agregarAlCarrito = (pelicula) => {
    // Lógica para agregar al carrito
    console.log('Agregando al carrito:', pelicula);
  };

  if (cargando) return <div className="cargando">Cargando películas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Películas</h1>
      
      <form onSubmit={buscarPeliculas} className="busqueda-form">
        <input
          type="text"
          placeholder="Buscar películas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
        <button type="submit" className="btn-buscar">Buscar</button>
      </form>

      <div className="peliculas-grid">
        {peliculas.map((pelicula) => (
          <div key={pelicula.id} className="pelicula-card">
            <img 
              src={pelicula.imageUrl || '/placeholder.jpg'} 
              alt={pelicula.titulo}
              className="pelicula-imagen"
            />
            <div className="pelicula-info">
              <h3>{pelicula.titulo}</h3>
              <p className="pelicula-director">{pelicula.director}</p>
              <p className="pelicula-anio">{pelicula.anio}</p>
              <p className="pelicula-genero">{pelicula.genero}</p>
              <p className="pelicula-descripcion">{pelicula.descripcion}</p>
              <div className="pelicula-footer">
                <span className="pelicula-precio">${pelicula.precio}</span>
                <span className="pelicula-stock">Stock: {pelicula.stock}</span>
              </div>
              <button 
                onClick={() => agregarAlCarrito(pelicula)}
                disabled={pelicula.stock === 0}
                className="btn-agregar-carrito"
              >
                {pelicula.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogoPeliculas;
```

#### 2. Componente de Registro (components/RegistroUsuario.jsx)

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import './RegistroUsuario.css';

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await usuarioService.registrar(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <form onSubmit={handleSubmit} className="registro-form">
        <h2>Registrarse</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" disabled={cargando} className="btn-submit">
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default RegistroUsuario;
```

#### 3. Componente Login (components/LoginForm.jsx)

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await authService.login(formData);
      navigate('/catalogo');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <button 
          type="submit" 
          disabled={cargando}
          className="btn-submit"
        >
          {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <p className="registro-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
```

#### 4. Servicio de Usuarios (services/usuarioService.js)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/usuarios';

export const usuarioService = {
  registrar: async (usuario) => {
    const response = await axios.post(`${API_URL}/registro`, usuario);
    return response.data;
  },

  obtenerPerfil: async () => {
    const response = await axios.get(`${API_URL}/perfil`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  actualizarPerfil: async (usuario) => {
    const response = await axios.put(`${API_URL}/perfil`, usuario, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }
};
```

#### 5. Servicio de Películas (services/peliculasService.js)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/peliculas';

export const peliculasService = {
  obtenerTodas: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  buscar: async (query) => {
    const response = await axios.get(`${API_URL}/buscar`, {
      params: { q: query }
    });
    return response.data;
  },

  obtenerDisponibles: async () => {
    const response = await axios.get(`${API_URL}/disponibles`);
    return response.data;
  },

  crear: async (pelicula) => {
    const response = await axios.post(API_URL, pelicula, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  actualizar: async (id, pelicula) => {
    const response = await axios.put(`${API_URL}/${id}`, pelicula, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  eliminar: async (id) => {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};
```

#### 6. Servicio de Autenticación (services/authService.js)

> **Nota:** Este ejemplo muestra la estructura del servicio de autenticación. 
> Para una implementación completa con JWT, se requiere agregar un `AuthController` 
> en el backend que maneje el login y la generación de tokens JWT.

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
```

#### 7. Configuración de Rutas (App.jsx)

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistroUsuario from './components/RegistroUsuario';
import CatalogoPeliculas from './components/CatalogoPeliculas';
import { authService } from './services/authService';
import './App.css';

const PrivateRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registro" element={<RegistroUsuario />} />
          <Route path="/catalogo" element={<CatalogoPeliculas />} />
          {/* Rutas adicionales para DetallePelicula, Carrito, PerfilUsuario 
              pueden ser implementadas siguiendo el mismo patrón */}
          <Route path="/" element={<Navigate to="/catalogo" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

> **Nota:** Para una aplicación completa, se pueden agregar componentes adicionales como:
> - `DetallePelicula`: Para mostrar los detalles de una película específica
> - `Carrito`: Para gestionar el carrito de compras
> - `PerfilUsuario`: Para editar el perfil del usuario
> - `ConfirmacionCompra`: Para confirmar y procesar pedidos

### Base de Datos

#### Schema SQL

```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS almacen_peliculas;
USE almacen_peliculas;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Tabla de roles de usuario
CREATE TABLE usuario_roles (
    usuario_id BIGINT NOT NULL,
    rol VARCHAR(50) NOT NULL,
    PRIMARY KEY (usuario_id, rol),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de películas
CREATE TABLE peliculas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    genero VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    director VARCHAR(100),
    image_url VARCHAR(500),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_genero (genero),
    INDEX idx_anio (anio),
    INDEX idx_titulo (titulo)
);

-- Tabla de carritos
CREATE TABLE carritos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de items del carrito
CREATE TABLE carrito_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    carrito_id BIGINT NOT NULL,
    pelicula_id BIGINT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE CASCADE,
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id)
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direccion_envio VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de items del pedido
CREATE TABLE pedido_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    pelicula_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id)
);

-- Datos de ejemplo para películas
INSERT INTO peliculas (titulo, descripcion, precio, stock, genero, anio, director, image_url) VALUES
('El Padrino', 'La historia de una familia mafiosa en Nueva York', 29.99, 10, 'Drama', 1972, 'Francis Ford Coppola', 'https://example.com/padrino.jpg'),
('Matrix', 'Un hacker descubre la verdad sobre su realidad', 24.99, 15, 'Ciencia Ficción', 1999, 'Wachowski', 'https://example.com/matrix.jpg'),
('Inception', 'Un ladrón entra en los sueños de las personas', 27.99, 8, 'Ciencia Ficción', 2010, 'Christopher Nolan', 'https://example.com/inception.jpg');
```

### Instrucciones de Instalación y Configuración

#### Backend

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/almacen-de-peliculas.git
cd almacen-de-peliculas

# 2. Configurar la base de datos MySQL
mysql -u root -p < schema.sql

# 3. Configurar application.properties con tus credenciales
# Editar src/main/resources/application.properties

# 4. Compilar y ejecutar con Maven
mvn clean install
mvn spring-boot:run

# O con Gradle
./gradlew build
./gradlew bootRun
```

#### Frontend

```bash
# 1. Navegar al directorio del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Instalar dependencias adicionales necesarias
npm install axios react-router-dom

# 4. Iniciar el servidor de desarrollo
npm start

# La aplicación estará disponible en http://localhost:3000
```

#### Configuración de Variables de Entorno

```bash
# Backend (.env o application.properties)
DB_URL=jdbc:mysql://localhost:3306/almacen_peliculas
DB_USERNAME=root
DB_PASSWORD=tu_password
EMAIL_HOST=smtp.gmail.com
EMAIL_USERNAME=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_email

# Para implementación JWT (requiere dependencias adicionales y AuthController)
# JWT_SECRET=tu_clave_secreta_jwt
# JWT_EXPIRATION=86400000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:8080/api
```

---

## Prompt Extendido para GitHub Copilot

```markdown
# Prompt Extendido Copilot - Proyecto Completo

Eres un asistente de desarrollo experto en Java 21 con Spring Boot y React. Tu tarea es generar todo el código necesario para implementar el proyecto "Almacén de Películas Online".

## Backend
- **Framework:** Spring Boot
- **Estructura:** Vertical Slice por módulo
- **Módulos:**
  1. Usuarios (registro, login, perfil)
  2. Películas (CRUD, búsqueda, filtros)
  3. Pedidos/Carrito (gestión carrito, registro de compra, envío de email)
- **Capas por módulo:**
  - api/ → Controladores REST
  - service/ → Lógica de negocio
  - domain/ → Entidades y DTOs
  - infra/ → Repositorios JPA
- **Common/**:
  - config/: configuración global Spring Boot, seguridad, datasource
  - exceptions/: manejo global de errores
  - utils/: helpers reutilizables
- **Requisitos funcionales y no funcionales:**
  - Rendimiento < 2s
  - Seguridad: passwords hash, roles, validación de entradas
  - Escalabilidad: API REST reutilizable
  - Mantenibilidad: modular y documentado
- **Pruebas:** unitarias para servicios y repositorios, pruebas de integración básicas para controladores.

## Frontend
- **Framework:** React + Hooks + Context API
- **Componentes principales:**
  1. LoginForm
  2. RegistroUsuario
  3. PerfilUsuario
  4. CatalogoPeliculas
  5. DetallePelicula
  6. Carrito
  7. ConfirmacionCompra
- **Servicios para consumir la API REST:**
  - usuarioService.js
  - peliculasService.js
  - pedidoService.js
- **Routing:** React Router para navegación entre páginas
- **Estado global:** Context API o Redux
- **Validaciones y mensajes de error:** en formularios y operaciones
- **Estilo:** CSS modular o Styled Components

## Instrucciones para Copilot
1. Genera archivos Java en la estructura propuesta, con comentarios explicativos y anotaciones Spring Boot.
2. Crea DTOs y mapeos entre entidades y servicios.
3. Genera componentes React funcionales conectados con la API REST.
4. Incluye validaciones de formularios, mensajes de error y manejo de estado.
5. Genera ejemplos de pruebas unitarias y de integración.
6. Comenta el código explicando la funcionalidad de cada clase, método y componente.
7. Mantén consistencia con los nombres de carpetas y convenciones de Spring Boot y React.

Objetivo final: tener un **MVP funcional completo** backend + frontend listo para ejecutar, probar y extender.
