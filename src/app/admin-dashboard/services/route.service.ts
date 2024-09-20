import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateRouteDto,
  RouteDto,
  RouteViewDto,
} from '../../shared/model/route';
import { API_URL } from '../../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor(private http: HttpClient) {}

  createRoute(route: CreateRouteDto) {
    return this.http.post<RouteDto>(API_URL + '/routes', route);
  }

  fetchRouteForStops(lineId: number, stopAId: number, stopBId: number) {
    return this.http.get<RouteViewDto>(
      `${API_URL}/routes?lineId=${lineId}&stopAId=${stopAId}&stopBId=${stopBId}`
    );
  }
}
