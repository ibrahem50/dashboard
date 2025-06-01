import { Component, OnInit, inject } from '@angular/core';

import { AuthService } from './core/services/auth.service';
import { LoadingService } from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent {
  private loadingService = inject(LoadingService);
  loading$ = this.loadingService.loading$;
  title = 'dashboard';
}
