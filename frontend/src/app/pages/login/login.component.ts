import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  error = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err?.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
