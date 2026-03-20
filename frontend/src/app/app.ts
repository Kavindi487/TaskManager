import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  showShell = false;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    // Check immediately on init — if not logged in, go to login right away
    // This prevents any flash of the app shell before guard fires
    if (!this.auth.isLoggedIn()) {
      const currentUrl = window.location.pathname;
      const isAuthPage = currentUrl.includes('/login') || currentUrl.includes('/signup');
      if (!isAuthPage) {
        this.router.navigate(['/login']);
      }
    }

    // Keep showShell in sync with route changes
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url: string = e.urlAfterRedirects;
        this.showShell = this.auth.isLoggedIn() &&
          !url.includes('/login') &&
          !url.includes('/signup');
      });
  }
}
