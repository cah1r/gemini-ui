import { NgClass, NgForOf, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { API_URL } from '../../shared/constants';
import { StopDto } from '../../shared/model/bus-stop';
import { TicketBundle } from '../../shared/model/ticket-bundle';

@Component({
  selector: 'app-ticket-bundle',
  standalone: true,
  imports: [DataViewModule, NgForOf, Button, TagModule, NgIf, NgClass],
  templateUrl: './ticket-bundle.component.html',
  styleUrl: './ticket-bundle.component.css',
})
export class TicketBundleComponent implements OnInit {
  private _showTicketBundles: boolean = false;
  private _ticketBundleList: TicketBundle[] = [];
  private _busStops: StopDto[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<StopDto[]>(API_URL + '/admin/stops').subscribe({
      next: (busStopList) => (this._busStops = busStopList),
      error: (e) => console.error(`Couldn't fetch bus stop list`, e),
    });
  }

  get showTicketBundles(): boolean {
    return this._showTicketBundles;
  }

  get ticketBundleList(): TicketBundle[] {
    return this._ticketBundleList;
  }

  get busStops(): StopDto[] {
    return this._busStops;
  }
}
