import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordMatch(group: AbstractControl) {
  const pw = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return pw === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  error = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    }, { validators: passwordMatch });
  }

  get nameCtrl() { return this.signupForm.get('name')!; }
  get emailCtrl() { return this.signupForm.get('email')!; }
  get passwordCtrl() { return this.signupForm.get('password')!; }
  get confirmCtrl() { return this.signupForm.get('confirm')!; }

  submit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.error = '';
    const { name, email, password } = this.signupForm.value;
    this.auth.signup({ name, email, password }).subscribe({
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
