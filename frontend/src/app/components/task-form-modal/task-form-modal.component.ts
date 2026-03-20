import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.scss'
})
export class TaskFormModalComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<{ title: string; description: string; status: TaskStatus }>();
  @Output() cancel = new EventEmitter<void>();

  title = '';
  description = '';
  status: TaskStatus = TaskStatus.TO_DO;
  statuses = [TaskStatus.TO_DO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
  titleError = false;

  get isEdit(): boolean { return !!this.task; }

  ngOnInit() {
    if (this.task) {
      this.title = this.task.title;
      this.description = this.task.description ?? '';
      this.status = this.task.status;
    }
  }

  submit() {
    if (!this.title.trim()) { this.titleError = true; return; }
    this.save.emit({ title: this.title.trim(), description: this.description.trim(), status: this.status });
  }
}
