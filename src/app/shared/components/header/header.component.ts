import { Component, OnInit, inject } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterModule, CommonModule],
  standalone: true,
})
export class HeaderComponent {
  private authService = inject(AuthService);
  isLoggedIn$: Observable<boolean> = this.authService.isAuthenticated$;

  logout() {
    this.authService.logout();
  }
}
