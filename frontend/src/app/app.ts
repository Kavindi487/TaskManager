import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { TaskStatus } from './models/task-status';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, TasksPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'TaskManager';
  showForm = false;
  filterStatus: TaskStatus | null = null;
}
