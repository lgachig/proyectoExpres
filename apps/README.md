# proyectoExpres

Proyecto con NestJS (backend), React + Vite (frontend) y PostgreSQL (docker).

## Variables de entorno

Se agregaron archivos de entorno para evitar valores quemados en codigo:

- `backend/.env`
- `frontend/.env`

`docker-compose.yml` ya esta configurado para leer esos archivos con `env_file`.

Para que el proyecto funcione, usa estos valores:

### backend/.env

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173

DB_HOST=db
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=escuela_db

DOG_API_BASE_URL=https://dogapi.dog/api/v2
DOG_API_BREEDS_PATH=/breeds
```

### frontend/.env

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_DOG_INITIAL_PAGE=1
VITE_DOG_PAGE_SIZE=7
```

## Ejecucion

```bash
docker compose up --build
```

Servicios:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Adminer: `http://localhost:8080`