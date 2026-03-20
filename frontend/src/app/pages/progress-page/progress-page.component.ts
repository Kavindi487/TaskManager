import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-progress-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './progress-page.component.html',
  styleUrl: './progress-page.component.scss'
})
export class ProgressPageComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.isLoading = true;
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  get todoTasks()     { return this.tasks.filter(t => t.status === TaskStatus.TO_DO); }
  get progressTasks() { return this.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS); }
  get doneTasks()     { return this.tasks.filter(t => t.status === TaskStatus.DONE); }

  get completionRate(): number {
    if (!this.tasks.length) return 0;
    return Math.round((this.doneTasks.length / this.tasks.length) * 100);
  }

  get inProgressRate(): number {
    if (!this.tasks.length) return 0;
    return Math.round((this.progressTasks.length / this.tasks.length) * 100);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    });
  }
}
