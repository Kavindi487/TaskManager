import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  user: AuthUser | null = null;

  navItems = [
    { label: 'Dashboard', icon: '⊞' },
    { label: 'My Tasks',  icon: '✓', active: true },
    { label: 'Completed', icon: '◉' },
    { label: 'Settings',  icon: '⚙' },
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
  }
}
