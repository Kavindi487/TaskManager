import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();
}
