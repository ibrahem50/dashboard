import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'create', component: UserDetailComponent },
  { path: ':id', component: UserDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
