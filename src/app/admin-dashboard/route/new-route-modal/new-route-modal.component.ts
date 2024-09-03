import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { API_URL } from '../../../shared/constants';
import { StopWithLineDto } from '../../../shared/model/bus-stop';
import { Line } from '../../../shared/model/line';
import { RouteDto } from '../../../shared/model/route';

@Component({
  selector: 'app-new-route-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    Button,
    InputGroupModule,
    InputGroupAddonModule,
    InputNumberModule,
    CheckboxModule,
    DropdownModule,
  ],
  templateUrl: './new-route-modal.component.html',
  styleUrl: './new-route-modal.component.css',
})
export class NewRouteModalComponent implements OnInit {
  private _availableLines: Line[] = [];
  private _allBusStops: StopWithLineDto[] = [];
  private _matchingBusStops: StopWithLineDto[] = [];

  @Output() routeCreated = new EventEmitter<void>();

  display = false;
  newRouteForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.newRouteForm = fb.group({
      selectedLine: [null, Validators.required],
      initialStop: [{ value: null, disabled: true }, Validators.required],
      lastStop: [{ value: null, disabled: true }, Validators.required],
      price: null,
      isActive: [true],
      isTicketAvailable: [true],
    });

    this.newRouteForm
      .get('selectedLine')
      ?.valueChanges.subscribe((selectedLine: Line) => {
        if (selectedLine) {
          this.newRouteForm.get('initialStop')?.enable();
          this.newRouteForm.get('lastStop')?.enable();
          this._matchingBusStops = this._allBusStops
            .filter((stop) => stop.lineId === selectedLine.id)
            .sort((a, b) => a.lineOrder - b.lineOrder);
        } else {
          this.newRouteForm.get('initialValue')?.disable();
          this.newRouteForm.get('lastStop')?.disable();
        }
      });
  }

  ngOnInit() {
    this.fetchAllLines();
    this.fetchAllBusStops();
  }

  fetchAllLines() {
    this.http.get<Line[]>(API_URL + '/admin/lines').subscribe({
      next: (fetchedLines) => (this._availableLines = fetchedLines),
      error: (e) =>
        console.log(
          'Error occurred while fetching lines from backend service.',
          e
        ),
    });
  }

  fetchAllBusStops() {
    this.http.get<StopWithLineDto[]>(API_URL + '/admin/stops').subscribe({
      next: (fetchedData) => (this._allBusStops = fetchedData),
      error: (e) =>
        console.log(
          'Error occurred while fetching bus stops from backend service.',
          e
        ),
    });
  }

  show() {
    this.display = true;
  }

  onSubmit() {
    const initialStop = this.newRouteForm.get('initialStop')?.value;
    const lastStop = this.newRouteForm.get('lastStop')?.value;

    const routeDto = {
      originStopId: initialStop ? initialStop.id : null,
      destinationStopId: lastStop ? lastStop.id : null,
      price: this.newRouteForm.get('price')?.value,
      isActive: this.newRouteForm.get('isActive')?.value,
      isTicketAvailable: this.newRouteForm.get('isTicketAvailable')?.value,
    };
    this.http.post<RouteDto>(API_URL + '/route/create', routeDto).subscribe({
      next: () => {
        this.newRouteForm.reset();
        this.newRouteForm.get(['isActive'])!.setValue(true);
        this.newRouteForm.get(['isTicketAvailable'])!.setValue(true);
        this.display = false;
        this.routeCreated.emit();
      },
      error: (err) => console.log("Couldn't create route", err),
    });
  }

  onCancel() {
    this.newRouteForm.reset();
    this.newRouteForm.get('initialStop')?.disable();
    this.newRouteForm.get('isActive')?.setValue(true);
    this.newRouteForm.get('isTicketAvailable')?.setValue(true);
    this.display = false;
  }

  get availableLines() {
    return this._availableLines;
  }

  get matchingBusStops() {
    return this._matchingBusStops;
  }
}
