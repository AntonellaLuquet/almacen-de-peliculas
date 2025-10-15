# Almacén de Películas Online - Frontend

Frontend de la aplicación de gestión de películas online desarrollado en React.

## Tecnologías

- React 18
- Vite (Build tool)
- React Router DOM (Navegación)
- Axios (Peticiones HTTP)
- Context API (Estado global)

## Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
├── context/           # Context providers (Auth, Carrito)
├── pages/             # Páginas/Vistas principales
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Registro.jsx
│   ├── Catalogo.jsx
│   ├── DetallePelicula.jsx
│   ├── Carrito.jsx
│   └── Perfil.jsx
├── services/          # Servicios para consumir API REST
│   ├── api.js
│   ├── usuarioService.js
│   ├── peliculasService.js
│   └── pedidoService.js
├── styles/            # Archivos CSS
├── App.jsx            # Componente principal
└── main.jsx           # Punto de entrada
```

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn

## Instalación

1. Navegar al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Configurar la URL del backend en `.env`:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

## Ejecución

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter

## Rutas de la Aplicación

- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/registro` - Registro de usuario
- `/catalogo` - Catálogo de películas
- `/pelicula/:id` - Detalle de película
- `/carrito` - Carrito de compras
- `/perfil` - Perfil de usuario

## Context Providers

### AuthContext
Maneja el estado de autenticación del usuario:
- `user` - Datos del usuario autenticado
- `isAuthenticated` - Estado de autenticación
- `login(userData, token)` - Función para iniciar sesión
- `logout()` - Función para cerrar sesión
- `checkAuth()` - Verificar autenticación

### CarritoContext
Maneja el estado del carrito de compras:
- `items` - Lista de ítems en el carrito
- `agregarAlCarrito(pelicula, cantidad)` - Agregar película
- `actualizarCantidad(peliculaId, cantidad)` - Actualizar cantidad
- `eliminarDelCarrito(peliculaId)` - Eliminar película
- `vaciarCarrito()` - Vaciar el carrito
- `calcularTotal()` - Calcular total
- `cantidadTotal()` - Cantidad total de ítems

## Servicios API

### usuarioService
- `registro(userData)` - Registrar nuevo usuario
- `login(credentials)` - Autenticar usuario
- `obtenerPerfil()` - Obtener perfil del usuario
- `actualizarPerfil(userData)` - Actualizar perfil

### peliculasService
- `obtenerCatalogo(params)` - Listar películas
- `obtenerPelicula(id)` - Detalle de película
- `buscarPeliculas(criterio)` - Buscar películas

### pedidoService
- `obtenerCarrito()` - Obtener carrito
- `agregarAlCarrito(peliculaId, cantidad)` - Agregar al carrito
- `actualizarItemCarrito(itemId, cantidad)` - Actualizar cantidad
- `eliminarItemCarrito(itemId)` - Eliminar del carrito
- `confirmarPedido(pedidoData)` - Procesar compra
- `obtenerPedidos()` - Historial de pedidos

## Build para Producción

```bash
npm run build
```

Los archivos de producción se generarán en el directorio `dist/`

## Próximos Pasos

1. Completar implementación de componentes de páginas
2. Crear componentes reutilizables (Header, Footer, PeliculaCard, etc.)
3. Mejorar estilos y diseño responsivo
4. Agregar validaciones de formularios
5. Implementar manejo de errores y loading states
6. Agregar pruebas unitarias con Vitest
