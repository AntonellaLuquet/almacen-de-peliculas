# Arquitectura del Sistema - Almacén de Películas Online

Este documento describe la arquitectura implementada para el proyecto Almacén de Películas Online.

## Resumen

El proyecto está organizado como un sistema completo con:
- **Backend:** API REST con Java 21 + Spring Boot
- **Frontend:** Aplicación SPA con React 18 + Vite

## Estructura de Directorios

```
almacen-de-peliculas/
├── README.md                    # Documentación principal del proyecto
├── backend/                     # API REST en Java
│   ├── pom.xml                 # Configuración Maven
│   ├── README.md               # Documentación del backend
│   ├── .gitignore
│   └── src/
│       ├── main/
│       │   ├── java/com/almacenpeliculas/
│       │   │   ├── AlmacenPeliculasApplication.java
│       │   │   ├── common/              # Módulo común
│       │   │   │   ├── config/          # Configuraciones (CORS, etc.)
│       │   │   │   ├── exceptions/      # Manejo global de errores
│       │   │   │   └── utils/           # Utilidades compartidas
│       │   │   ├── usuarios/            # Módulo de usuarios
│       │   │   │   ├── api/             # Controllers REST
│       │   │   │   ├── service/         # Lógica de negocio
│       │   │   │   ├── domain/          # Entidades JPA y DTOs
│       │   │   │   └── infra/           # Repositorios
│       │   │   ├── peliculas/           # Módulo de películas
│       │   │   │   ├── api/
│       │   │   │   ├── service/
│       │   │   │   ├── domain/
│       │   │   │   └── infra/
│       │   │   └── pedidos/             # Módulo de pedidos/carrito
│       │   │       ├── api/
│       │   │       ├── service/
│       │   │       ├── domain/
│       │   │       └── infra/
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│           └── java/com/almacenpeliculas/
└── frontend/                    # SPA en React
    ├── package.json            # Configuración npm
    ├── README.md               # Documentación del frontend
    ├── .gitignore
    ├── .env.example
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx            # Punto de entrada
        ├── App.jsx             # Componente principal
        ├── components/         # Componentes reutilizables
        ├── context/            # Context API providers
        │   ├── AuthContext.jsx
        │   └── CarritoContext.jsx
        ├── pages/              # Páginas/vistas
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Registro.jsx
        │   ├── Catalogo.jsx
        │   ├── DetallePelicula.jsx
        │   ├── Carrito.jsx
        │   └── Perfil.jsx
        ├── services/           # Servicios API
        │   ├── api.js
        │   ├── usuarioService.js
        │   ├── peliculasService.js
        │   └── pedidoService.js
        └── styles/             # Estilos CSS
            ├── index.css
            └── App.css
```

## Patrón de Arquitectura Backend

### Vertical Slice Architecture

El backend implementa un patrón de **Vertical Slice** donde cada módulo funcional contiene todas las capas necesarias:

```
módulo/
├── api/         → Controllers REST (endpoints HTTP)
├── service/     → Lógica de negocio
├── domain/      → Entidades JPA y DTOs
└── infra/       → Repositorios y acceso a datos
```

### Ventajas de esta arquitectura:

1. **Cohesión:** Todo lo relacionado con una funcionalidad está junto
2. **Autonomía:** Los módulos son independientes y pueden desarrollarse en paralelo
3. **Mantenibilidad:** Es fácil localizar y modificar código relacionado
4. **Escalabilidad:** Los módulos pueden extraerse como microservicios si es necesario

### Módulos Implementados

#### 1. Common (Común)
- **config/:** Configuraciones globales (CORS, seguridad, etc.)
- **exceptions/:** Manejo centralizado de errores
- **utils/:** Utilidades compartidas por todos los módulos

#### 2. Usuarios
- Registro de nuevos usuarios
- Autenticación y login
- Gestión de perfil de usuario
- Control de roles (USER, ADMIN)

**Entidades:**
- `Usuario`: email, password, nombre, apellido, teléfono, dirección, role

#### 3. Películas
- CRUD de películas
- Búsqueda y filtrado
- Gestión de catálogo
- Control de stock

**Entidades:**
- `Pelicula`: título, descripción, género, año, director, precio, stock, imagen

#### 4. Pedidos
- Gestión de carrito de compras
- Procesamiento de pedidos
- Historial de compras
- Envío de confirmaciones

**Entidades:**
- `Pedido`: usuario, items, total, estado, fechas, dirección
- `PedidoItem`: pedido, película, cantidad, precio unitario, subtotal

## Arquitectura Frontend

### Organización por Responsabilidades

El frontend React está organizado por tipo de componente:

- **pages/:** Páginas completas (una por ruta)
- **components/:** Componentes reutilizables
- **context/:** Estado global con Context API
- **services/:** Comunicación con la API REST
- **styles/:** Estilos CSS

### Context Providers

#### AuthContext
Gestiona la autenticación:
- Estado del usuario logueado
- Token de autenticación
- Funciones de login/logout
- Persistencia en localStorage

#### CarritoContext
Gestiona el carrito:
- Lista de productos
- Agregar/eliminar/actualizar cantidades
- Cálculo de totales
- Persistencia del estado

### Servicios API

Todos los servicios usan Axios con:
- Interceptores para agregar tokens automáticamente
- Manejo de errores centralizado
- Base URL configurable por entorno

