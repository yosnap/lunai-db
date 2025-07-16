# Configuración para EasyPanel

## Variables de Entorno Requeridas

### Frontend
- `API_URL`: URL del backend (configurar: `https://api.lun-ai.es`)

### Backend
- `NODE_ENV`: `production`
- `PORT`: `3010`
- `DB_HOST`: Host de la base de datos PostgreSQL
- `DB_PORT`: Puerto de la base de datos (default: `5432`)
- `DB_DATABASE`: Nombre de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `FRONTEND_URL`: URL del frontend para CORS (configurar: `https://users.lun-ai.es`)

## Configuración del Proyecto

1. **Dockerfile**: Usa el `Dockerfile` en la raíz del proyecto
2. **Puertos**: 
   - Frontend: `4200`
   - Backend: `3010`
3. **Base de datos**: PostgreSQL requerida

## Comandos de Build

El Dockerfile automáticamente:
1. Instala dependencias del backend y frontend
2. Genera el archivo `environment.prod.ts` con la `API_URL` correcta
3. Construye el frontend de Angular
4. Configura el backend para usar las variables de entorno
5. Inicia ambos servicios

## Estructura del Proyecto

```
lunai-db/
├── Dockerfile              # Dockerfile unificado
├── build-frontend.sh       # Script para generar environment.prod.ts
├── backend/
│   ├── index.js           # Servidor Express
│   ├── config.js          # Configuración por ambiente
│   └── package.json
└── frontend/
    ├── src/environments/
    │   └── environment.prod.ts  # Generado automáticamente
    └── package.json
```

## Verificación

Después del despliegue, verificar:
1. Frontend accesible en puerto 4200
2. Backend accesible en puerto 3010
3. API endpoints funcionando: `GET /api/users`
4. CORS configurado correctamente