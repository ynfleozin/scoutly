import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/auth';

  private TOKEN_KEY = 'scoutly_jwt';
  private GUEST_MEMORY_KEY = 'scoutly_guest_memory';

  guestLogin(): Observable<{ token: string }> {
    const currentToken = this.getToken();
    if (currentToken) {
      return of({ token: currentToken });
    }

    const savedGuestToken = localStorage.getItem(this.GUEST_MEMORY_KEY);
    if (savedGuestToken) {
      console.log(
        'Recuperando conta da memória...',
      );
      this.saveToken(savedGuestToken);
      return of({ token: savedGuestToken });
    }

    console.log('Criando visitante no Java...');
    return this.http.post<{ token: string }>(`${this.apiUrl}/guest`, {}).pipe(
      tap((response) => {
        this.saveToken(response.token);
        localStorage.setItem(this.GUEST_MEMORY_KEY, response.token);
      }),
    );
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
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
