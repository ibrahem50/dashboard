import { RouterModule, Routes, provideRouter } from '@angular/router';

import { NgModule } from '@angular/core';
import { guestGuard } from './core/guards/guest.guard';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'attractions',
    loadChildren: () =>
      import('./features/attractions/attractions.module').then(
        (m) => m.AttractionsModule
      ),
  },
  {
    path: 'pet-sales',
    loadChildren: () =>
      import('./features/pet-sales/pet-sales.module').then(
        (m) => m.PetSalesModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
    canActivate: [guestGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
