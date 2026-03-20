import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatus } from '../../models/task-status';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Output() addTask = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<TaskStatus | null>();

  filters = [
    { label: 'All', value: null },
    { label: 'To Do', value: TaskStatus.TO_DO },
    { label: 'In Progress', value: TaskStatus.IN_PROGRESS },
    { label: 'Done', value: TaskStatus.DONE }
  ];

  selectedStatus: TaskStatus | null = null;

  selectStatus(value: TaskStatus | null) {
    this.selectedStatus = value;
    this.filterChange.emit(value);
  }
}
