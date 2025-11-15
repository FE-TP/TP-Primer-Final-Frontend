Genera un sistema completo de reservas de mesas para restaurantes en Angular 18, siguiendo los siguientes requisitos:

- Usar Angular, TypeScript, Tailwind CSS y Angular Material.
- Persistencia en LocalStorage.
- CRUD completo para Restaurantes, Zonas, Mesas y Reservas.
- Generar una pantalla única para hacer reservas (sin wizard).
- La pantalla de reserva debe incluir:
  * Selección de restaurante
  * Selección de zona
  * Fecha (datepicker)
  * Horario (chips)
  * Cantidad de personas (validación de capacidad)
  * Datos del cliente
  * Botón para buscar mesa disponible
  * Resumen y asignación automática de mesa
  * Botón Confirmar reserva (solo si hay mesa disponible)
- Implementar todas las reglas de negocio de eliminación, validación y asignación automática.
- Incluir dashboard con métricas y gráficos.
- Crear modales para eliminaciones seguras (restaurantes, zonas, mesas).
- Utilizar Angular Material para formularios, selects, tabla, modales y datepicker.
- Utilizar Tailwind para layout, grid y responsive design.
- Mantener un diseño profesional, limpio y consistente.

Sistema Completo de Reservas de Mesas – Angular + Tailwind + Angular Material

Genera un sistema completo de gestión de reservas de mesas para restaurantes con:

Angular 18

TypeScript

Tailwind CSS

Angular Material

Persistencia en LocalStorage

Arquitectura modular profesional

Pantalla única de reservas (sin wizard)

La pantalla de reservas debe contener todo el flujo en una única vista intuitiva y dinámica.

📋 Modelo de datos del sistema (interfaces)
Restaurant
export interface Restaurant {
  id: string;
  nombre: string;
  activo: boolean;
}

Zona
export interface Zona {
  id: string;
  nombre: string;
  restauranteId: string;
  horariosDisponibles: string[];
  activo: boolean;
}

Mesa
export interface Mesa {
  id: string;
  numero: string;
  capacidad: number;
  zonaId: string;
  restauranteId: string;
  activo: boolean;
}

Reserva
export type ReservaStatus = 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';

export interface Reserva {
  id: string;
  fecha: string;
  hora: string;
  cantidadPersonas: number;
  mesaId: string | null;
  nombreCliente: string;
  apellidoCliente: string;
  telefono: string;
  restauranteId: string;
  zonaId: string;
  status: ReservaStatus;
}

🧠 Reglas de negocio (actualizadas con flujo en una sola pantalla)
✔️ 1. Validaciones de disponibilidad

La pantalla de reserva debe validar en tiempo real:

Filtrar automáticamente zonas activas del restaurante elegido

Filtrar horarios solo de la zona elegida

Validar que fecha no sea pasada

Al elegir:

restaurante

zona

fecha

hora

cantidad de personas

… el sistema debe buscar automáticamente las mesas disponibles usando el algoritmo:

function findAvailableTable(zonaId, fecha, hora, cantidad) {
  mesasActivas = todas las mesas activas de la zona
  mesasValidas = mesasActivas con capacidad >= cantidad
  mesasDisponibles = mesasValidas sin reservas confirmadas en ese horario
  ordenar por capacidad ascendente
  return la mesa más ajustada
}


Si no hay disponibilidad → mostrar alerta roja:
“No hay mesas disponibles para esta combinación de fecha/hora/personas.”

✔️ 2. Validación de cantidad de personas

No permitir números menores a 1.

No permitir números mayores a la capacidad máxima de la zona.

Mostrar advertencia si excede.

✔️ 3. Reglas de eliminación (CRUD)

Las reglas de negocio generales no cambian:

❌ No se puede eliminar:

Un restaurante con zonas/mesas que tengan reservas activas.

Una zona con mesas que tengan reservas activas.

Una mesa con reservas activas.

✔️ Sí se puede eliminar:

Si no tiene reservas activas → soft-delete (activo=false)

Si tiene reservas activas → mostrar modal:

Reasignar reservas automáticamente (si es posible)

Cancelar reservas afectadas

Cancelar operación

✔️ 4. Reglas para crear reserva en una sola pantalla

Debe confirmarse solo cuando:

Restaurante seleccionado

Zona seleccionada

Fecha válida

Hora válida para esa zona

Cantidad de personas válida

Datos personales completos

Existe una mesa disponible

🧩 Pantalla Única de Reserva (detallado para UI)

La pantalla debe contener secciones dinámicas:

⭐ Sección 1: Selección de Restaurante

Select Angular Material

Mostrar solo restaurantes activos

⭐ Sección 2: Selección de Zona

Select filtrado por restaurante

Mostrar solo zonas activas

Mostrar horarios disponibles (chips o badges)

⭐ Sección 3: Selección de Fecha

Datepicker Material

Deshabilitar fechas pasadas

⭐ Sección 4: Selección de Hora

Mostrar horarios de la zona seleccionada

Deshabilitar horarios pasados si fecha es hoy

⭐ Sección 5: Cantidad de Personas

Input number con botones +/−

Validar capacidad máxima

Mostrar capacidad máxima disponible bajo el input

⭐ Sección 6: Datos del Cliente

Nombre

Apellido

Teléfono

Campos Material con validación

⭐ Sección 7: Resumen + Asignación de Mesa

Mostrar todos los datos seleccionados

Botón “Buscar Mesa Disponible”

Mostrar mesa asignada:

Mesa #12 (capacidad: 4 personas)


Si no hay disponibilidad → mensaje rojo.

⭐ Sección 8: Confirmar Reserva

Botón deshabilitado hasta que haya mesa asignada

Al confirmar:

Guardar reserva en LocalStorage

Mostrar snackbar verde:
"Reserva confirmada. Mesa asignada: X"

🖥️ Pantallas adicionales del sistema

Generar (para Angular y Figma):

🔹 Dashboard

Estadísticas

Gráficos (reservas por día/restaurante/ocupación)

🔹 CRUD Restaurantes

Lista

Form

Modal de eliminación segura

🔹 CRUD Zonas

Lista por restaurante

Form

Gestión de horarios (chips)

Eliminación segura

🔹 CRUD Mesas

Lista por zona

Form

Eliminación con reasignación o cancelación

🔹 Lista de Reservas

Tabla Material con filtros por:

restaurante

zona

fecha

estado

Acciones:

cancelar

completar

ver detalles

📦 Servicios Angular Obligatorios
RestaurantService

CRUD + soft-delete

canDeleteRestaurant()

ZonesService

getByRestaurant

CRUD

addHorario/removeHorario

canDeleteZone()

MesasService

getByZona

CRUD

canDeleteMesa()

ReservasService

create

auto-assign table

cancel

complete

getByFilters

StorageService

Wrapper de LocalStorage

🗂️ Estructura de carpetas sugerida
/features
  /reservations
    - reservation-page.component.ts
    - reservation-page.component.html
    - reservation-page.component.css

🎨 Estilo Visual Angular + Tailwind

Layout tipo dashboard

Sidebar lateral

Header superior

Tarjetas Material para secciones