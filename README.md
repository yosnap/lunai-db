# LunAI - Gestión de Usuarios

Sistema completo de gestión de usuarios desarrollado con Node.js + PostgreSQL (backend) y Angular 17 (frontend).

## 🚀 Características

- **Backend**: API REST con Node.js, Express y PostgreSQL
- **Frontend**: Aplicación Angular 17 con diseño minimalista
- **Autenticación**: Sistema de login simple (admin/admin1234)
- **CRUD Completo**: Crear, leer, actualizar y eliminar usuarios
- **Responsive**: Diseño adaptativo para todos los dispositivos

## 📁 Estructura del Proyecto

```
lunai-db/
├── backend/                 # API Node.js + Express + PostgreSQL
│   ├── index.js            # Servidor principal
│   ├── config.js           # Configuración de entornos
│   └── package.json        # Dependencias del backend
├── frontend/                # Aplicación Angular 17
│   ├── src/app/            # Componentes y servicios
│   ├── src/environments/   # Configuración de entornos
│   └── package.json        # Dependencias del frontend
├── package.json            # Scripts para desarrollo local
├── DEPLOY.md               # Guía de despliegue en EasyPanel
└── README.md               # Este archivo
```

## 🛠️ Desarrollo Local

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- npm

### Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/lunai-db.git
cd lunai-db

# Instalar dependencias del script principal
npm install

# Configurar base de datos PostgreSQL
createdb lunai_db

# Crear tabla de usuarios (ver DEPLOY.md para SQL)

# Configurar variables de entorno en backend/.env
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales

# Ejecutar ambos proyectos simultáneamente
npm run dev
```

Esto iniciará:

- **Backend**: http://localhost:3010
- **Frontend**: http://localhost:4200

### Desarrollo Separado

```bash
# Solo backend
cd backend
npm install
npm start

# Solo frontend (en otra terminal)
cd frontend
npm install
npm start
```

## 🔐 Credenciales de Acceso

- **Usuario**: `admin`
- **Contraseña**: `admin1234`

## 🌐 Despliegue en Producción

Ver [DEPLOY.md](./DEPLOY.md) para instrucciones completas de despliegue en EasyPanel.

**Resumen rápido**:

1. Subir código a GitHub
2. Crear servicio PostgreSQL en EasyPanel
3. Crear 2 apps desde el mismo repositorio:
   - Backend (root: `backend`)
   - Frontend (root: `frontend`)
4. Configurar variables de entorno
5. Configurar dominios

## 📋 Payload de API

### Crear Usuario

```bash
POST /api/users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan.perez@ejemplo.com",
  "password": "miContraseña123",
  "role": "usuario"
}
```

### Otros Endpoints

- `GET /api/users` - Listar usuarios
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `GET /api/roles` - Obtener roles disponibles
- `POST /api/login` - Autenticación (opcional)

## 🔧 Tecnologías Utilizadas

### Backend

- Node.js 18+
- Express.js
- PostgreSQL
- bcrypt (hash de contraseñas)
- CORS
- dotenv

### Frontend

- Angular 17
- TypeScript
- RxJS
- Angular Reactive Forms
- CSS3 (Variables CSS, Flexbox, Grid)

## 📱 Funcionalidades

### Gestión de Usuarios

- ✅ Listar usuarios con paginación
- ✅ Crear nuevos usuarios
- ✅ Editar usuarios existentes
- ✅ Eliminar usuarios (con confirmación)
- ✅ Filtros por rol y estado

### Autenticación

- ✅ Login con validación
- ✅ Protección de rutas
- ✅ Logout con limpieza de sesión

### UX/UI

- ✅ Diseño minimalista y moderno
- ✅ Responsive design
- ✅ Validaciones en tiempo real
- ✅ Feedback visual (loading, errores, éxito)
- ✅ Confirmaciones para acciones destructivas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa [DEPLOY.md](./DEPLOY.md) para problemas de despliegue
2. Verifica los logs en EasyPanel
3. Comprueba que la base de datos esté configurada correctamente

---

**Desarrollado por**: Paulo
**Fecha**: Julio 2025
**Versión**: 1.0.0
