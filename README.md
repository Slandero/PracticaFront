# TelecomPlus Frontend

## Descripción General

**TelecomPlus Frontend** es una aplicación web moderna desarrollada con Next.js 14 que permite gestionar contratos y servicios de telecomunicaciones. El sistema ofrece una interfaz intuitiva para la administración completa del ciclo de vida de contratos, desde su creación hasta su cancelación, con integración completa de servicios asociados.

## Arquitectura y Tecnologías

### Stack Tecnológico

- **Framework**: Next.js 14.0.0 con App Router
- **UI Framework**: React 18.2.0 con TypeScript 5.0
- **Estilos**: Tailwind CSS 3.3.0 + Radix UI Components
- **Estado Global**: Zustand 5.0.8 (manejo reactivo de estado)
- **Cliente HTTP**: Axios 1.12.2 con interceptores
- **Autenticación**: JWT (JSON Web Tokens) con jwt-decode 4.0.0
- **Formularios**: React Hook Form 7.65.0 + Zod 4.1.12 (validación)
- **Iconografía**: Lucide React 0.546.0

### Estructura del Proyecto

```
src/
├── app/                    # Páginas y rutas (App Router)
│   ├── contratos/          # Gestión de contratos
│   │   ├── nuevo/          # Crear contrato
│   │   ├── [id]/           # Detalle/Editar contrato
│   │   └── page.tsx        # Lista de contratos
│   ├── services/           # Gestión de servicios
│   │   ├── nuevo/          # Crear servicio
│   │   └── page.tsx        # Lista de servicios
│   ├── dashboard/          # Panel principal
│   ├── login/              # Autenticación
│   ├── register/           # Registro de usuarios
│   └── page.tsx            # Redirección raíz
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── Navigation.tsx      # Barra de navegación
│   ├── ContratosList.tsx   # Lista de contratos
│   ├── ServiciosSelector.tsx # Selector de servicios (pendiente)
│   ├── ErrorBoundary.tsx   # Manejo de errores
│   └── ErrorBoundaryClient.tsx
├── context/                # Context API
│   └── AuthContext.tsx     # Contexto de autenticación
├── services/               # Servicios de API
│   ├── contratoService.ts  # Operaciones CRUD contratos
│   ├── servicioService.ts  # Operaciones CRUD servicios
│   └── api.ts              # Cliente HTTP configurado
├── store/                  # Estado global (Zustand)
│   ├── contratoStore.ts    # Store de contratos
│   └── serviceStore.ts     # Store de servicios
├── types/                  # Definiciones TypeScript
│   └── index.ts            # Interfaces y tipos
└── middleware.ts           # Middleware Next.js (rutas protegidas)
```

## Funcionalidades Principales

### 1. Gestión de Contratos

#### Operaciones CRUD Completas
- **Crear contratos** con validaciones
- **Leer contratos** con paginación y filtros
- **Actualizar contratos** con edición parcial
- **Eliminar contratos** con confirmación

#### Características Avanzadas
- **Búsqueda por número de contrato** (case-insensitive)
- **Filtrado por estado** (Activo, Inactivo, Suspendido, Cancelado)
- **Vinculación de servicios** múltiples por contrato
- **Vista detallada** con servicios asociados
- **Estadísticas en tiempo real** en dashboard

### 2. Gestión de Servicios

#### Operaciones Básicas
- **CRUD completo** de servicios de telecomunicaciones
- **Dos tipos principales**: Internet y Televisión
- **Campos gestionados**: nombre, descripción, precio, tipo
- **Paginación automática** de resultados
- **Filtros por tipo** de servicio

### 3. Sistema de Autenticación

#### Características de Seguridad
- **Registro de usuarios** con validación de datos
- **Login seguro** con email y contraseña
- **JWT almacenado en cookies** (7 días de expiración)
- **Validación automática de tokens** en cada request
- **Rutas protegidas** con middleware Next.js
- **Cierre de sesión automático** al expirar token
- **Redirección automática** a login cuando expira la sesión

### 4. Dashboard Interactivo

#### Información en Tiempo Real
- **Estadísticas de contratos** por estado
- **Conteo total de contratos activos**
- **Navegación rápida** a secciones principales
- **Indicadores visuales** con colores por estado

## Reglas de Negocio y Validaciones

### Validaciones de Contratos

