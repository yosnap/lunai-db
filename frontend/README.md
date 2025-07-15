# Frontend - Gestión de Usuarios LunAI

Este es el frontend desarrollado en Angular 17 para la gestión de usuarios del sistema LunAI.

## Características

- **Autenticación**: Login con credenciales admin/admin1234
- **Gestión de Usuarios**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Diseño Minimalista**: Interfaz limpia y moderna
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Validaciones**: Formularios con validación en tiempo real

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/           # Componente de login
│   │   │   ├── user-list/       # Lista de usuarios
│   │   │   └── user-form/       # Formulario de usuario (crear/editar)
│   │   ├── services/
│   │   │   ├── auth.service.ts  # Servicio de autenticación
│   │   │   └── user.service.ts  # Servicio de gestión de usuarios
│   │   ├── models/
│   │   │   └── user.model.ts    # Modelos de datos
│   │   ├── app.component.ts     # Componente principal
│   │   └── app.routes.ts        # Configuración de rutas
│   ├── styles.css              # Estilos globales
│   └── index.html              # Página principal
├── package.json
└── README.md
```

## Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm
- El backend debe estar ejecutándose en http://localhost:3010

### Pasos para ejecutar

1. **Instalar dependencias**:

   ```bash
   cd frontend
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:

   ```bash
   npm start
   ```

3. **Abrir la aplicación**:
   - Navega a http://localhost:4200
   - Usa las credenciales: usuario `admin`, contraseña `admin1234`

## Credenciales de Acceso

- **Usuario**: admin
- **Contraseña**: admin1234

## Funcionalidades

### Autenticación

- Login con validación de credenciales
- Protección de rutas (redirección automática al login si no está autenticado)
- Logout con limpieza de sesión

### Gestión de Usuarios

- **Listar usuarios**: Tabla con todos los usuarios del sistema
- **Crear usuario**: Formulario modal con validaciones
- **Editar usuario**: Modificar datos existentes (contraseña opcional)
- **Eliminar usuario**: Confirmación antes de eliminar
- **Filtros por rol**: Visualización de badges por tipo de usuario

### API Endpoints Utilizados

La aplicación consume los siguientes endpoints del backend:

- `GET /api/users` - Obtener lista de usuarios
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `GET /api/roles` - Obtener roles disponibles

### Estructura de Datos

**Usuario**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
  fecha_creacion: string;
  activo: boolean;
}
```

**Crear Usuario**:

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}
```

## Diseño y UX

- **Minimalista**: Interfaz limpia sin elementos innecesarios
- **Responsive**: Adaptación automática a móviles y tablets
- **Feedback visual**: Indicadores de carga y mensajes de estado
- **Validaciones**: Formularios con validación en tiempo real
- **Confirmaciones**: Diálogos de confirmación para acciones destructivas

## Tecnologías Utilizadas

- **Angular 17**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Manejo de observables y HTTP
- **CSS3**: Estilos con variables CSS y Flexbox/Grid
- **Angular Reactive Forms**: Formularios reactivos con validaciones

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run watch` - Construye en modo desarrollo con watch

## Configuración de Desarrollo

El frontend está configurado para conectarse al backend en `http://localhost:3010`. Si necesitas cambiar esta URL, modifica la propiedad `apiUrl` en los servicios:

```typescript
// src/app/services/user.service.ts
private apiUrl = 'http://localhost:3010/api';

// src/app/services/auth.service.ts
private apiUrl = 'http://localhost:3010/api';
```

## Características Técnicas

- **Standalone Components**: Utiliza la nueva arquitectura de componentes standalone de Angular 17
- **Signals**: Preparado para el futuro con la nueva API de Signals
- **Lazy Loading**: Optimizado para carga perezosa de módulos
- **TypeScript Strict**: Configuración estricta de TypeScript para mejor calidad de código

## Troubleshooting

### Error de CORS

Si experimentas errores de CORS, asegúrate de que el backend tenga configurado CORS correctamente:

```javascript
app.use(cors());
```

### Puerto ocupado

Si el puerto 4200 está ocupado, Angular automáticamente sugerirá otro puerto disponible.

### Problemas de dependencias

Si hay problemas con las dependencias, intenta:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Contribución

Para contribuir al proyecto:

1. Crea una nueva rama para tu feature
2. Implementa los cambios siguiendo las convenciones de código
3. Asegúrate de que todas las pruebas pasen
4. Crea un pull request con descripción detallada

## Próximas Mejoras

- [ ] Implementación de JWT para autenticación más robusta
- [ ] Filtros y búsqueda en la tabla de usuarios
- [ ] Paginación para grandes volúmenes de datos
- [ ] Exportación de datos a CSV/Excel
- [ ] Configuración de permisos por rol
- [ ] Historial de cambios en usuarios
- [ ] Notificaciones en tiempo real
