import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver, DriverDto } from '../../shared/model/driver.model';
import { API_URL } from '../../shared/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private http: HttpClient) { }

  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(API_URL + '/admin/drivers');
  }

  deleteDriver(id: string): Observable<void> {
    return this.http.delete<void>(API_URL + '/admin/drivers/' + id);
  }

  createDriver(driver: DriverDto) {
    return this.http.post<string>(API_URL + '/admin/drivers', driver);
  }

  setActiveStatus(id: string, isActive: boolean): Observable<void> {
    return this.http.patch<void>(API_URL + `/admin/drivers/${id}/set-active-status`, { isActive: isActive })
  }
}
