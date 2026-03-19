import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  navItems = [
    { label: 'Dashboard', icon: '⊞' },
    { label: 'My Tasks',  icon: '✓', active: true },
    { label: 'Completed', icon: '◉' },
    { label: 'Settings',  icon: '⚙' },
  ];
}
