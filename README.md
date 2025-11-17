# Primer Final Front-End: Sistema de Reservas de Mesas

## Integrantes del Equipo

- Fleitas Cáceres, Fernando David
- Figueredo Rosa, Elias Jesus
- Paredes Pérez, Atilio Sebastián
- Ramírez Dure, José Gabriel
- Vargas Florentín, Lucas Jesús Elias

## Puesta en marcha

```bash
cd restaurant-reservations
```

```bash
docker compose up --build -d
```

```bash
docker compose stop
```

## Features

- Administración de Restaurantes
- Administración de Zonas
- Administración de Mesas
- Configuración de Horarios
- Registro de Reservas
- Listado de Reservas

## Recursos de IA/Promps utilizados para agilizar el proyecto

- ChatGpt

```bash
Quiero que generes código y estructura de un proyecto Angular cumpliendo estrictamente con este Trabajo Práctico de la materia Electiva Programación Web – Frontend.
El objetivo es implementar un frontend completo para un Sistema de Reservas de Mesas en Restaurantes utilizando Angular, con datos almacenados en memoria local (LocalStorage) y sin utilizar APIs externas.

A continuación te doy el contexto completo del TP y luego los requerimientos de aceptación que deben cumplirse en su totalidad. Deseo que tu respuesta se base exclusivamente en estos puntos, sin agregar requisitos no solicitados.
El trabajo práctico consiste en desarrollar un frontend en Angular que permita gestionar restaurantes, zonas, mesas y reservas. No se usará backend real; toda la persistencia debe hacerse en memoria local, por ejemplo con LocalStorage. También se admite usar JSON Server o Firebase, pero no es obligatorio.

El proyecto será evaluado en un primer final, pesa el 50% de la nota total y debe incluir un manual de implementación. El repositorio final debe ser enviado al profesor vía GitHub o GitLab. La interfaz debe ser clara, responsive y coherente con la temática del sistema.

El dominio del problema incluye:

Restaurantes

Zonas o ambientes dentro de cada restaurante

Mesas dentro de cada zona

Configuración de horarios de reserva por zona

Registro y consulta de reservas

El sistema debe permitir realizar el flujo completo de reserva: elegir restaurante, zona, fecha, horario, cantidad de personas y datos del cliente. Debe asignarse automáticamente la mesa disponible más adecuada según capacidad y disponibilidad real.
Requerimientos de Aceptación

A continuación están los requisitos formales que tu respuesta debe tener en cuenta al generar el código, la estructura, los componentes, servicios, modelos y lógica del sistema.

1) Administración de Restaurantes

Debe existir un CRUD completo de restaurantes.

Campos obligatorios:

id

nombre

Debe permitir agregar, editar y eliminar restaurantes.

Los datos se almacenan en LocalStorage.

2) Administración de Zonas

Cada restaurante puede tener múltiples zonas o ambientes.

Campos obligatorios:

id

nombre

restaurante al que pertenece

La interfaz debe mostrar únicamente las zonas del restaurante seleccionado.

CRUD completo de zonas.

3) Administración de Mesas

Cada zona posee varias mesas.

Campos obligatorios:

id

número de mesa

capacidad

zona a la que pertenece

La creación de una mesa debe permitir elegir un restaurante y luego filtrar las zonas de ese restaurante.

CRUD completo de mesas.

4) Configuración de Horarios de Reserva por Zona

Cada zona debe tener su propia lista de horarios posibles de reserva.

Debe permitirse agregar, modificar o eliminar horarios para cada zona.

Los horarios pueden variar entre restaurantes y entre zonas.

5) Registro de Reservas

El flujo requerido es:

Seleccionar restaurante

Seleccionar zona

Seleccionar fecha

Seleccionar uno de los horarios disponibles de esa zona

Ingresar cantidad de personas

Ingresar datos del cliente (nombre, apellido, teléfono)

Confirmar la reserva

Al confirmar, el sistema debe:

Verificar disponibilidad real de mesas para esa zona, fecha y hora.

Considerar la capacidad mínima según la cantidad de personas.

Asegurar que la mesa no esté reservada en ese mismo horario.

Elegir automáticamente la mesa más adecuada entre las disponibles.

Registrar la reserva solo si existe una mesa válida.

Estructura mínima de una reserva:

id

fecha

hora

cantidadPersonas

idMesaAsignada

nombre

apellido

telefono

6) Listado de Reservas

Debe existir una pantalla que permita consultar las reservas filtrando por:

restaurante

zona

fecha

Qué quiero que hagas con este prompt

Con toda esta información, generame:

La estructura de carpetas recomendada del proyecto.

Los modelos en TypeScript para cada entidad.

Los servicios para manejar LocalStorage, incluyendo lógica de asignación automática de mesas.

Los componentes necesarios para cada administración (restaurantes, zonas, mesas, horarios, reservas, listado).

Formularios reactivos, validaciones y manejo de estado.

Ejemplos de código de componentes, servicios y helpers.

Buenas prácticas de Angular (routing modular, servicios compartidos, tipado fuerte, etc.).

Opcionalmente, una propuesta ligera de diseño responsive.

No inventes nuevos requisitos. Respeta exactamente el enunciado anterior.
```

- ChatGpt

