import {
  AttractionInterface,
  AttractionResponseInterface,
} from '../interfaces/attraction';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { ApiService } from '../../../core/api/api.service';
import { GenericSearchCriteria } from '../../../shared/models/filter';

@Injectable({
  providedIn: 'root',
})
export class AttractionService {
  private readonly path = 'attractions';
  private apiService = inject(ApiService);

  getAttractions(criteria: GenericSearchCriteria) {
    const queryParams = [
      `page=${criteria.page || 1}`,
      `per_page=${criteria.size || 10}`,
      criteria.sortBy ? `sort_column=${criteria.sortBy}` : '',
      criteria.orderBy ? `sort_order=${criteria.orderBy}` : '',
      criteria.searchName
        ? `search=${encodeURIComponent(criteria.searchName)}`
        : '',
    ]
      .filter(Boolean)
      .join('&');

    return this.apiService
      .getRequest<AttractionResponseInterface>(`${this.path}?${queryParams}`)
      .pipe(shareReplay());
  }

  addAttraction(attraction: AttractionInterface) {
    return this.apiService
      .postRequest<AttractionInterface[]>(
        `auth/attractions/create`,
        attraction,
        true
      )
      .pipe(shareReplay());
  }

  updateAttraction(attraction: AttractionInterface) {
    return this.apiService
      .putRequest<{
        status: string;
        attraction: AttractionInterface;
        message: string;
      }>(`auth/attractions/update`, attraction, true)
      .pipe(shareReplay());
  }

  getAttraction(attractionId: number) {
    return this.apiService
      .getRequest<{ status: string; attraction: AttractionInterface }>(
        `${this.path}/${attractionId}`
      )
      .pipe(
        map((res) => res.attraction),
        shareReplay()
      );
  }

  deleteAttraction(id: number) {
    return this.apiService
      .deleteRequest<{ status: string; message: string }>(
        `${this.path}/delete`,
        { id }
      )
      .pipe(shareReplay());
  }
}
