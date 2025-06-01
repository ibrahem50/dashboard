import { DailyPetSalesResponse, PetsData } from '../interfaces/pet-sales';
import { Injectable, inject } from '@angular/core';

import { ApiService } from '../../../core/api/api.service';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetSalesService {
  private readonly path = 'pets';
  private apiService = inject(ApiService);

  getWeeklySales(endDate: Date) {
    const formattedDate = this.formatDate(endDate);
    return this.apiService
      .getRequest<PetsData>(`${this.path}/7Days/${formattedDate}`)
      .pipe(shareReplay());
  }

  getDailySales(date: Date) {
    const formattedDate = this.formatDate(date);
    return this.apiService
      .getRequest<DailyPetSalesResponse[]>(`${this.path}/${formattedDate}`)
      .pipe(shareReplay());
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }
}
