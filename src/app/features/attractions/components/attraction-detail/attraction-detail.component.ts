import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AttractionService } from '../../services/attraction.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-attraction-detail',
  templateUrl: './attraction-detail.component.html',
  styleUrl: './attraction-detail.component.scss',
  standalone: false,
})
export class AttractionDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private attractionService = inject(AttractionService);
  isEditMode = false;
  attractionId!: number | null;
  attractionForm!: FormGroup;

  ngOnInit(): void {
    this.attractionForm = this.fb.group({
      name: ['', Validators.required],
      detail: ['', Validators.required],
      latitude: ['', [Validators.required]],
      longitude: ['', Validators.required],
      coverimage: [
        'https://www.melivecode.com/users/cat.png',
        Validators.required,
      ],
    });

    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam === 'create' || idParam === null) {
        this.isEditMode = false;
        this.attractionId = null;
      } else {
        this.isEditMode = true;
        this.attractionId = +idParam;
        this.getattractionDetails();
      }
    });
  }

  getattractionDetails() {
    this.attractionService
      .getAttraction(this.attractionId as number)
      .subscribe({
        next: (attraction) => {
          this.attractionForm.patchValue({
            name: attraction.name,
            detail: attraction.detail,
            coverimage: attraction.coverimage,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
          });
        },
        error: (err) => {
          console.error('Failed to load attraction data:', err);
        },
      });
  }

  onSubmit() {
    console.log(this.attractionForm.value);
    this.attractionForm.markAllAsTouched();
    if (this.attractionForm.invalid) return;

    if (this.isEditMode) {
      this.attractionService
        .updateAttraction({
          ...this.attractionForm.value,
          id: this.attractionId,
        })
        .subscribe({
          next: (res) => {
            this.notificationService.showMessage(
              res.message,
              res.status === 'error'
            );
            this.router.navigateByUrl('attractions');
          },
          error: (err) => {
            this.notificationService.showMessage(err.error.message, true);
          },
        });
    } else {
      this.attractionService
        .addAttraction(this.attractionForm.value)
        .subscribe({
          next: () => {
            this.notificationService.showMessage(
              'attraction Added successfully!'
            );
            this.router.navigateByUrl('attractions');
          },
          error: (err) => {
            this.notificationService.showMessage(err.error.message, true);
          },
        });
    }
  }
}
