import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';
import { TaskService } from '../../services/task.service';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskFormModalComponent } from '../../components/task-form-modal/task-form-modal.component';
import { DeleteConfirmModalComponent } from '../../components/delete-confirm-modal/delete-confirm-modal.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
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

  showFormModal = false;
  showDeleteModal = false;
  selectedTask: Task | null = null;
  taskToDelete: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAll(this.selectedFilter ?? undefined).subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
    });
  }

  //properly cast the string value to TaskStatus enum
  onFilterChange(value: string | null) {
    if (!value) {
      this.selectedFilter = null;
    } else {
      this.selectedFilter = value as TaskStatus;
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
      this.taskService.update(this.selectedTask.id, data).subscribe(() => {
        this.showFormModal = false;
        this.loadTasks();
      });
    } else {
      this.taskService.create(data).subscribe(() => {
        this.showFormModal = false;
        this.loadTasks();
      });
    }
  }

  onConfirmDelete() {
    if (!this.taskToDelete) return;
    this.taskService.delete(this.taskToDelete.id).subscribe(() => {
      this.showDeleteModal = false;
      this.taskToDelete = null;
      this.loadTasks();
    });
  }
}