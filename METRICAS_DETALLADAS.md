# Métricas Técnicas Detalladas - Almacén de Películas

## 📋 Tabla de Contenidos
1. [Distribución de Archivos](#distribución-de-archivos)
2. [Análisis de Complejidad](#análisis-de-complejidad)
3. [Estructura de Módulos](#estructura-de-módulos)
4. [Dependencias del Proyecto](#dependencias-del-proyecto)
5. [Métricas de Código](#métricas-de-código)

---

## 📁 Distribución de Archivos

### Backend (Java/Spring Boot)
```
Total de archivos Java:        41
├── Producción (src/main):     39 archivos
└── Tests (src/test):           2 archivos

Archivos de configuración:      1
├── application.properties      ✓
└── pom.xml                     ✓
```

### Frontend (React)
```
Total de archivos JavaScript:  35 archivos
├── Componentes (.js):         35 archivos
├── Estilos (.css):             2 archivos
└── JSX (.jsx):                 0 archivos

Archivos de configuración:
├── package.json               ✓
└── package-lock.json          ✓
```

---

## 🔍 Análisis de Complejidad

### Backend - Archivos Más Complejos

| Archivo | Líneas | Tipo | Módulo |
|---------|--------|------|--------|
| `PeliculaService.java` | 337 | Service | Películas |
| `Pedido.java` | 309 | Entity | Pedidos |
| `Pelicula.java` | 288 | Entity | Películas |
| `PeliculaController.java` | 277 | Controller | Películas |
| `UsuarioController.java` | 247 | Controller | Usuarios |
| `Carrito.java` | 242 | Entity | Pedidos |
| `UsuarioService.java` | 241 | Service | Usuarios |
| `Usuario.java` | 213 | Entity | Usuarios |
| `PeliculaRepository.java` | 202 | Repository | Películas |

**Observaciones:**
- ⚠️ `PeliculaService.java` (337 líneas): Considerar refactorización
- ⚠️ `Pedido.java` y `Carrito.java`: Entidades complejas, revisar responsabilidades
- ✅ Controllers en rango aceptable (200-300 líneas)

### Frontend - Archivos Más Complejos

| Archivo | Líneas | Tipo |
|---------|--------|------|
| `ProfilePage.js` | 825 | Page Component |
| `AdminStats.js` | 675 | Admin Component |
| `AdminMovies.js` | 653 | Admin Component |
| `CheckoutPage.js` | 598 | Page Component |
| `AdminOrders.js` | 536 | Admin Component |
| `CatalogPage.js` | 532 | Page Component |
| `OrdersPage.js` | 531 | Page Component |
| `RegisterPage.js` | 525 | Page Component |
| `AdminDashboard.js` | 519 | Admin Component |

**Observaciones:**
- 🔴 `ProfilePage.js` (825 líneas): **CRÍTICO** - Refactorizar urgentemente
- ⚠️ Componentes de Admin (500-675 líneas): Considerar dividir en sub-componentes
- ⚠️ Pages complejas (500-600 líneas): Extraer lógica a hooks customizados

**Recomendaciones de Refactorización:**
1. **ProfilePage.js**: Dividir en componentes más pequeños
   - ProfileHeader
   - ProfileForm
   - ProfileHistory
   - ProfileSettings
2. **AdminStats.js**: Extraer widgets de estadísticas
3. **Páginas grandes**: Mover lógica de negocio a hooks personalizados

---

## 🏗️ Estructura de Módulos

### Backend - Módulos Implementados

```
backend/src/main/java/com/almacen/peliculas/
│
├── 📦 common/                    [Módulo Transversal]
│   ├── config/                   ✓ Configuración global
│   ├── exceptions/               ✓ Manejo de errores
│   └── utils/                    ✓ Utilidades compartidas
│
├── 📦 usuarios/                  [COMPLETO 80%]
│   ├── api/                      ✓ UsuarioController.java
│   ├── service/                  ✓ UsuarioService.java
│   ├── domain/                   ✓ Usuario.java, DTOs
│   └── infra/                    ✓ UsuarioRepository.java
│
├── 📦 peliculas/                 [COMPLETO 80%]
│   ├── api/                      ✓ PeliculaController.java
│   ├── service/                  ✓ PeliculaService.java
│   ├── domain/                   ✓ Pelicula.java, DTOs
│   └── infra/                    ✓ PeliculaRepository.java
│
└── 📦 pedidos/                   [INCOMPLETO 30%]
    ├── api/                      ✗ Falta implementar
    ├── service/                  ✗ Falta implementar
    ├── domain/                   ✓ Pedido.java, Carrito.java
    └── infra/                    ✗ Falta implementar
```

**Estado de Implementación:**
- ✅ **Usuarios:** 80% completo (falta tests completos)
- ✅ **Películas:** 80% completo (falta tests completos)
- ⚠️ **Pedidos:** 30% completo (solo Domain, falta API, Service, Repository)
- ✅ **Common:** 100% completo

### Frontend - Estructura de Páginas

```
frontend/src/
│
├── 📄 pages/                     [13 páginas]
│   ├── HomePage.js               ✓ Página principal
│   ├── LoginPage.js              ✓ Autenticación
│   ├── RegisterPage.js           ✓ Registro de usuarios
│   ├── ProfilePage.js            ✓ Perfil de usuario
│   ├── CatalogPage.js            ✓ Catálogo de películas
│   ├── MovieDetailPage.js        ✓ Detalle de película
│   ├── CartPage.js               ✓ Carrito de compras
│   ├── CheckoutPage.js           ✓ Proceso de pago
│   ├── OrdersPage.js             ✓ Historial de pedidos
│   ├── AdminPage.js              ✓ Panel administrativo
│   ├── NotFoundPage.js           ✓ Página 404
│   │
│   ├── admin/                    [Panel de Administración]
│   │   ├── AdminDashboard.js     ✓ Dashboard principal
│   │   ├── AdminMovies.js        ✓ Gestión de películas
│   │   ├── AdminOrders.js        ✓ Gestión de pedidos
│   │   └── AdminStats.js         ✓ Estadísticas y métricas
│   │
│   └── checkout/                 [Proceso de Compra]
│       └── (componentes internos)
│
├── 📦 components/                [Componentes Reutilizables]
│   ├── Auth/                     ✓ Componentes de autenticación
│   └── Layout/                   ✓ Componentes de layout
│
├── 🔧 services/                  [Servicios API]
│   ├── payment/                  ✓ Servicios de pago
│   └── (otros servicios)
│
├── 🌐 context/                   [Estado Global]
│   └── (Context API)
│
└── 🛠️ utils/                     [Utilidades]
    └── (funciones helper)
```

---

## 📦 Dependencias del Proyecto

### Backend (Spring Boot)

#### Dependencias Principales
```xml
Spring Boot Starters:
├── spring-boot-starter-web           (API REST)
├── spring-boot-starter-data-jpa      (Persistencia)
├── spring-boot-starter-security      (Seguridad)
├── spring-boot-starter-validation    (Validaciones)
└── spring-boot-starter-mail          (Email)
```

#### Seguridad y Autenticación
```xml
JWT (JSON Web Tokens):
├── jjwt-api (0.12.3)
├── jjwt-impl (0.12.3)
└── jjwt-jackson (0.12.3)
```

#### Base de Datos
```xml
├── H2 Database (desarrollo)
└── PostgreSQL (producción)
```

#### Herramientas y Utilidades
```xml
├── MapStruct (1.6.0)              - Mapeo de DTOs
└── SpringDoc OpenAPI (2.6.0)      - Documentación API
```

#### Pruebas
```xml
├── spring-boot-starter-test
├── spring-security-test
└── testcontainers (JUnit, PostgreSQL)
```

### Frontend (React)

#### Framework Principal
```json
Ecosistema React:
├── react (18.2.0)
├── react-dom (18.2.0)
└── react-scripts (5.0.1)
```

#### Framework de Interfaz
```json
Bootstrap:
├── bootstrap (5.3.8)
├── bootstrap-icons (1.13.1)
└── react-bootstrap (2.10.10)
```

#### Enrutamiento y Estado
```json
├── react-router-dom (6.15.0)      - Navegación
└── (Context API nativo)            - Estado global
```

#### HTTP y Datos
```json
├── axios (1.5.0)                   - Cliente HTTP
├── chart.js (4.5.1)                - Gráficos
└── react-chartjs-2 (5.3.0)         - Integración gráficos
```

#### Pruebas
```json
Librería de Testing:
├── @testing-library/react
├── @testing-library/jest-dom
└── @testing-library/user-event
```

---

## 📊 Métricas de Código

### Resumen General

| Métrica | Backend | Frontend | Total |
|---------|---------|----------|-------|
| **Archivos Fuente** | 39 | 35 | 74 |
| **Archivos de Test** | 2 | ~0 | 2 |
| **Líneas de Código** | 5,180 | 10,822 | 15,002 |
| **Tamaño en Disco** | 59 MB | 357 MB | 416 MB |
| **Promedio líneas/archivo** | 133 | 309 | 203 |

### Distribución de Código

```
Líneas de Código por Capa (Backend):
├── Controllers (API):      ~524 líneas (10%)
├── Services:               ~578 líneas (11%)
├── Domain/Entities:        ~1,052 líneas (20%)
├── Repositories:           ~202 líneas (4%)
├── Common/Config:          ~1,824 líneas (35%)
└── Tests:                  ~1,000 líneas (20%)
```

```
Líneas de Código por Tipo (Frontend):
├── Pages:                  ~6,549 líneas (60%)
├── Components:             ~2,200 líneas (20%)
├── Services:               ~1,073 líneas (10%)
└── Utils/Context:          ~1,000 líneas (10%)
```

### Ratio de Complejidad

| Indicador | Valor | Estado |
|-----------|-------|--------|
| **Backend: Cobertura de Tests** | ~5% | 🔴 Crítico |
| **Frontend: Cobertura de Tests** | 0% | 🔴 Crítico |
| **Backend: Prom. Líneas/Archivo** | 133 | ✅ Bueno |
| **Frontend: Prom. Líneas/Archivo** | 309 | ⚠️ Alto |
| **Módulos Completos** | 2/3 | ⚠️ Medio |

### Indicadores de Calidad

#### ✅ Fortalezas
1. Arquitectura bien definida (Vertical Slice)
2. Separación clara de responsabilidades
3. Uso de tecnologías modernas
4. Documentación inicial completa
5. Estructura de carpetas organizada

#### 🔴 Áreas Críticas
1. **Cobertura de tests**: <5% (objetivo: >70%)
2. **ProfilePage.js**: 825 líneas (objetivo: <300)
3. **Módulo Pedidos**: Incompleto

#### ⚠️ Mejoras Recomendadas
1. Refactorizar componentes grandes (>500 líneas)
2. Agregar tests unitarios e integración
3. Completar módulo de Pedidos
4. Implementar CI/CD
5. Documentación técnica (JavaDoc/JSDoc)

---

## 🎯 Roadmap de Mejoras

### Prioridad ALTA 🔴
- [ ] Implementar suite de tests (objetivo: 70% cobertura)
- [ ] Refactorizar ProfilePage.js (<300 líneas)
- [ ] Completar módulo de Pedidos (API, Service, Repository)

### Prioridad MEDIA 🟡
- [ ] Refactorizar componentes Admin (dividir en sub-componentes)
- [ ] Agregar CI/CD con GitHub Actions
- [ ] Implementar logging estructurado
- [ ] Documentación JavaDoc/JSDoc

### Prioridad BAJA 🟢
- [ ] Optimización de rendimiento
- [ ] Estilo de código automatizado (Prettier, ESLint)
- [ ] Análisis estático de código (SonarQube)
- [ ] Dockerización del proyecto

---

**Última actualización:** 2025-10-29  
**Generado automáticamente por:** Análisis de código estático
