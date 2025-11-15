# Guía de Inicio Rápido

## 📦 Instalación y Ejecución

```bash
# 1. Navegar al directorio del proyecto
cd restaurant-reservations

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start
```

El servidor se iniciará en `http://localhost:4200`

## 🎯 Primeros Pasos

1. **Dashboard**: Al abrir la aplicación, verás el dashboard con estadísticas
2. **Nueva Reserva**: Click en "Nueva Reserva" en el menú lateral
3. **Proceso de Reserva**:
   - Selecciona un restaurante
   - Selecciona una zona
   - Elige fecha y hora
   - Indica cantidad de personas
   - Completa datos del cliente
   - Busca mesa disponible
   - Confirma la reserva

## 📊 Datos Iniciales

El sistema viene con datos de prueba precargados:

### Restaurantes
- La Terraza
- El Jardín

### Zonas (para "La Terraza")
- **Terraza Exterior**: Horarios 12:00, 13:00, 14:00, 20:00, 21:00, 22:00
- **Salón Principal**: Horarios 12:00, 13:00, 14:00, 15:00, 20:00, 21:00, 22:00, 23:00

### Mesas
- Mesa 1 (Terraza Exterior): 2 personas
- Mesa 2 (Terraza Exterior): 4 personas
- Mesa 3 (Terraza Exterior): 6 personas
- Mesa 10 (Salón Principal): 4 personas
- Mesa 11 (Salón Principal): 8 personas

## 🎨 Características Implementadas

### ✅ Funcionalidades Completas
- Pantalla única de reservas
- Dashboard con métricas
- Lista de reservas
- Asignación automática de mesas
- Validaciones en tiempo real
- Persistencia en LocalStorage

### 🚧 Módulos Básicos (Placeholders)
- Gestión de Restaurantes
- Gestión de Zonas
- Gestión de Mesas

Estos módulos tienen la estructura base y pueden expandirse según necesidad.

## 🔧 Estructura del Flujo de Reserva

```
1. Usuario selecciona restaurante
   ↓
2. Se cargan zonas del restaurante
   ↓
3. Usuario selecciona zona
   ↓
4. Se muestran horarios disponibles
   ↓
5. Usuario elige fecha y hora
   ↓
6. Usuario indica cantidad de personas
   ↓
7. Usuario completa datos personales
   ↓
8. Sistema busca mesa disponible
   ↓
9. Si hay mesa: Se muestra para confirmación
   Si no hay: Se muestra mensaje de error
   ↓
10. Usuario confirma y se crea la reserva
```

## 📱 Navegación del Sistema

```
┌─────────────┐
│  Dashboard  │ ← Página inicial
└─────────────┘
      ├── Nueva Reserva (Flujo único)
      ├── Lista de Reservas
      ├── Gestión de Restaurantes
      ├── Gestión de Zonas
      └── Gestión de Mesas
```

## 🎯 Testing Manual

### Crear una Reserva Exitosa
1. Ir a "Nueva Reserva"
2. Seleccionar "La Terraza"
3. Seleccionar "Terraza Exterior"
4. Elegir una fecha futura
5. Seleccionar hora "20:00"
6. Indicar 4 personas
7. Completar datos:
   - Nombre: Juan
   - Apellido: Pérez
   - Teléfono: 1234567890
8. Click en "Buscar Mesa Disponible"
9. Verificar que se asigne la Mesa #2
10. Click en "Confirmar Reserva"

### Verificar Disponibilidad
1. Crear una reserva para Mesa #2
2. Intentar crear otra reserva para el mismo horario
3. Debería asignar automáticamente Mesa #1 o #3

### Validaciones
- Intentar reservar con fecha pasada → Error
- Intentar reservar más personas que la capacidad → Error
- Dejar campos vacíos → Validación de formulario

## 💾 LocalStorage

Los datos se almacenan con las siguientes keys:
- `restaurants`: Lista de restaurantes
- `zonas`: Lista de zonas
- `mesas`: Lista de mesas
- `reservas`: Lista de reservas

Para resetear los datos:
```javascript
// En la consola del navegador
localStorage.clear();
location.reload();
```

## 🎨 Personalización

### Cambiar Colores
Editar `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#tu-color'
    }
  }
}
```

### Modificar Tema de Material
El tema actual es "Azure/Blue". Para cambiarlo, ejecutar:
```bash
ng add @angular/material
```

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 4200 ocupado
```bash
npm start -- --port 4201
```

### Datos no se guardan
- Verificar que LocalStorage esté habilitado en el navegador
- Revisar la consola del navegador para errores

## 📚 Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Angular Material](https://material.angular.io)

## 🚀 Próximos Pasos

Para expandir el sistema, considera implementar:

1. **CRUD completo de Restaurantes**
   - Formulario de creación/edición
   - Tabla con acciones
   - Modal de confirmación de eliminación

2. **CRUD completo de Zonas**
   - Gestión de horarios con chips
   - Asignación a restaurantes
   - Validación de eliminación

3. **CRUD completo de Mesas**
   - Asignación a zonas
   - Capacidad configurable
   - Modal de reasignación de reservas

4. **Mejoras en Dashboard**
   - Gráficos con Chart.js o ng2-charts
   - Filtros de fecha
   - Exportación de datos

5. **Funcionalidades Avanzadas**
   - Búsqueda y filtros en tablas
   - Paginación
   - Notificaciones push
   - Exportar a PDF/Excel
   - Autenticación de usuarios
