import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  template: `
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <div class="header-left">
            <h1>Gestión de Usuarios</h1>
            <p>Administra los usuarios del sistema LunAI</p>
          </div>
          <div class="header-right">
            <span class="user-info">Bienvenido, {{ currentUser?.name }}</span>
            <button class="btn btn-secondary btn-sm" (click)="logout()">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="actions-bar">
        <button class="btn btn-primary" (click)="openCreateForm()">
          + Nuevo Usuario
        </button>
        <button class="btn btn-secondary" (click)="loadUsers()">
          🔄 Actualizar
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <!-- Error State -->
      <div class="alert alert-danger" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <!-- Users Table -->
      <div class="card" *ngIf="!isLoading">
        <div class="card-header">
          <h2 class="card-title">Lista de Usuarios ({{ users.length }})</h2>
        </div>
        <div class="card-body" *ngIf="users.length > 0; else noUsers">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha Creación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" [ngClass]="getRoleBadgeClass(user.rol)">
                      {{ user.rol }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.fecha_creacion) }}</td>
                  <td>
                    <span class="badge" [ngClass]="user.activo ? 'badge-success' : 'badge-danger'">
                      {{ user.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button
                        class="btn btn-sm btn-primary"
                        (click)="openEditForm(user)"
                        title="Editar usuario"
                      >
                        ✏️
                      </button>
                      <button
                        class="btn btn-sm btn-danger"
                        (click)="deleteUser(user)"
                        title="Eliminar usuario"
                        [disabled]="isDeleting === user.id"
                      >
                        <span class="spinner" *ngIf="isDeleting === user.id; else deleteIcon"></span>
                        <ng-template #deleteIcon>🗑️</ng-template>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <ng-template #noUsers>
          <div class="card-body">
            <div class="empty-state">
              <div class="empty-icon">👥</div>
              <h3>No hay usuarios registrados</h3>
              <p>Comienza creando tu primer usuario</p>
              <button class="btn btn-primary" (click)="openCreateForm()">
                Crear Usuario
              </button>
            </div>
          </div>
        </ng-template>
      </div>

      <!-- Success Message -->
      <div class="alert alert-success" *ngIf="successMessage">
        {{ successMessage }}
      </div>
    </div>

    <!-- User Form Modal -->
    <app-user-form
      [isVisible]="showUserForm"
      [user]="selectedUser"
      (onClose)="closeUserForm()"
      (onSave)="onUserSaved($event)"
    ></app-user-form>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .header {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
    }

    .header-left h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
    }

    .header-left p {
      margin: 0;
      color: #6b7280;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .actions-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .loading-container {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    .loading-container .spinner {
      margin: 0 auto 1rem auto;
      width: 32px;
      height: 32px;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .badge-success {
      background-color: #d1fae5;
      color: #065f46;
    }

    .badge-danger {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .badge-admin {
      background-color: #ede9fe;
      color: #5b21b6;
    }

    .badge-usuario {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .badge-moderador {
      background-color: #fef3c7;
      color: #92400e;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #1f2937;
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem 0.5rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .actions-bar {
        flex-direction: column;
      }

      .table-container {
        overflow-x: auto;
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showUserForm = false;
  selectedUser: User | null = null;
  isDeleting: number | null = null;
  currentUser: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los usuarios. Verifica que el servidor esté funcionando.';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  openCreateForm() {
    this.selectedUser = null;
    this.showUserForm = true;
  }

  openEditForm(user: User) {
    this.selectedUser = user;
    this.showUserForm = true;
  }

  closeUserForm() {
    this.showUserForm = false;
    this.selectedUser = null;
  }

  onUserSaved(user: User) {
    if (this.selectedUser) {
      // Actualizar usuario existente en la lista
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index] = user;
      }
      this.showSuccessMessage('Usuario actualizado correctamente');
    } else {
      // Agregar nuevo usuario a la lista
      this.users.push(user);
      this.showSuccessMessage('Usuario creado correctamente');
    }
    this.closeUserForm();
  }

  deleteUser(user: User) {
    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name}"?`)) {
      return;
    }

    this.isDeleting = user.id;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.showSuccessMessage('Usuario eliminado correctamente');
        this.isDeleting = null;
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar el usuario';
        this.isDeleting = null;
        console.error('Error:', error);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin': return 'badge-admin';
      case 'moderador': return 'badge-moderador';
      case 'usuario': return 'badge-usuario';
      default: return 'badge-usuario';
    }
  }

  private showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
