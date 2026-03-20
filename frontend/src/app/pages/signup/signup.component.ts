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

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.name || !this.email || !this.password || !this.confirm) {
      this.error = 'Please fill in all fields.';
      return;
    }
    if (this.password !== this.confirm) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.auth.signup(this.name, this.email, this.password);
    this.router.navigate(['/tasks']);
  }
}
