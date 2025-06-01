export interface AttractionInterface {
  id: number;
  name: string;
  detail: string;
  coverimage: string;
  latitude: number;
  longitude: number;
}

export interface AttractionResponseInterface {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: AttractionInterface[];
}
