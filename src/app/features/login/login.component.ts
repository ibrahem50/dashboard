import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false,
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  userData: { userName: string; password: string } = {
    userName: '',
    password: '',
  };
  errorMessage: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  loginSubmit() {
    this.errorMessage = false;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.userData = this.loginForm.value;
      this.authService
        .login({
          username: this.userData.userName,
          password: this.userData.password,
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.errorMessage = true;
          },
        });
    }
  }
}
