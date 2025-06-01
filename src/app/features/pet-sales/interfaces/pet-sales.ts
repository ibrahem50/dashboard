export interface PetsData {
  series: SeriesItem[];
  categories: string[];
}

export interface SeriesItem {
  name: string;
  data: number[];
}

export interface DailyPetSalesResponse {
  date: string;
  animal: string;
  price: number;
}
