import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  user: { id: number; name: string; email: string } | null = null;

  navItems = [
    { label: 'Overview',  icon: '◫',  route: '/overview' },
    { label: 'My Tasks',  icon: '✓',  route: '/tasks'    },
    { label: 'Progress',  icon: '◔',  route: '/progress' }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
  }
}