| Campo | Regla | Mensaje de Error |
|-------|-------|------------------|
| **Número de Contrato** | 3-20 caracteres, mayúsculas, números y guiones | "El número de contrato debe tener entre 3 y 20 caracteres" |
| **Fecha de Inicio** | No anterior a hoy | "La fecha de inicio no puede ser anterior a hoy" |
| **Fecha de Fin** | Posterior a fecha de inicio | "La fecha de fin debe ser posterior a la fecha de inicio" |
| **Servicios** | Al menos 1 servicio vinculado | "Debes seleccionar al menos un servicio" |
| **Estados** | Solo valores permitidos | Estados: Activo, Inactivo, Suspendido, Cancelado |
| **Usuario** | Usuario autenticado obligatorio | "Usuario no autenticado" |

### Validaciones de Servicios

| Campo | Regla | Mensaje de Error |
|-------|-------|------------------|
| **Nombre** | 2-100 caracteres, único | "El nombre debe tener entre 2 y 100 caracteres" |
| **Descripción** | 10-500 caracteres | "La descripción debe tener entre 10 y 500 caracteres" |
| **Precio** | Número >= 0 | "El precio debe ser un número mayor o igual a 0" |
| **Tipo** | Solo "Internet" o "Televisión" | "El tipo debe ser 'Internet' o 'Televisión'" |
| **Unicidad** | Nombre único en sistema | "Ya existe un servicio con ese nombre" |

### Validaciones de Autenticación

| Campo | Regla | Mensaje de Error |
|-------|-------|------------------|
| **Email** | Formato válido requerido | "Email inválido" |
| **Contraseña** | Mínimo 6 caracteres | "La contraseña debe tener al menos 6 caracteres" |
| **Token JWT** | Válido y no expirado | "Token inválido o expirado" |
| **Sesión** | Activa durante 7 días | Auto-cierre al expirar |

## Errores Conocidos y Soluciones

### Errores Críticos

<details>
<summary><strong>Error 1: Componente ServiciosSelector no existe</strong></summary>

**Ubicación:** `src/app/contratos/nuevo/page.tsx:14`

**Causa:** Importación de componente `ServiciosSelector.tsx` que no existe en el proyecto.

**Solución:**
```typescript
// Línea actual (causa error):
import ServiciosSelector from '@/components/ServiciosSelector';

// Solución temporal (comentar import):
// import ServiciosSelector from '@/components/ServiciosSelector';

// Solución permanente (crear componente):
// Crear archivo src/components/ServiciosSelector.tsx
```

**Estado:** Pendiente de implementación
</details>

<details>
<summary><strong>Error 2: Servicios no aparecen en detalle de contrato</strong></summary>

**Ubicación:** `src/app/contratos/[id]/page.tsx`

**Causa:** El backend devuelve `servicios_ids` como objetos completos en lugar de solo IDs de cadena.

**Solución:** Modificar lógica para detectar si son objetos y usar directamente:

```typescript
// En src/services/contratoService.ts
getContratoById: async (id: string) => {
  // Agregar parámetro populate
  const response = await api.get(`/contracts/${id}?populate=servicios`);
  return response.data.data;
}

// En src/app/contratos/[id]/page.tsx
useEffect(() => {
  if (contratoData?.servicios_ids) {
    // Detectar si son objetos o strings
    if (typeof contratoData.servicios_ids[0] === 'object') {
      setServicios(contratoData.servicios_ids);
    } else {
      // Filtrar desde serviciosStore
      const serviciosFiltrados = serviciosStore.filter(s =>
        contratoData.servicios_ids.includes(s._id)
      );
      setServicios(serviciosFiltrados);
    }
  }
}, [contratoData]);
```

**Estado:** Solución implementada en desarrollo
</details>

<details>
<summary><strong>Error 3: TypeError: state.contratos is not iterable</strong></summary>

**Ubicación:** `src/store/contratoStore.ts:67`

**Causa:** El estado `contratos` no siempre es un array válido.

**Solución:** Validar con `Array.isArray()` antes de usar spread operator:

```typescript
// Código problemático:
const nuevosContratos = [...state.contratos, nuevoContrato];

// Código corregido:
const contratosActuales = Array.isArray(state.contratos) ? state.contratos : [];
const nuevosContratos = [...contratosActuales, nuevoContrato];
```

**Estado:** Corregido
</details>

<details>
<summary><strong>Error 4: Campo contrato.numero vs contrato.numeroContrato</strong></summary>

**Ubicación:** `src/app/contratos/[id]/page.tsx:122`

