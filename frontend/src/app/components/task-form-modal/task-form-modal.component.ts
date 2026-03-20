import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.scss'
})
export class TaskFormModalComponent implements OnInit {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<{ title: string; description: string; status: TaskStatus }>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;
  statuses = [TaskStatus.TO_DO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

  get isEdit(): boolean { return !!this.task; }
  get titleCtrl() { return this.taskForm.get('title')!; }
  get descCtrl() { return this.taskForm.get('description')!; }

  statusLabels: Record<string, string> = {
    TO_DO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: [
        this.task?.title ?? '',
        [Validators.required, Validators.maxLength(150)]
      ],
      description: [
        this.task?.description ?? '',
        Validators.maxLength(1000)
      ],
      status: [this.task?.status ?? TaskStatus.TO_DO]
    });
  }

  submit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.taskForm.value);
  }
}
