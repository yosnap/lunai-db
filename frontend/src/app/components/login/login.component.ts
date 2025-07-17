import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>LunAI</h1>
          <p>Gestión de Usuarios</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="Ingresa tu email"
            >
            <div class="invalid-feedback" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              El email es requerido y debe ser válido
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Contraseña</label>
            <div style="position: relative;">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
                class="form-control"
                [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Ingresa tu contraseña"
                style="padding-right: 40px;"
              >
              <span
                (click)="togglePassword()"
                style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #6c757d; height: -webkit-fill-available; font-size: 18px;"
                title="{{ showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña' }}"
              >
                <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              </span>
            </div>
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
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

    const { email, password } = this.loginForm.value;

    // Debug: mostrar qué se está enviando
    console.log('Intentando login con:', { email, password });

    // Usar autenticación real del backend
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Error de login:', error);
        this.errorMessage = error.error?.error || 'Credenciales incorrectas. Verifica tu email y contraseña.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
