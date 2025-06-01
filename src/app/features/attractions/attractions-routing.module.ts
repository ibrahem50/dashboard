import { RouterModule, Routes } from '@angular/router';

import { AttractionDetailComponent } from './components/attraction-detail/attraction-detail.component';
import { AttractionListComponent } from './components/attraction-list/attraction-list.component';
import { NgModule } from '@angular/core';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: AttractionListComponent },
  {
    path: 'create',
    component: AttractionDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: ':id',
    component: AttractionDetailComponent,
    canActivate: [authGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttractionsRoutingModule {}
