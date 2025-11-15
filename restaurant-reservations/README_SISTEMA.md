# Sistema de Reservas de Mesas - Angular 18

Sistema completo de gestión de reservas de mesas para restaurantes desarrollado con Angular 18, TypeScript, Tailwind CSS y Angular Material.

## 🚀 Características

- **Pantalla única de reservas**: Flujo completo de reserva en una sola vista intuitiva
- **CRUD completo**: Gestión de Restaurantes, Zonas, Mesas y Reservas
- **Asignación automática de mesas**: Algoritmo inteligente que asigna la mesa más adecuada
- **Validaciones en tiempo real**: Control de disponibilidad, capacidad y horarios
- **Dashboard con métricas**: Visualización de estadísticas clave
- **Persistencia en LocalStorage**: Datos almacenados localmente
- **Diseño responsive**: Adaptado para diferentes dispositivos

## 📋 Requisitos

- Node.js 18+ 
- npm 9+

## 🛠️ Instalación

```bash
cd restaurant-reservations
npm install
```

## 🎯 Ejecución

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
src/app/
├── models/              # Interfaces y tipos
│   ├── restaurant.model.ts
│   ├── zona.model.ts
│   ├── mesa.model.ts
│   └── reserva.model.ts
├── services/            # Servicios de negocio
│   ├── storage.service.ts
│   ├── restaurant.service.ts
│   ├── zones.service.ts
│   ├── mesas.service.ts
│   └── reservas.service.ts
├── features/            # Componentes por módulo
│   ├── dashboard/
│   ├── reservations/
│   │   ├── reservation-page/
│   │   └── reservation-list/
│   ├── restaurants/
│   ├── zones/
│   └── mesas/
└── shared/             # Componentes compartidos
    └── layout/
        ├── sidebar/
        └── header/
```

## 🎨 Tecnologías Utilizadas

- **Angular 18**: Framework principal
- **TypeScript**: Lenguaje de programación
- **Tailwind CSS**: Framework de utilidades CSS
- **Angular Material**: Componentes UI
- **LocalStorage**: Persistencia de datos

## 📝 Funcionalidades Principales

### Pantalla de Nueva Reserva

La pantalla de reservas incluye todo el flujo en una única vista:

1. **Selección de Restaurante**: Dropdown con restaurantes activos
2. **Selección de Zona**: Filtrada por restaurante seleccionado
3. **Fecha y Hora**: Datepicker y selección de horarios disponibles
4. **Cantidad de Personas**: Control con validación de capacidad
5. **Datos del Cliente**: Nombre, apellido y teléfono
6. **Búsqueda de Mesa**: Algoritmo de asignación automática
7. **Resumen**: Vista previa de todos los datos
8. **Confirmación**: Creación de la reserva

### Algoritmo de Asignación de Mesas

```typescript
function findAvailableTable(zonaId, fecha, hora, cantidadPersonas) {
  mesasActivas = todas las mesas activas de la zona
  mesasValidas = mesasActivas con capacidad >= cantidadPersonas
  mesasDisponibles = mesasValidas sin reservas confirmadas en ese horario
  ordenar por capacidad ascendente
  return la mesa más ajustada
}
```

### Reglas de Negocio

- ✅ No se puede eliminar entidades con reservas activas
- ✅ Validación de capacidad máxima por zona
- ✅ Validación de fechas pasadas
- ✅ Validación de horarios disponibles
- ✅ Reasignación automática de reservas (cuando es posible)
- ✅ Soft-delete de entidades (activo: false)

## 🎯 Datos de Prueba

El sistema se inicializa con datos de ejemplo:

- 2 Restaurantes
- 2 Zonas por restaurante
- 5 Mesas con diferentes capacidades
- Horarios predefinidos por zona

## 📊 Estados de Reserva

- **CONFIRMADA**: Reserva activa
- **CANCELADA**: Reserva cancelada
- **COMPLETADA**: Reserva finalizada

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm start

# Build de producción
npm run build

# Tests
npm test

# Linting
npm run lint
```

## 📱 Navegación

- `/dashboard` - Dashboard principal con métricas
- `/reservations/new` - Nueva reserva (pantalla única)
- `/reservations` - Lista de reservas
- `/restaurants` - Gestión de restaurantes
- `/zones` - Gestión de zonas
- `/mesas` - Gestión de mesas

## 🎨 Personalización

Los colores y estilos pueden personalizarse en:
- `tailwind.config.js` - Configuración de Tailwind
- `src/styles.css` - Estilos globales
- Angular Material usa el tema "Azure/Blue"

## 📄 Licencia

Este proyecto es parte de un trabajo práctico académico.

## 👨‍💻 Desarrollo

Proyecto desarrollado con Angular 18 siguiendo las mejores prácticas:
- Componentes standalone
- Inyección de dependencias
- Reactive Forms
- TypeScript estricto
- Arquitectura modular
