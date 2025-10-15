# Almacén de Películas Online

## Descripción del Proyecto
El sistema **Almacén de Películas Online** es una aplicación web completa para gestión de usuarios, catálogo de películas y compras mediante carrito.  

- **Frontend:** React 18 + Vite, maneja la interfaz, navegación y consumo de la API REST.  
- **Backend:** Java 21 + Spring Boot 3.2, expone servicios REST.  
- **Base de datos:** H2 (desarrollo) / PostgreSQL (producción), gestiona usuarios, películas, carritos y compras.  

**Objetivo:** construir un MVP funcional que permita el registro de usuarios, visualización de películas, agregar al carrito, procesar compras y envío de confirmación por correo electrónico.

## Inicio Rápido

### Requisitos Previos
- Java 21+
- Node.js 18+
- Maven 3.6+

### Ejecutar el Backend

```bash
cd backend
mvn spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`

### Ejecutar el Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Acceso a la Base de Datos H2

URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:almacendb`
- Usuario: `sa`
- Contraseña: (vacío)

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
