import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';
import { TaskService } from '../../services/task.service';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskFormModalComponent } from '../../components/task-form-modal/task-form-modal.component';
import { DeleteConfirmModalComponent } from '../../components/delete-confirm-modal/delete-confirm-modal.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    TaskListComponent,
    TaskFormModalComponent,
    DeleteConfirmModalComponent,
    EmptyStateComponent,
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss'
})
export class TasksPageComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedFilter: TaskStatus | null = null;
  isLoading = false;
  errorMessage = '';

  showFormModal = false;
  showDeleteModal = false;
  selectedTask: Task | null = null;
  taskToDelete: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  get todoCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.TO_DO).length;
  }

  get progressCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  }

  get doneCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.DONE).length;
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getAll(this.selectedFilter ?? undefined).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to load tasks.';
        this.isLoading = false;
      }
    });
  }

  onFilterChange(value: TaskStatus | null) {
    this.selectedFilter = value;
    // Optimistic client-side filter while API loads
    if (value === null) {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(t => t.status === value);
    }
    this.loadTasks();
  }

  openCreateModal() {
    this.selectedTask = null;
    this.showFormModal = true;
  }

  openEditModal(task: Task) {
    this.selectedTask = task;
    this.showFormModal = true;
  }

  openDeleteModal(task: Task) {
    this.taskToDelete = task;
    this.showDeleteModal = true;
  }

  onSaveTask(data: { title: string; description: string; status: TaskStatus }) {
    if (this.selectedTask) {
      // Optimistic update
      const idx = this.tasks.findIndex(t => t.id === this.selectedTask!.id);
      if (idx !== -1) {
        this.tasks[idx] = { ...this.tasks[idx], ...data };
        this.filteredTasks = this.selectedFilter
          ? this.tasks.filter(t => t.status === this.selectedFilter)
          : [...this.tasks];
      }
      this.showFormModal = false;

      this.taskService.update(this.selectedTask.id, data).subscribe({
        next: (updated) => {
          const i = this.tasks.findIndex(t => t.id === updated.id);
          if (i !== -1) this.tasks[i] = updated;
          this.filteredTasks = this.selectedFilter
            ? this.tasks.filter(t => t.status === this.selectedFilter)
            : [...this.tasks];
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Failed to update task.';
          this.loadTasks(); // rollback
        }
      });
    } else {
      this.taskService.create(data).subscribe({
        next: (created) => {
          this.tasks.unshift(created);
          this.filteredTasks = this.selectedFilter
            ? this.tasks.filter(t => t.status === this.selectedFilter)
            : [...this.tasks];
          this.showFormModal = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Failed to create task.';
        }
      });
    }
  }

  onConfirmDelete() {
    if (!this.taskToDelete) return;
    const id = this.taskToDelete.id;

    // Optimistic delete
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.filteredTasks = this.filteredTasks.filter(t => t.id !== id);
    this.showDeleteModal = false;
    this.taskToDelete = null;

    this.taskService.delete(id).subscribe({
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to delete task.';
        this.loadTasks(); // rollback
      }
    });
  }
}
