import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { UserInterface, UserResponse } from '../interface/user';

import { ApiService } from '../../../core/api/api.service';
import { GenericSearchCriteria } from '../../../shared/models/filter';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly path = 'users';
  private apiService = inject(ApiService);

  getUsers(criteria: GenericSearchCriteria) {
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
      .getRequest<UserResponse>(`${this.path}?${queryParams}`)
      .pipe(shareReplay());
  }

  addUser(user: UserInterface) {
    return this.apiService
      .postRequest<UserInterface[]>(`${this.path}/create`, user)
      .pipe(shareReplay());
  }

  updateUser(user: UserInterface) {
    return this.apiService
      .putRequest<{ status: string; user: UserInterface; message: string }>(
        `${this.path}/update`,
        user
      )
      .pipe(shareReplay());
  }

  getUser(userId: number) {
    return this.apiService
      .getRequest<{ status: string; user: UserInterface }>(
        `${this.path}/${userId}`
      )
      .pipe(
        map((res) => res.user),
        shareReplay()
      );
  }

  deleteUser(id: number) {
    return this.apiService
      .deleteRequest<{ status: string; message: string }>(
        `${this.path}/delete`,
        { id }
      )
      .pipe(shareReplay());
  }
}
