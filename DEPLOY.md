# Despliegue LunAI en EasyPanel

Este proyecto se despliega en EasyPanel usando GitHub como fuente de archivos.

## Estructura del Proyecto

```
lunai-db/
├── backend/          # API Node.js + Express
└── frontend/         # Angular 17 App
```

## Pasos para Desplegar en EasyPanel

### 1. Subir código a GitHub

1. Crea un repositorio en GitHub
2. Sube todo el código del proyecto:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### 2. Configurar Base de Datos

1. En EasyPanel, crear servicio PostgreSQL:

   - **Service**: PostgreSQL
   - **Name**: `lunai-postgres`
   - **Database**: `lunai_db`
   - **Username**: `postgres`
   - **Password**: (generar una segura)

2. Crear tabla de usuarios:
   ```sql
   CREATE TABLE usuarios (
     id SERIAL PRIMARY KEY,
     nombre_usuario VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     contraseña VARCHAR(255) NOT NULL,
     rol VARCHAR(50) NOT NULL DEFAULT 'usuario',
     fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     activo BOOLEAN DEFAULT TRUE
   );
   ```

### 3. Desplegar Backend

1. **Crear App en EasyPanel**:

   - **Type**: App from Git
   - **Source**: GitHub repository
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

2. **Variables de Entorno**:

   ```
   NODE_ENV=production
   PORT=3010
   DB_HOST=lunai-postgres
   DB_PORT=5432
   DB_DATABASE=lunai_db
   DB_USER=postgres
   DB_PASSWORD=tu_password_postgres
   FRONTEND_URL=https://tu-frontend-url.easypanel.host
   ```

3. **Configurar Puerto**: 3010

### 4. Desplegar Frontend

1. **Crear App en EasyPanel**:

   - **Type**: App from Git
   - **Source**: GitHub repository
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build:prod`
   - **Start Command**: `npm start`

2. **Variables de Entorno**:

   ```
   NODE_ENV=production
   API_URL=https://tu-backend-url.easypanel.host/api
   ```

3. **Configurar Puerto**: 4200

### 5. Configurar Dominios

1. **Backend**: `https://lunai-api.tu-dominio.com`
2. **Frontend**: `https://lunai-app.tu-dominio.com`

### 6. Actualizar URLs

Después del despliegue, actualiza los archivos de configuración:

**Frontend** (`src/environments/environment.prod.ts`):

```typescript
export const environment = {
  production: true,
  apiUrl: "https://lunai-api.tu-dominio.com/api",
};
```

**Backend** (variables de entorno):

```
FRONTEND_URL=https://lunai-app.tu-dominio.com
```

## Verificación del Despliegue

1. **Backend**: Visita `https://lunai-api.tu-dominio.com/` (debería mostrar "En estos momentos el servidor está activo!!!")
2. **Frontend**: Visita `https://lunai-app.tu-dominio.com/` (debería mostrar login)

## Credenciales de Acceso

- **Usuario**: admin
- **Contraseña**: admin1234

## Comandos Útiles

### Desarrollo Local

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm start
```

### Actualizar Despliegue

```bash
git add .
git commit -m "Update: descripción del cambio"
git push origin main
```

EasyPanel automáticamente detectará los cambios y redesplegará.

## Troubleshooting

### Error de CORS

- Verificar que `FRONTEND_URL` esté configurada correctamente en backend
- Comprobar que el frontend esté usando la URL correcta del backend

### Error 404 en Frontend

- Asegurar que el comando de build sea: `npm run build:prod`
- Verificar que el start command sea: `npm start`

### Error de Conexión a Base de Datos

- Verificar que `DB_HOST` apunte a `lunai-postgres`
- Comprobar credenciales de base de datos
- Asegurar que la tabla `usuarios` existe

## Logs

Para ver logs en EasyPanel:

1. Ve a tu aplicación
2. Click en "Logs"
3. Revisa errores en tiempo real
