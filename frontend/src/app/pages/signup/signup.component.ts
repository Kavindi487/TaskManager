import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirm = '';
  error = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.name || !this.email || !this.password || !this.confirm) {
      this.error = 'Please fill in all fields.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }

    if (this.password !== this.confirm) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.auth.signup({
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err?.error?.message || 'Signup failed. Please try again.';
      }
    });
  }
}
