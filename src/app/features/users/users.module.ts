import { CommonModule, NgOptimizedImage } from '@angular/common';

import { FilterComponent } from '../../shared/components/filter/filter.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [UserListComponent, UserDetailComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    FilterComponent,
    NgOptimizedImage,
  ],
})
export class UsersModule {}
