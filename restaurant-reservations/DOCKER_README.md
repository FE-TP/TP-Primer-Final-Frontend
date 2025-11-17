# Guía de Docker para Restaurant Reservations

## Archivos Creados

- **Dockerfile**: Build multi-etapa para producción con Nginx
- **Dockerfile.dev**: Versión de desarrollo con hot-reload
- **docker-compose.yml**: Para desarrollo (por defecto)
- **docker-compose.prod.yml**: Para producción
- **nginx.conf**: Configuración optimizada de Nginx para SPAs
- **.dockerignore**: Archivos a excluir del contexto de Docker

## Comandos Disponibles

### Modo Desarrollo (por defecto)

Con hot-reload, los cambios en el código se reflejan automáticamente:

```bash
# Iniciar en modo desarrollo
docker-compose up

# Con rebuild
docker-compose up --build

# En segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener
docker-compose down
```

La aplicación estará disponible en: http://localhost:4200

### Modo Producción

Build optimizado servido con Nginx:

```bash
# Iniciar en modo producción
docker-compose -f docker-compose.prod.yml up

# Con rebuild
docker-compose -f docker-compose.prod.yml up --build

# En segundo plano
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f app

# Detener
docker-compose -f docker-compose.prod.yml down
```

La aplicación estará disponible en: http://localhost:8080

### Comandos Docker Directos

#### Desarrollo

```bash
# Build
docker build -t restaurant-reservations:dev -f Dockerfile.dev .

# Run
docker run -p 4200:4200 -v ${PWD}/src:/app/src restaurant-reservations:dev
```

#### Producción

```bash
# Build
docker build -t restaurant-reservations:prod .

# Run
docker run -p 8080:80 restaurant-reservations:prod
```

## Estructura de los Dockerfiles

### Dockerfile (Producción)

- **Etapa 1 (build)**: Compila la aplicación Angular
- **Etapa 2 (nginx)**: Sirve los archivos estáticos con Nginx
- Resultado: Imagen ligera (~50MB) optimizada para producción

### Dockerfile.dev (Desarrollo)

- Monta volúmenes para hot-reload
- Servidor de desarrollo de Angular
- Ideal para desarrollo local

## Optimizaciones Incluidas

### Nginx
- Configuración SPA con fallback a index.html
- Cache de assets estáticos (1 año)
- Sin cache para index.html
- Headers de seguridad básicos

### Docker
- Multi-stage build para reducir tamaño
- .dockerignore para excluir archivos innecesarios
- Uso de alpine para imágenes más ligeras
- Separación de archivos compose para dev/prod

## Troubleshooting

### Puerto ocupado

Si el puerto está en uso, modifica el puerto en `docker-compose.yml`:

```yaml
ports:
  - "8081:80"  # Cambiar 8080 por otro puerto
```

### Cambios no se reflejan en desarrollo

```bash
# Reconstruir sin cache
docker-compose build --no-cache
docker-compose up
```

### Ver logs de Nginx (producción)

```bash
docker exec -it restaurant-reservations-prod tail -f /var/log/nginx/access.log
```

## Personalización

### Cambiar puerto de Nginx

Edita `nginx.conf` y cambia `listen 80;` por el puerto deseado.

### Variables de entorno

Para agregar variables de entorno, edita `docker-compose.yml`:

```yaml
environment:
  - API_URL=http://api.example.com
  - NODE_ENV=production
```

## Comandos Útiles

```bash
# Ver imágenes
docker images

# Ver contenedores activos
docker ps

# Ver todos los contenedores
docker ps -a

# Eliminar contenedor
docker rm restaurant-reservations-prod

# Eliminar imagen
docker rmi restaurant-reservations:prod

# Limpiar todo
docker system prune -a
```
