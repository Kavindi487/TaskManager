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

  statuses = [
    { label: 'All Status', value: null },
    { label: 'TO_DO',       value: TaskStatus.TO_DO },
    { label: 'IN_PROGRESS', value: TaskStatus.IN_PROGRESS },
    { label: 'DONE',        value: TaskStatus.DONE },
  ];

  selectedStatus: TaskStatus | null = null;
  showDropdown = false;

  get selectedLabel() {
    return this.statuses.find(s => s.value === this.selectedStatus)?.label ?? 'All Status';
  }

  selectStatus(value: TaskStatus | null) {
    this.selectedStatus = value;
    this.showDropdown = false;
    this.filterChange.emit(value);
  }
}
