import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  get statusClass(): string {
    switch (this.task.status) {
      case TaskStatus.DONE:        return 'status-done';
      case TaskStatus.IN_PROGRESS: return 'status-in-progress';
      default:                     return 'status-todo';
    }
  }

  get isDone(): boolean {
    return this.task.status === TaskStatus.DONE;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }
}
