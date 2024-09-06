import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateRouteDto, RouteDto } from '../../shared/model/route';
import { API_URL } from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }

  createRoute(route: CreateRouteDto) {
    return this.http.post<RouteDto>(API_URL + '/routes', route)
  }

}
