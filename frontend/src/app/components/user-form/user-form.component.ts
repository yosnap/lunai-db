import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onBackdropClick($event)">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
          <button type="button" class="btn btn-secondary btn-sm" (click)="onCancel()">
            ✕
          </button>
        </div>

        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group">
            <label class="form-label" for="name">Nombre</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="form-control"
              [class.is-invalid]="userForm.get('name')?.invalid && userForm.get('name')?.touched"
              placeholder="Nombre completo"
            >
            <div class="invalid-feedback" *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched">
              El nombre es requerido
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
              placeholder="usuario@ejemplo.com"
            >
            <div class="invalid-feedback" *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
              <span *ngIf="userForm.get('email')?.errors?.['required']">El email es requerido</span>
              <span *ngIf="userForm.get('email')?.errors?.['email']">El email no es válido</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">
              Contraseña
              <span *ngIf="isEdit" class="text-muted">(dejar vacío para mantener la actual)</span>
            </label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.is-invalid]="userForm.get('password')?.invalid && userForm.get('password')?.touched"
              placeholder="Contraseña"
            >
            <div class="invalid-feedback" *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
              La contraseña es requerida
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="role">Rol</label>
            <select
              id="role"
              formControlName="role"
              class="form-control"
              [class.is-invalid]="userForm.get('role')?.invalid && userForm.get('role')?.touched"
            >
              <option value="">Seleccionar rol</option>
              <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
            </select>
            <div class="invalid-feedback" *ngIf="userForm.get('role')?.invalid && userForm.get('role')?.touched">
              El rol es requerido
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="onCancel()">
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            [disabled]="userForm.invalid || isLoading"
            (click)="onSubmit()"
          >
            <span class="spinner" *ngIf="isLoading"></span>
            {{ isLoading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-muted {
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: normal;
    }
  `]
})
export class UserFormComponent implements OnInit {
  @Input() isVisible = false;
  @Input() user: User | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<User>();

  userForm: FormGroup;
  roles: string[] = [];
  isEdit = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadRoles();
  }

  ngOnChanges() {
    if (this.user) {
      this.isEdit = true;
      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        role: this.user.rol,
        password: ''
      });
      // En modo edición, la contraseña es opcional
      this.userForm.get('password')?.clearValidators();
    } else {
      this.isEdit = false;
      this.userForm.reset();
      // En modo creación, la contraseña es requerida
      this.userForm.get('password')?.setValidators([Validators.required]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.userForm.value;

    if (this.isEdit && this.user) {
      const updateData: UpdateUserRequest = {
        name: formValue.name,
        email: formValue.email,
        role: formValue.role
      };

      // Solo incluir contraseña si se proporcionó una nueva
      if (formValue.password) {
        updateData.password = formValue.password;
      }

      this.userService.updateUser(this.user.id, updateData).subscribe({
        next: (updatedUser) => {
          this.onSave.emit(updatedUser);
          this.close();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Error al actualizar usuario';
          this.isLoading = false;
        }
      });
    } else {
      const createData: CreateUserRequest = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
        role: formValue.role
      };

      this.userService.createUser(createData).subscribe({
        next: (newUser) => {
          this.onSave.emit(newUser);
          this.close();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Error al crear usuario';
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.close();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  private close() {
    this.isLoading = false;
    this.errorMessage = '';
    this.userForm.reset();
    this.onClose.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }
}
