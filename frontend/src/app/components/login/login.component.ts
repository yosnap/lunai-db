import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>LunAI</h1>
          <p>Gestión de Usuarios</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label" for="username">Usuario</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              class="form-control"
              [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
              placeholder="Ingresa tu usuario"
            >
            <div class="invalid-feedback" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
              El usuario es requerido
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              placeholder="Ingresa tu contraseña"
            >
            <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              La contraseña es requerida
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg login-btn"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span class="spinner" *ngIf="isLoading"></span>
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .login-header p {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .login-form {
      margin-bottom: 1.5rem;
    }

    .login-btn {
      width: 100%;
      margin-top: 0.5rem;
    }

    .login-info {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      border: 1px solid #e5e7eb;
    }

    .login-info p {
      margin: 0.25rem 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .login-info code {
      background-color: #e5e7eb;
      padding: 0.125rem 0.25rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #374151;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 1.5rem;
      }

      .login-header h1 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Si ya está autenticado, redirigir a users
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/users']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    // Usar autenticación simple
    if (this.authService.simpleAuth(username, password)) {
      this.router.navigate(['/users']);
    } else {
      this.errorMessage = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
    }

    this.isLoading = false;
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
