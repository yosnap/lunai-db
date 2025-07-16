import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
            <div class="position-relative">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
                class="form-control"
                [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Ingresa tu contraseña"
                style="padding-right: 40px;"
              >
              <button
                type="button"
                class="btn btn-sm position-absolute"
                (click)="togglePassword()"
                tabindex="-1"
                style="right: 5px; top: 50%; transform: translateY(-50%); border: none; background: transparent; padding: 0.25rem 0.5rem;"
              >
                <span style="font-size: 1.2rem;">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
              </button>
              <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                La contraseña es requerida
              </div>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="alert alert-info" style="font-size: 0.875rem;">
            <strong>Nota:</strong> Ahora usa autenticación real con la base de datos.<br>
            Ingresa con tu <strong>email</strong> y contraseña.
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
    console.log('API URL:', environment.apiUrl);

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