## Stack Tecnológico

### Backend
- **Java 21:** Lenguaje de programación
- **Spring Boot 3.2.0:** Framework principal
- **Spring Data JPA:** Persistencia y ORM
- **Spring Security:** Autenticación y autorización
- **H2 Database:** Base de datos en memoria (desarrollo)
- **PostgreSQL:** Base de datos relacional (producción)
- **Lombok:** Reducción de boilerplate
- **Maven:** Gestión de dependencias y build

### Frontend
- **React 18:** Librería de UI
- **Vite:** Build tool y dev server
- **React Router DOM:** Navegación
- **Axios:** Cliente HTTP
- **Context API:** Estado global
- **CSS3:** Estilos

## Comunicación Frontend-Backend

### API REST

El frontend consume la API REST del backend mediante:

1. **Configuración del proxy en Vite:**
   ```javascript
   // vite.config.js
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 3000,
       proxy: {
         '/api': {
           target: 'http://localhost:8080',
           changeOrigin: true
         }
       }
     }
   })
   ```

2. **Servicios encapsulados:**
   - `usuarioService.js`: Endpoints de usuarios
   - `peliculasService.js`: Endpoints de películas
   - `pedidoService.js`: Endpoints de pedidos

3. **Autenticación JWT:**
   - El token se almacena en localStorage
   - Se agrega automáticamente a todas las peticiones
   - Se invalida al hacer logout

### CORS

El backend está configurado para aceptar peticiones desde:
- `http://localhost:3000` (Vite dev server)
- `http://localhost:5173` (Vite alternativo)

## Base de Datos

### Modelo de Datos

```
usuarios
├── id (PK)
├── email (UNIQUE)
├── password
├── nombre
├── apellido
├── telefono
├── direccion
├── role (USER/ADMIN)
├── fecha_registro
└── activo

peliculas
├── id (PK)
├── titulo
├── descripcion
├── genero
├── anio_lanzamiento
├── director
├── precio
├── stock
├── url_imagen
├── disponible
├── fecha_creacion
└── fecha_actualizacion

pedidos
├── id (PK)
├── usuario_id (FK)
├── total
├── estado (PENDIENTE/CONFIRMADO/ENVIADO/ENTREGADO/CANCELADO)
├── fecha_pedido
├── fecha_confirmacion
└── direccion_envio

pedido_items
├── id (PK)
├── pedido_id (FK)
├── pelicula_id (FK)
├── cantidad
├── precio_unitario
└── subtotal
```

### Configuración

**Desarrollo:**
- Base de datos H2 en memoria
- Consola web disponible en `/h2-console`
- DDL auto-update habilitado

**Producción:**
- PostgreSQL
- Migrations con Flyway (por implementar)
- DDL auto-update deshabilitado

## Endpoints API

### Usuarios
- `POST /api/usuarios/registro` - Crear cuenta
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/perfil` - Obtener perfil
- `PUT /api/usuarios/perfil` - Actualizar perfil

### Películas
- `GET /api/peliculas` - Listar catálogo
- `GET /api/peliculas/{id}` - Detalle de película
- `GET /api/peliculas/buscar` - Buscar películas
- `POST /api/peliculas` - Crear película (ADMIN)
- `PUT /api/peliculas/{id}` - Actualizar película (ADMIN)
- `DELETE /api/peliculas/{id}` - Eliminar película (ADMIN)

### Pedidos
- `GET /api/pedidos/carrito` - Ver carrito
- `POST /api/pedidos/carrito/items` - Agregar al carrito
- `PUT /api/pedidos/carrito/items/{id}` - Actualizar cantidad
- `DELETE /api/pedidos/carrito/items/{id}` - Quitar del carrito
- `POST /api/pedidos/confirmar` - Procesar compra
- `GET /api/pedidos` - Historial de pedidos
- `GET /api/pedidos/{id}` - Detalle de pedido

## Próximos Pasos de Implementación

### Backend
1. Implementar lógica de negocio en Services
2. Completar Controllers con validaciones
3. Configurar JWT para autenticación
4. Agregar envío de emails
5. Crear tests unitarios
6. Agregar tests de integración
7. Configurar perfiles de Spring (dev/prod)
8. Implementar paginación en listados

### Frontend
1. Completar componentes de páginas
2. Crear componentes reutilizables (Header, Footer, Card, etc.)
3. Mejorar estilos y hacer diseño responsivo
4. Agregar validaciones de formularios
5. Implementar manejo de errores
6. Agregar loading states
7. Crear tests con Vitest
8. Optimizar rendimiento

### DevOps
1. Configurar CI/CD
2. Dockerizar aplicaciones
3. Configurar base de datos PostgreSQL
4. Implementar migrations
5. Configurar despliegue en producción

## Estado Actual

✅ **Completado:**
- Estructura de directorios completa
- Configuración de Maven y npm
- Módulos backend con estructura Vertical Slice
- Entidades JPA definidas
- Configuración de Spring Boot
- Estructura React con routing
- Context API para estado global
- Servicios para consumir API
- Configuración de Vite
- Documentación completa

⏳ **Pendiente:**
- Implementación de lógica de negocio
- Configuración de Spring Security con JWT
- Completar componentes React
- Agregar tests
- Despliegue en producción
