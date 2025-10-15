# Almacén de Películas Online - Backend

Backend API REST del sistema de gestión de películas online.

## Tecnologías

- Java 21
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- H2 Database (desarrollo)
- PostgreSQL (producción)
- Maven

## Estructura del Proyecto

El proyecto sigue una arquitectura de **Monolito Modular con patrón Vertical Slice**:

```
src/main/java/com/almacenpeliculas/
├── common/              # Configuración y utilidades compartidas
│   ├── config/         # Configuraciones de Spring Boot, CORS, etc.
│   ├── exceptions/     # Manejo global de errores
│   └── utils/          # Utilidades comunes
├── usuarios/           # Módulo de usuarios
│   ├── api/           # Controllers REST
│   ├── service/       # Lógica de negocio
│   ├── domain/        # Entidades y DTOs
│   └── infra/         # Repositorios JPA
├── peliculas/         # Módulo de películas
│   ├── api/
│   ├── service/
│   ├── domain/
│   └── infra/
├── pedidos/           # Módulo de pedidos/carrito
│   ├── api/
│   ├── service/
│   ├── domain/
│   └── infra/
└── AlmacenPeliculasApplication.java
```

## Requisitos Previos

- Java 21 o superior
- Maven 3.6 o superior

## Instalación

1. Clonar el repositorio
2. Navegar al directorio del backend:
   ```bash
   cd backend
   ```

3. Compilar el proyecto:
   ```bash
   mvn clean install
   ```

## Ejecución

Para ejecutar la aplicación en modo desarrollo:

```bash
mvn spring-boot:run
```

La API estará disponible en: `http://localhost:8080`

## Endpoints Principales

### Usuarios
- `POST /api/usuarios/registro` - Registro de usuario
- `POST /api/usuarios/login` - Login
- `GET /api/usuarios/perfil` - Obtener perfil
- `PUT /api/usuarios/perfil` - Actualizar perfil

### Películas
- `GET /api/peliculas` - Listar películas
- `GET /api/peliculas/{id}` - Detalle de película
- `POST /api/peliculas` - Crear película (Admin)
- `PUT /api/peliculas/{id}` - Actualizar película (Admin)
- `GET /api/peliculas/buscar` - Buscar películas

### Pedidos
- `GET /api/pedidos/carrito` - Obtener carrito
- `POST /api/pedidos/carrito/items` - Agregar al carrito
- `PUT /api/pedidos/carrito/items/{id}` - Actualizar cantidad
- `DELETE /api/pedidos/carrito/items/{id}` - Eliminar del carrito
- `POST /api/pedidos/confirmar` - Confirmar pedido
- `GET /api/pedidos` - Historial de pedidos

## Base de Datos

En desarrollo se usa H2 (base de datos en memoria). La consola H2 está disponible en:
`http://localhost:8080/h2-console`

**Credenciales:**
- JDBC URL: `jdbc:h2:mem:almacendb`
- Usuario: `sa`
- Contraseña: (vacío)

## Configuración

La configuración se encuentra en `src/main/resources/application.properties`.

Para configuración específica del entorno, crear archivos:
- `application-dev.properties`
- `application-prod.properties`

## Testing

Ejecutar las pruebas:

```bash
mvn test
```

## Build para Producción

```bash
mvn clean package
```

El JAR generado estará en `target/almacen-peliculas-backend-1.0.0-SNAPSHOT.jar`

## Próximos Pasos

1. Implementar la lógica de negocio en los Services
2. Completar los Controllers con los endpoints
3. Configurar Spring Security para autenticación JWT
4. Agregar validaciones de datos
5. Implementar el envío de emails
6. Crear tests unitarios y de integración
