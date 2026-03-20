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
    return this.tasks.filter(task => task.status === TaskStatus.TO_DO).length;
  }

  get progressCount(): number {
    return this.tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  }

  get doneCount(): number {
    return this.tasks.filter(task => task.status === TaskStatus.DONE).length;
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
    const request$ = this.selectedTask
      ? this.taskService.update(this.selectedTask.id, data)
      : this.taskService.create(data);

    request$.subscribe({
      next: () => {
        this.showFormModal = false;
        this.loadTasks();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to save task.';
      }
    });
  }

  onConfirmDelete() {
    if (!this.taskToDelete) return;

    this.taskService.delete(this.taskToDelete.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.taskToDelete = null;
        this.loadTasks();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to delete task.';
      }
    });
  }
}
