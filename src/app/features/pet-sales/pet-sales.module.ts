import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgModule } from '@angular/core';
import { PetSalesComponent } from './pet-sales.component';
import { PetSalesRoutingModule } from './pet-sales-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [PetSalesComponent],
  imports: [
    CommonModule,
    NgApexchartsModule,
    PetSalesRoutingModule,
    SharedModule,
  ],
})
export class PetSalesModule {}
