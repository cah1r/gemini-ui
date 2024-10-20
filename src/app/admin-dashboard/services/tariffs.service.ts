import { Injectable } from '@angular/core';
import { LineViewDto } from '../../shared/model/line';
import { API_URL } from '../../shared/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TariffsService {
  constructor(private http: HttpClient) {}

  downloadTariffExcel(line: LineViewDto) {
    this.http
      .get(
        API_URL + '/admin/tariffs/generate-excel-template?lineId=' + line.id,
        { responseType: 'blob' }
      )
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Cennik ' + line.description + '.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
