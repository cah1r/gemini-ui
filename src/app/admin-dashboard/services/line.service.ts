import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../shared/constants';
import { Line, LineViewDto } from '../../shared/model/line';

@Injectable({
  providedIn: 'root'
})
export class LineService {

  constructor(private http: HttpClient) { }

  fetchAllLines(): Observable<LineViewDto[]> {
    return this.http.get<LineViewDto[]>(API_URL + '/admin/lines')
  }

  createLine(line: Line) {
    return this.http.post(API_URL + '/admin/lines', line)
  }

}
