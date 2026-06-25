import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  guestLogin(): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/guest`, {})
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  login(credentials: any): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  private saveToken(token: string): void {
    localStorage.setItem('scoutly_jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('scoutly_jwt');
  }

  logout(): void {
    localStorage.removeItem('scoutly_jwt');
  }
}
