import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let clonedRequest = req;

  if (token && req.url.includes('localhost:8080')) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status == 401 || error.status == 403) {
        console.warn(
          'Sessão expirada ou inválida pelo servidor. Limpando cachê...',
        );

        localStorage.removeItem('scoutly_jwt');
        localStorage.removeItem('scoutly_guest_memory');

        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );

  return next(req);
};
