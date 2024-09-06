import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../shared/constants';
import { StopWithLineDto } from '../../shared/model/bus-stop';

@Injectable({
  providedIn: 'root'
})
export class StopService {

  constructor(private http: HttpClient) { }

  fetchAllStops(): Observable<StopWithLineDto[]> {
    return this.http.get<StopWithLineDto[]>(API_URL + '/admin/stops')
  }

  updateStops(stops: StopWithLineDto[]) {
    return this.http.put(API_URL + '/admin/stops', stops).subscribe()
  }

  fetchLineStops(lineId: number): Observable<StopWithLineDto[]> {
    return this.http.get<StopWithLineDto[]>(API_URL + `/admin/lines/${lineId}/stops`)
  }

  deleteStop(stopId: number) {
    return this.http.delete(API_URL + `/admin/stops/${stopId}`)
  }

  updateStopsOrder(event: any, stops: StopWithLineDto[]) {
    if (event.dragIndex !== event.dropIndex) {
      const movedItem = stops.splice(event.dragIndex, 1)[0];
      stops.splice(event.dropIndex, 0, movedItem);
      stops.forEach((stop, index) => (stop.lineOrder = index + 1));
      const startIndex = Math.min(event.dragIndex, event.dropIndex)
      this.updateStops(stops.slice(startIndex))
    }
  }
}