**Causa:** Inconsistencia en nomenclatura de campos entre frontend y backend.

**Solución:** Usar siempre `numeroContrato`:

```typescript
// Código incorrecto:
contrato.numero

// Código correcto:
contrato.numeroContrato
```

**Estado:** Identificado en desarrollo
</details>

### Errores de Conectividad

<details>
<summary><strong>Error 5: ERR_CONNECTION_REFUSED</strong></summary>

**Causa:** El servidor backend no está corriendo en el puerto 8000.

**Solución:**
```bash
# Verificar si el backend está corriendo
curl http://localhost:8000/api/health

# Si no responde, iniciar el backend:
cd backend/
npm start  # o el comando correspondiente
```

**Estado:** Error de configuración de entorno
</details>

<details>
<summary><strong>Error 6: net::ERR_NETWORK_CHANGED</strong></summary>

**Causa:** Cambio de red o pérdida temporal de conectividad.

**Solución:**
- Verificar conexión a internet
- Reintentar la operación
- Verificar que el backend sigue corriendo

**Estado:** Error de red del cliente
</details>

<details>
<summary><strong>Error 7: Validación tipo de servicio</strong></summary>

**Ubicación:** `src/app/services/nuevo/page.tsx`

**Causa:** Valor incorrecto en el componente Select.

**Solución:**
```typescript
// Valor incorrecto:
<SelectItem value="Television">Televisión</SelectItem>

// Valor correcto (con tilde):
<SelectItem value="Televisión">Televisión</SelectItem>
```

**Estado:** Corregido
</details>

## Excepciones en Reglas de Negocio

### Excepciones de Datos

<details>
<summary><strong>Excepción 1: Contratos sin servicios en BD</strong></summary>

Aunque la interfaz requiere servicios obligatorios, la base de datos puede contener contratos legacy sin servicios asociados.

**Manejo:** La UI muestra mensaje "No hay servicios asociados" en lugar de fallar.
</details>

<details>
<summary><strong>Excepción 2: Estados personalizados</strong></summary>

La interfaz solo permite 4 estados predefinidos, pero la base de datos puede contener estados legacy no reconocidos.

**Manejo:** Los badges muestran variant "secondary" para estados no reconocidos.
</details>

<details>
<summary><strong>Excepción 3: Formato de fechas ISO</strong></summary>

El frontend envía fechas en formato ISO 8601, pero no hay validación de timezone específica.

**Manejo:** El backend debe parsear correctamente el formato ISO independientemente del timezone del cliente.
</details>

<details>
<summary><strong>Excepción 4: Usuario ID desde token</strong></summary>

El `usuario_id` se extrae del JWT decodificado. Si el token no contiene el campo correcto, falla la creación de contratos.

**Manejo:** No hay validación explícita en la UI - depende completamente del token válido.
</details>

<details>
<summary><strong>Excepción 5: Paginación</strong></summary>

La paginación es manejada completamente por el backend sin validación de parámetros en el frontend.

**Manejo:** Puede causar errores si se pasa `page > totalPages` - el backend debe manejar estos casos.
</details>

<details>
<summary><strong>Excepción 6: Populate de servicios</strong></summary>

El parámetro `?populate=servicios` debe ser soportado por el backend para que aparezcan los servicios asociados.

**Manejo:** Sin este soporte, solo aparecen los IDs de servicios sin información detallada.
</details>

## Configuración y Variables de Entorno

### Configuración Actual

**API Base URL:**
- **Valor:** `http://localhost:8000/api`
- **Ubicación:** `src/services/api.ts:4`
- **Estado:** Hardcoded (no usa variables de entorno)

**Recomendación:** Usar variable de entorno `NEXT_PUBLIC_API_URL`

**Puertos de Desarrollo:**
- **Frontend:** 3000 (`npm run dev`)
- **Backend:** 8000 (servidor API)

**Cookies de Autenticación:**
- **`token`:** JWT de autenticación (expira en 7 días)
- **`user`:** Datos del usuario en formato JSON (expira en 7 días)

## Instalación y Uso

### Requisitos Previos

- **Node.js:** Versión 18 o superior
- **npm/yarn:** Para gestión de paquetes
- **Backend API:** Corriendo en puerto 8000

### Comandos de Desarrollo

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
# Servidor corriendo en http://localhost:3000

# 3. Build de producción
npm run build

# 4. Iniciar producción
npm start

