# Versiones autoalojadas {#self-hosted-releases}

Esta sección documenta el flujo de trabajo de CI/CD para la solución autohospedada de ForwardEmail y explica cómo se crean, publican e implementan las imágenes de Docker.

## Tabla de contenido {#table-of-contents}

* [Descripción general](#overview)
* [Flujo de trabajo de CI/CD](#cicd-workflow)
  * [Flujo de trabajo de acciones de GitHub](#github-actions-workflow)
  * [Estructura de la imagen de Docker](#docker-image-structure)
* [Proceso de implementación](#deployment-process)
  * [Instalación](#installation)
  * [Configuración de Docker Compose](#docker-compose-configuration)
* [Funciones de mantenimiento](#maintenance-features)
  * [Actualizaciones automáticas](#automatic-updates)
  * [Copia de seguridad y restauración](#backup-and-restore)
  * [Renovación de certificado](#certificate-renewal)
* [Control de versiones](#versioning)
* [Acceso a imágenes](#accessing-images)
* [Contribuyendo](#contributing)

## Descripción general {#overview}

La solución autoalojada de ForwardEmail utiliza GitHub Actions para generar y publicar automáticamente imágenes de Docker cada vez que se crea una nueva versión. Estas imágenes están disponibles para que los usuarios las implementen en sus propios servidores mediante el script de configuración proporcionado.

> \[!NOTE]
> También existen nuestros [blog autoalojado](https://forwardemail.net/blog/docs/self-hosted-solution) y [guía para desarrolladores autoalojados](https://forwardemail.net/self-hosted)
>
> Para ver las versiones paso a paso más detalladas, consulte las guías basadas en [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) o [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Flujo de trabajo de CI/CD {#cicd-workflow}

### Flujo de trabajo de acciones de GitHub {#github-actions-workflow}

El proceso de creación y publicación de imágenes Docker autoalojadas se define en `.github/workflows/docker-image-build-publish.yml`. Este flujo de trabajo:

1. **Disparadores**: Se ejecuta automáticamente al publicar una nueva versión de GitHub.
2. **Entorno**: Se ejecuta en Ubuntu con Node.js 18.20.4.
3. **Proceso de compilación**:
* Verifica el código del repositorio.
* Configura Docker Buildx para compilaciones multiplataforma.
* Inicia sesión en el Registro de Contenedores de GitHub (GHCR).
* Actualiza el esquema para la implementación autoalojada.
* Crea la imagen de Docker usando `self-hosting/Dockerfile-selfhosted`.
* Etiqueta la imagen con la versión de lanzamiento y `latest`.
* Sube las imágenes al Registro de Contenedores de GitHub.

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
```

### Estructura de imagen de Docker {#docker-image-structure}

La imagen de Docker se crea utilizando un enfoque de múltiples etapas definido en `self-hosting/Dockerfile-selfhosted`:

1. **Etapa de compilación**:
* Utiliza Node.js 20 como imagen base
* Establece la variable de entorno `SELF_HOSTED=true`
* Instala las dependencias con pnpm
* Compilación de la aplicación en modo de producción

2. **Etapa final**:
* Utiliza una imagen de Node.js 20 más compacta
* Instala solo las dependencias del sistema necesarias
* Crea los directorios necesarios para el almacenamiento de datos
* Copia la aplicación compilada desde la etapa de compilación

Este enfoque garantiza que la imagen final esté optimizada en cuanto a tamaño y seguridad.

## Proceso de implementación {#deployment-process}

### Instalación {#installation}

Los usuarios pueden implementar la solución autohospedada utilizando el script de configuración proporcionado:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Este guión:

1. Clona el repositorio
2. Configura el entorno
3. Configura los ajustes de DNS y firewall
4. Genera certificados SSL
5. Obtiene las últimas imágenes de Docker
6. Inicia los servicios con Docker Compose

### Configuración de Docker Compose {#docker-compose-configuration}

El archivo `docker-compose-self-hosted.yml` define todos los servicios necesarios para la solución autohospedada:

* **Web**: Interfaz web principal
* **API**: Servidor API para acceso programático
* **SMTP**: Servicio de envío de correo electrónico
* **IMAP/POP3**: Servicios de recuperación de correo electrónico
* **MX**: Servicio de intercambio de correo
* **CalDAV**: Servicio de calendario
* **CardDAV**: Servicio de contactos
* **MongoDB**: Base de datos para almacenar datos de usuario
* **Redis**: Almacén de datos en memoria
* **SQLite**: Base de datos para almacenar correos electrónicos

Cada servicio utiliza la misma imagen de Docker pero con diferentes puntos de entrada, lo que permite una arquitectura modular y simplifica el mantenimiento.

## Funciones de mantenimiento {#maintenance-features}

La solución autohospedada incluye varias funciones de mantenimiento:

### Actualizaciones automáticas {#automatic-updates}

Los usuarios pueden habilitar actualizaciones automáticas que:

* Extraer la última imagen de Docker cada noche
* Reiniciar los servicios con la imagen actualizada
* Registrar el proceso de actualización

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Copia de seguridad y restauración {#backup-and-restore}

La configuración proporciona opciones para:

* Configuración de copias de seguridad periódicas en almacenamiento compatible con S3
* Copias de seguridad de datos de MongoDB, Redis y SQLite
* Restauración de copias de seguridad en caso de fallo

### Renovación de certificado {#certificate-renewal}

Los certificados SSL se gestionan automáticamente con opciones para:

* Generar nuevos certificados durante la configuración
* Renovar certificados cuando sea necesario
* Configurar DKIM para la autenticación de correo electrónico

## Control de versiones {#versioning}

Cada lanzamiento de GitHub crea una nueva imagen de Docker etiquetada con:

1. La versión de lanzamiento específica (p. ej., `v1.0.0`)
2. La etiqueta `latest` para la versión más reciente

Los usuarios pueden elegir utilizar una versión específica para mayor estabilidad o la etiqueta `latest` para obtener siempre las funciones más nuevas.

## Accediendo a imágenes {#accessing-images}

Las imágenes de Docker están disponibles públicamente en:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (ejemplo de etiqueta de versión)

No se requiere autenticación para extraer estas imágenes.

## Contribuyendo {#contributing}

Para contribuir a la solución autohospedada:

1. Modifique los archivos relevantes en el directorio `self-hosting`.
2. Pruebe localmente o en un VPS basado en Ubuntu usando el script `setup.sh` proporcionado.
3. Envíe una solicitud de incorporación de cambios.
4. Una vez fusionada la imagen y creada una nueva versión, el flujo de trabajo de integración continua compilará y publicará automáticamente la imagen de Docker actualizada.