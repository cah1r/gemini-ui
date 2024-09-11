import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../shared/constants';
import { Car } from '../../shared/model/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  constructor(private http: HttpClient) { }

  createCar(car: Car) {
    return this.http.post<number>(API_URL + '/admin/cars', car)
  }

  fetchAllCars() {
    return this.http.get<Car[]>(API_URL + '/admin/cars')
  }

  deleteCar(id: number) {
    return this.http.delete(API_URL + '/admin/cars/' + id)
  }
}