# 5. Ejecutar linter
npm run lint
```

### Flujo de Uso Típico

1. **Registro inicial** → Navegar a `/register`
2. **Inicio de sesión** → Ir a `/login` con credenciales
3. **Crear servicios base** → `/services/nuevo` (Internet/Televisión)
4. **Crear contratos** → `/contratos/nuevo` (vincular servicios)
5. **Ver estadísticas** → Dashboard con métricas
6. **Gestionar contratos** → `/contratos` (filtrar, editar, eliminar)

## Problemas de Integración Frontend-Backend

### Inconsistencias Identificadas

<details>
<summary><strong>1. Nombres de campos inconsistentes</strong></summary>

**Problema:** El frontend usa `numeroContrato` pero el backend podría usar `numero`.

**Solución:** Estandarizar en `numeroContrato` en toda la aplicación.
</details>

<details>
<summary><strong>2. Formato de respuestas paginadas</strong></summary>

**Problema:** El frontend asume estructura específica: `{ success, data: { contracts/services, pagination } }`

**Solución:** El backend debe seguir estrictamente este formato.
</details>

<details>
<summary><strong>3. Manejo de errores</strong></summary>

**Problema:** El frontend espera `{ success: false, message, errors: [] }`

**Solución:** El backend debe devolver errores en array para mostrar mensajes específicos.
</details>

<details>
<summary><strong>4. Populate de relaciones</strong></summary>

**Problema:** Sin `?populate=servicios`, solo vienen IDs sin datos.

**Solución:** Implementar populate en endpoints del backend.
</details>

<details>
<summary><strong>5. Validación de tipos de servicio</strong></summary>

**Problema:** Valores deben ser exactamente "Internet" y "Televisión" (case-sensitive).

**Solución:** Validación estricta en backend con mensajes claros.
</details>

## Debugging y Logs

### Logs de Desarrollo

El proyecto incluye extensos `console.log` para debugging:

- **`src/services/api.ts`:** Logs de autenticación y requests HTTP
- **`src/store/contratoStore.ts`:** Logs de operaciones CRUD de contratos
- **`src/store/serviceStore.ts`:** Logs de operaciones CRUD de servicios
- **`src/context/AuthContext.tsx`:** Logs de flujo de autenticación

### Ejemplo de Logs en Consola

```javascript
// Logs de autenticación
Token encontrado: Sí
Token expira en: Sat Oct 25 2025 23:57:50 GMT-0600
Token agregado a la request

// Logs de contratos
Contrato obtenido: { _id: '...', numeroContrato: 'CONT-2025-88' }
Servicios vinculados encontrados: []

// Logs de servicios
Servicios en el store: (10) [...]
Paginación: { currentPage: 1, totalPages: 2, ... }
```

**Nota:** En producción, estos logs deben ser removidos o reemplazados por un sistema de logging apropiado.

## Mejoras Pendientes

### Prioridades Altas

1. **Crear componente `ServiciosSelector.tsx`**
   - Implementar selector visual de servicios con checkboxes
   - Soporte para carga diferida y estados de error

2. **Variables de entorno para configuración**
   - `NEXT_PUBLIC_API_URL` para URL del backend
   - `NEXT_PUBLIC_APP_ENV` para ambiente (dev/prod)

3. **Sistema robusto de manejo de errores**
   - Toast notifications en lugar de alerts
   - Retry automático para errores de red

### Mejoras Técnicas

4. **Tests automatizados**
   - Tests unitarios para stores y utilidades
   - Tests de integración para flujos completos

5. **Refresh token automático**
   - Renovación automática de JWT antes de expirar
   - Mejor manejo de sesiones largas

6. **Validación avanzada de fechas**
   - Soporte completo de timezones
   - Validación de fechas en horario comercial

7. **Estados de carga consistentes**
   - Skeleton loaders en todas las páginas
   - Indicadores de progreso en operaciones asíncronas

8. **Optimistic updates en Zustand**
   - Actualizaciones inmediatas en UI
   - Rollback en caso de error

9. **Limpieza de logs de consola**
   - Logger estructurado para producción
   - Niveles de log configurables

10. **Documentación de API**
    - Especificación OpenAPI/Swagger
    - Documentación automática de endpoints

## Soporte y Contacto

Para reportar bugs o solicitar mejoras, revisar la sección de [Errores Conocidos](#errores-conocidos-y-soluciones) o crear un issue en el repositorio.

---

**Última actualización:** Octubre 2025
**Versión:** 0.1.0
**Estado:** Desarrollo activo
