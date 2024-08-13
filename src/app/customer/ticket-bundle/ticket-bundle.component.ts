import {Component, OnInit} from '@angular/core';
import {DataViewModule} from "primeng/dataview";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Button} from "primeng/button";
import {TagModule} from "primeng/tag";
import {TicketBundle} from "./model/ticket-bundle";
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../../shared/constants";
import {BusStop} from "./model/bus-stop";

@Component({
  selector: 'app-ticket-bundle',
  standalone: true,
  imports: [
    DataViewModule,
    NgForOf,
    Button,
    TagModule,
    NgIf,
    NgClass
  ],
  templateUrl: './ticket-bundle.component.html',
  styleUrl: './ticket-bundle.component.css'
})
export class TicketBundleComponent implements OnInit {

  private _showTicketBundles: boolean = false
  private _ticketBundleList: TicketBundle[] = []
  private _busStops: BusStop[] = []

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<BusStop[]>(API_URL + '/bus-stop/get-all').subscribe({
      next: busStopList => this._busStops = busStopList,
      error: e => console.error(`Couldn't fetch bus stop list`, e)
      }
    )
  }

  get showTicketBundles(): boolean {
    return this._showTicketBundles;
  }

  get ticketBundleList(): TicketBundle[] {
    return this._ticketBundleList;
  }

  get busStops(): BusStop[] {
    return this._busStops;
  }

}
