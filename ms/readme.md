```markdown
# Microservicio MS-Forms

Este repositorio contiene el microservicio **ms-forms** y la configuración para la base de datos PostgreSQL usando Docker.

---

## Estructura del proyecto

```

.
├── database
│   ├── Dockerfile          # Dockerfile para la imagen de la base de datos PostgreSQL
│   └── init\_questionask.sql # Script SQL para inicializar la base de datos
│
├── ms-forms
│   ├── src                 # Código fuente del microservicio
│   ├── resources           # Recursos adicionales (ej. scripts, archivos)
│   ├── .env                # Variables de entorno para desarrollo local
│   ├── Dockerfile          # Dockerfile para construir la imagen del microservicio
│   ├── package.json        # Dependencias y scripts npm
│   └── ...
│
└── docker-compose.yml      # Archivo para orquestar los contenedores Docker

````

---

## Requisitos previos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Node.js y npm (para desarrollo local, no necesario para Docker)

---

## Variables de entorno

Configura el archivo `.env` dentro de `ms-forms` con al menos las siguientes variables:

```env
DATABASE_URL=postgres://questionaskuser:secretpassword@db:5432/questionaskdb
JWT_SECRET=question-ask-secret!
NODE_ENV=development
````

---

## Comandos para desarrollo y despliegue con Docker

Desde la raíz del proyecto, ejecutar:

### 1. Construir imágenes

```bash
docker-compose build
```

### 2. Levantar servicios en segundo plano

```bash
docker-compose up -d
```

### 3. Ver logs en tiempo real (ejemplo para ms-forms)

```bash
docker-compose logs -f ms-forms
```

### 4. Detener y eliminar contenedores, imágenes y volúmenes

```bash
docker-compose down --rmi all -v
```

---

## Cómo funciona

* La base de datos PostgreSQL se levanta con la imagen personalizada creada desde `database/Dockerfile`.
* El script `init_questionask.sql` se ejecuta al iniciar el contenedor de la base de datos para crear la estructura inicial.
* El microservicio `ms-forms` corre en Node.js y conecta con la base de datos usando la variable `DATABASE_URL`.
* El microservicio expone las APIs REST para gestionar formularios.

---

## Nota

* El volumen para la base de datos está configurado para persistir los datos.
* En modo desarrollo, el código dentro de `ms-forms` está montado como volumen para permitir hot reload.

---

## Contacto

Para dudas o contribuciones, contacta a \[[tu-email@dominio.com](mailto:tu-email@dominio.com)].

```

¿Quieres que te agregue secciones específicas o scripts npm para desarrollo?
```

## Para ejecutar solo la bd

```sh
docker build -t questionask-db ./database
docker run -d \
  --name questionask-db \
  -p 5432:5432 \
  -v questionask_postgres_data:/var/lib/postgresql/data \
  questionask-db


o

docker-compose up db redis
```
