export interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
  fecha_creacion: string;
  activo: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
