<!-- 2dc61c56-cf5d-4d29-abeb-eaec2128f140 8efa2f94-a156-4efd-b8d5-9f47f59d51f5 -->
# Plan: Mostrar Servicios Vinculados a Contratos

## Problema Identificado

En la página de detalle del contrato (`src/app/contratos/[id]/page.tsx`) no aparecen los servicios vinculados. Hay varios problemas:

1. **Error de mapeo de campo**: En la línea 122 se usa `contrato.numero` pero debería ser `contrato.numeroContrato`
2. **Servicios no poblados**: El backend probablemente devuelve solo `servicios_ids` (array de IDs) en lugar de `servicios` (array de objetos completos)
3. **Lógica incorrecta**: El código espera `contrato.servicios` pero no maneja el caso cuando solo vienen IDs

## Solución

### 1. Corregir el campo del número de contrato

**Archivo:** `src/app/contratos/[id]/page.tsx` - Línea 122

```typescript
// ❌ Incorrecto:
<p className="mt-1 text-lg font-semibold text-gray-900">{contrato.numero}</p>

// ✅ Correcto:
<p className="mt-1 text-lg font-semibold text-gray-900">{contrato.numeroContrato}</p>
```

### 2. Modificar el servicio para usar populate en el backend

**Archivo:** `src/services/contratoSevice.ts` - Línea 40-42

Agregar parámetro `populate` para que el backend devuelva los servicios completos:

```typescript
async getContratoById(id: string): Promise<Contrato> {
  const response = await api.get<ApiResponse<Contrato>>(`/contracts/${id}?populate=servicios`);
  console.log('📋 Contrato obtenido con servicios:', response.data.data);
  return response.data.data;
}
```

### 3. Mejorar la lógica de carga de servicios en la página de detalle

**Archivo:** `src/app/contratos/[id]/page.tsx` - Líneas 27-52

Opciones de implementación:

**Opción A: Si el backend soporta populate** (Recomendado)
- Usar el parámetro `populate=servicios` en la consulta
- El backend devolverá `servicios` como array de objetos completos

**Opción B: Si el backend NO soporta populate**
- Cargar todos los servicios del store
- Filtrar los servicios que coincidan con los IDs en `servicios_ids`

```typescript
// Lógica mejorada:
try {
  const serviciosData = await fetchServicios();
  const contratoData = await getContratoById(id);
  setContrato(contratoData);
  
  console.log('📋 Contrato cargado:', contratoData);
  console.log('🔢 Servicios IDs:', contratoData.servicios_ids);
  console.log('📦 Servicios completos:', contratoData.servicios);
  
  // Si el backend devuelve servicios poblados
  if (contratoData.servicios && Array.isArray(contratoData.servicios)) {
    setServicios(contratoData.servicios);
  } 
  // Si solo tenemos IDs, buscar los servicios en el store
  else if (contratoData.servicios_ids && Array.isArray(contratoData.servicios_ids)) {
    const serviciosStore = useServicioStore.getState().servicios;
    const serviciosVinculados = serviciosStore.filter(s => 
      contratoData.servicios_ids.includes(s._id)
    );
    setServicios(serviciosVinculados);
  }
} catch (err: any) {
  setError(err.message || 'Error al cargar datos');
}
```

### 4. Agregar logging para debugging

Agregar console.logs para diagnosticar qué datos llegan del backend:

```typescript
console.log('📋 Estructura del contrato:', JSON.stringify(contratoData, null, 2));
console.log('🔢 servicios_ids:', contratoData.servicios_ids);
console.log('📦 servicios:', contratoData.servicios); 
```

## Verificación del Backend

Es importante verificar que el backend devuelva los datos correctamente. El endpoint `/contracts/:id` debería:

1. **Sin populate**: Devolver `servicios_ids` como array de strings
2. **Con populate**: Devolver `servicios` como array de objetos completos de tipo `Servicio`

Ejemplo de respuesta esperada con populate:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "numeroContrato": "CONT-001",
    "servicios_ids": ["id1", "id2"],
    "servicios": [
      { "_id": "id1", "nombre": "Internet", "precio": 50, ... },
      { "_id": "id2", "nombre": "TV", "precio": 30, ... }
    ]
  }
}
```

## Archivos a Modificar

1. **`src/app/contratos/[id]/page.tsx`** - Corregir campo y lógica de carga
2. **`src/services/contratoSevice.ts`** - Agregar populate en getContratoById

## Resultado Esperado

Después de estos cambios:
- ✅ El número de contrato se muestra correctamente
- ✅ Los servicios vinculados aparecen en la tarjeta lateral
- ✅ Se muestra el nombre, descripción, precio y tipo de cada servicio
- ✅ Si no hay servicios, se muestra "No hay servicios asociados"

### To-dos

- [ ] Corregir el campo contrato.numero a contrato.numeroContrato en la página de detalle
- [ ] Agregar parámetro populate=servicios en getContratoById del servicio
- [ ] Mejorar la lógica de carga de servicios para manejar tanto servicios poblados como IDs
- [ ] Agregar console.logs para diagnosticar qué datos llegan del backend