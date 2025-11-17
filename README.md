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
