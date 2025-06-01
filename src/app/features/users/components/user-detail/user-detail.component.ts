import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../../../shared/services/notification.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  standalone: false,
})
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private userService = inject(UserService);
  isEditMode = false;
  userId!: number | null;
  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      avatar: ['https://www.melivecode.com/users/cat.png', Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam === 'create' || idParam === null) {
        this.isEditMode = false;
        this.userId = null;
      } else {
        this.isEditMode = true;
        this.userId = +idParam;
        this.getUserDetails();
      }
    });
  }

  getUserDetails() {
    this.userService.getUser(this.userId as number).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          fname: user.fname,
          lname: user.lname,
          username: user.username,
          email: user.email,
          password: '',
          avatar: user.avatar,
        });
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
      },
    });
  }

  onSubmit() {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) return;

    if (this.isEditMode) {
      this.userService
        .updateUser({ ...this.userForm.value, id: this.userId })
        .subscribe({
          next: (res) => {
            this.notificationService.showMessage(
              res.message,
              res.status === 'error'
            );
          },
        });
    } else {
      this.userService.addUser(this.userForm.value).subscribe((res) => {
        this.notificationService.showMessage('User Added successfully!');
        this.router.navigateByUrl('users');
      });
    }
  }
}
