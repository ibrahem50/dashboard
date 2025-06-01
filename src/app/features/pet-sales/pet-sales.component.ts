import { Component, OnInit, inject } from '@angular/core';

import { DailyPetSalesResponse } from './interfaces/pet-sales';
import { PetSalesService } from './services/pet-sales.service';

@Component({
  selector: 'app-pet-sales',
  templateUrl: './pet-sales.component.html',
  styleUrl: './pet-sales.component.scss',
  standalone: false,
})
export class PetSalesComponent implements OnInit {
  private petSalesService = inject(PetSalesService);
  readonly today: Date = new Date();
  weeklySeries: any[] = [];
  chartOptions: any;
  categories: string[] = [];
  dailySales: DailyPetSalesResponse[] = [];
  displayedColumns: string[] = ['date', 'animal', 'price'];

  ngOnInit(): void {
    const today = new Date();
    this.loadWeeklySales(today);
    this.loadDailySales(today);
  }

  loadWeeklySales(date: Date) {
    this.petSalesService.getWeeklySales(date).subscribe((res) => {
      this.weeklySeries = res.series;
      this.categories = res.categories;
      this.chartOptions = {
        chart: {
          type: 'line',
          height: 350,
        },
        xaxis: {
          categories: this.categories,
        },
      };
    });
  }

  loadDailySales(date: Date) {
    this.petSalesService.getDailySales(date).subscribe((res) => {
      this.dailySales = res.map((item) => ({
        ...item,
        price: +item.price,
      }));
      console.log(this.dailySales);
    });
  }

  onDailySelected(date: Date) {
    this.loadDailySales(date);
  }

  onWeeklySelected(date: Date) {
    this.loadWeeklySales(date);
  }
}
