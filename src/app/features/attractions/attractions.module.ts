import { CommonModule, NgOptimizedImage } from '@angular/common';

import { AttractionDetailComponent } from './components/attraction-detail/attraction-detail.component';
import { AttractionListComponent } from './components/attraction-list/attraction-list.component';
import { AttractionsRoutingModule } from './attractions-routing.module';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AttractionDetailComponent, AttractionListComponent],
  imports: [
    NgOptimizedImage,
    CommonModule,
    SharedModule,
    AttractionsRoutingModule,
    FilterComponent,
  ],
})
export class AttractionsModule {}
