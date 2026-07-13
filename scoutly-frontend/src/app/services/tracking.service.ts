import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TrackingRequestDTO,
  TrackingResponseDTO,
} from '../models/tracking.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/tracking`;

  getTrackedProducts(): Observable<TrackingResponseDTO[]> {
    return this.http.get<TrackingResponseDTO[]>(this.apiUrl);
  }

  addTrackedProduct(data: TrackingRequestDTO): Observable<TrackingResponseDTO> {
    return this.http.post<TrackingResponseDTO>(this.apiUrl, data);
  }

  toggleStatus(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, {});
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
