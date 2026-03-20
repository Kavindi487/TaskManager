import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss'
})
export class OverviewPageComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;
  user: { name: string; email: string } | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.isLoading = true;
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  get totalCount()    { return this.tasks.length; }
  get todoCount()     { return this.tasks.filter(t => t.status === TaskStatus.TO_DO).length; }
  get progressCount() { return this.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length; }
  get doneCount()     { return this.tasks.filter(t => t.status === TaskStatus.DONE).length; }
  get completionRate(): number {
    return this.totalCount === 0 ? 0 : Math.round((this.doneCount / this.totalCount) * 100);
  }
  get recentTasks(): Task[] {
    return this.tasks.slice(0, 5);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  statusLabel(status: TaskStatus): string {
    return status === TaskStatus.TO_DO ? 'To Do'
      : status === TaskStatus.IN_PROGRESS ? 'In Progress'
      : 'Done';
  }

  statusClass(status: TaskStatus): string {
    return status === TaskStatus.DONE ? 'status-done'
      : status === TaskStatus.IN_PROGRESS ? 'status-in-progress'
      : 'status-todo';
  }
}
