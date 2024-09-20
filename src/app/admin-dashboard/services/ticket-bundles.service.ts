import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../shared/constants';
import {
  CreateTicketBundleRequest,
  TicketBundle,
} from '../../shared/model/ticket-bundle.model';

@Injectable({
  providedIn: 'root',
})
export class TicketBundlesService {
  bundlesURI: string = API_URL + '/admin/bundles';

  constructor(private http: HttpClient) {}

  getAllTicketBundles(): Observable<TicketBundle[]> {
    return this.http.get<TicketBundle[]>(this.bundlesURI);
  }

  deleteTicketBundle(id: string): Observable<void> {
    return this.http.delete<void>(this.bundlesURI + '?id=' + id);
  }

  createTicketBundle(request: CreateTicketBundleRequest) {
    return this.http.post<TicketBundle>(this.bundlesURI, request);
  }

  setActiveStatus(id: string, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`${this.bundlesURI}/${id}/set-active-status`, {
      isActive: isActive,
    });
  }
}