```bash
  al crear una nueva reserva en 3. Fecha y Hora, luego de seleccionar la fecha y hora, debe permitir ingresar un input de entero que represente las horas
  a reservar, ejemplo fecha tal, hora 15:00 hs cantidad de horas 4, entonces al buscar reservas debe evaluar si existe para esas 4 horas una mesa, de lugar
  de solo permitir reservar 1 hora, o puede ser tambien que sea otro selector de hora salida en lugar de un input para que sea mas coherente y luego validar,
  puedes agregar ese nueva funcionalidad.
  Requisito de aceptacion:
  que en una misma reserva se permita reservar mas de 1 hora, y que valide la disponibilidad de las mismas correctamente.
  que en la tabla de reservas tambien figure el horario de salida, ej si entra a las 15:00hs y reserva 1h, entonces hora de salida va ser 16:00 hs
```

- Claude 4.5

```bash
listo, ahroa al crear una nueva reserva en 3. Fecha y Hora, luego de seleccionar la fecha y hora, debe permitir ingresar un input de entero que represente las horas a reservar, ejemplo fecha tal, hora 15:00 hs cantidad de horas 4, entonces al buscar reservas debe evaluar si existe para esas 4 horas una mesa, de lugar de solo permitir reservar 1 hora, o puede ser tambien que sea otro selector de hora salida en lugar de un input para que sea mas coherente y luego validar, puedes agregar ese nueva funcionalidad?
Requisito de aceptacion:
- que en una misma reserva se permita reservar mas de 1 hora, y que valide la disponibilidad de las mismas correctamente.
- que en la tabla de reservas tambien figure el horario de salida, ej si entra a las 15:00hs y reserva 1h, entonces hora de salida va ser 16:00 hs
```

* Claude 4.5 (Contexto para copilot)

  ```
  # Prompt Inicial para Desarrollo con Copilot

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

  ## Modelo de datos del sistema (interfaces)

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

  ## Reglas de negocio (actualizadas con flujo en una sola pantalla)

  ### 1. Validaciones de disponibilidad

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
  "No hay mesas disponibles para esta combinación de fecha/hora/personas."

  ### 2. Validación de cantidad de personas

  No permitir números menores a 1.

  No permitir números mayores a la capacidad máxima de la zona.

  Mostrar advertencia si excede.

  ### 3. Reglas de eliminación (CRUD)

  Las reglas de negocio generales no cambian:

  No se puede eliminar:

  Un restaurante con zonas/mesas que tengan reservas activas.

  Una zona con mesas que tengan reservas activas.

  Una mesa con reservas activas.

  Sí se puede eliminar:

  Si no tiene reservas activas → soft-delete (activo=false)

  Si tiene reservas activas → mostrar modal:

  Reasignar reservas automáticamente (si es posible)

  Cancelar reservas afectadas

  Cancelar operación

  ### 4. Reglas para crear reserva en una sola pantalla

  Debe confirmarse solo cuando:

  Restaurante seleccionado

  Zona seleccionada

  Fecha válida

  Hora válida para esa zona

  Cantidad de personas válida

  Datos personales completos

  Existe una mesa disponible

  ## Pantalla Única de Reserva (detallado para UI)

  La pantalla debe contener secciones dinámicas:

  ### Sección 1: Selección de Restaurante

  Select Angular Material

  Mostrar solo restaurantes activos

  ### Sección 2: Selección de Zona

  Select filtrado por restaurante

  Mostrar solo zonas activas

  Mostrar horarios disponibles (chips o badges)

  ### Sección 3: Selección de Fecha

  Datepicker Material

  Deshabilitar fechas pasadas

  ### Sección 4: Selección de Hora

  Mostrar horarios de la zona seleccionada

  Deshabilitar horarios pasados si fecha es hoy

  ### Sección 5: Cantidad de Personas

  Input number con botones +/−

  Validar capacidad máxima

  Mostrar capacidad máxima disponible bajo el input

  ### Sección 6: Datos del Cliente

  Nombre

  Apellido

  Teléfono

  Campos Material con validación

  ### Sección 7: Resumen + Asignación de Mesa

  Mostrar todos los datos seleccionados

  Botón “Buscar Mesa Disponible”

  Mostrar mesa asignada:

  Mesa #12 (capacidad: 4 personas)

  Si no hay disponibilidad → mensaje rojo.

  ### Sección 8: Confirmar Reserva

  Botón deshabilitado hasta que haya mesa asignada

  Al confirmar:

  Guardar reserva en LocalStorage

  Mostrar snackbar verde:
  "Reserva confirmada. Mesa asignada: X"

  ## Pantallas adicionales del sistema

  Generar (para Angular y Figma):

  ### Dashboard

  Estadísticas

  Gráficos (reservas por día/restaurante/ocupación)

  ### CRUD Restaurantes

  Lista

  Form

  Modal de eliminación segura

  ### CRUD Zonas

  Lista por restaurante

  Form

  Gestión de horarios (chips)

  Eliminación segura

  ### CRUD Mesas

  Lista por zona

  Form

  Eliminación con reasignación o cancelación

  ### Lista de Reservas

  Tabla Material con filtros por:

  restaurante

  zona

  fecha

  estado

  Acciones:

  cancelar

  completar

  ver detalles

  ## Servicios Angular Obligatorios

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

  ## Estructura de carpetas sugerida

  /features
    /reservations
      - reservation-page.component.ts
      - reservation-page.component.html
      - reservation-page.component.css

  ## Estilo Visual Angular + Tailwind

  Layout tipo dashboard

  Sidebar lateral

  Header superior

  Tarjetas Material para secciones
  ```
