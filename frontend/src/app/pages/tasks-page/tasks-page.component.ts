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
  // allTasks always holds the FULL unfiltered list — used for stat counters
  allTasks: Task[] = [];
  // filteredTasks is what the list renders — may be a subset
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
    this.loadAllTasks();
  }

  // Stat counters always read from allTasks — never affected by filter
  get totalCount():    number { return this.allTasks.length; }
  get todoCount():     number { return this.allTasks.filter(t => t.status === TaskStatus.TO_DO).length; }
  get progressCount(): number { return this.allTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length; }
  get doneCount():     number { return this.allTasks.filter(t => t.status === TaskStatus.DONE).length; }

  // Always fetch ALL tasks first, then apply filter client-side
  loadAllTasks() {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to load tasks.';
        this.isLoading = false;
      }
    });
  }

  // Apply the active filter to allTasks — no extra API call needed
  applyFilter() {
    this.filteredTasks = this.selectedFilter
      ? this.allTasks.filter(t => t.status === this.selectedFilter)
      : [...this.allTasks];
  }

  onFilterChange(value: TaskStatus | null) {
    this.selectedFilter = value;
    this.applyFilter(); // instant — no API call, just re-slice allTasks
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
      const editId = this.selectedTask.id;
      this.showFormModal = false;

      // Optimistic update in allTasks
      const idx = this.allTasks.findIndex(t => t.id === editId);
      if (idx !== -1) {
        this.allTasks[idx] = { ...this.allTasks[idx], ...data };
        this.applyFilter();
      }

      this.taskService.update(editId, data).subscribe({
        next: (updated) => {
          const i = this.allTasks.findIndex(t => t.id === updated.id);
          if (i !== -1) this.allTasks[i] = updated;
          this.applyFilter();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message || 'Failed to update task.';
          this.loadAllTasks(); // rollback
        }
      });
    } else {
      this.taskService.create(data).subscribe({
        next: (created) => {
          this.allTasks.unshift(created);
          this.applyFilter();
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

    // Optimistic delete from both arrays
    this.allTasks = this.allTasks.filter(t => t.id !== id);
    this.applyFilter();
    this.showDeleteModal = false;
    this.taskToDelete = null;

    this.taskService.delete(id).subscribe({
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Failed to delete task.';
        this.loadAllTasks(); // rollback
      }
    });
  }
}
