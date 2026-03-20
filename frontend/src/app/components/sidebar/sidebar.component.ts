import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  user: { id: number; name: string; email: string } | null = null;

  navItems = [
    { label: 'Overview', icon: '◫' },
    { label: 'My Tasks', icon: '✓', active: true },
    { label: 'Progress', icon: '◔' }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
  }
}
