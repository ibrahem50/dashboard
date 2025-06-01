import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticatedSync()) {
    return true;
  }

  router.navigate(['/users']);
  return false;
};
