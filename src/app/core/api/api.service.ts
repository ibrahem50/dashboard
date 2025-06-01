import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private getAuthToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  private getHttpOptions(withAuthToken: boolean = false) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (withAuthToken) {
      const token = this.getAuthToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return { headers };
  }

  getRequest<T>(path: string): Observable<T> {
    return this.http.get<T>(
      `${environment.apiUrl}/${path}`,
      this.getHttpOptions()
    );
  }

  postRequest<T>(
    path: string,
    data: any,
    withAuthToken: boolean = false
  ): Observable<T> {
    return this.http.post<T>(
      `${environment.apiUrl}/${path}`,
      data,
      this.getHttpOptions(withAuthToken)
    );
  }

  putRequest<T>(
    path: string,
    data: any,
    withAuthToken: boolean = false
  ): Observable<T> {
    return this.http.put<T>(
      `${environment.apiUrl}/${path}`,
      data,
      this.getHttpOptions(withAuthToken)
    );
  }

  deleteRequest<T>(
    path: string,
    data: any,
    withAuthToken: boolean = false
  ): Observable<T> {
    const options = this.getHttpOptions(withAuthToken);

    return this.http.delete<T>(`${environment.apiUrl}/${path}`, {
      ...options,
      body: data,
    });
  }
}
