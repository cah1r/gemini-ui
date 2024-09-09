import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
import { NotificationService } from '../../../services/notification-factory.service';
import { StopWithLineDto } from '../../../shared/model/bus-stop';
import { Line } from '../../../shared/model/line';
import { LineService } from '../../services/line.service';
import { RouteService } from '../../services/route.service';
import { StopService } from '../../services/stop.service';

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
    NgIf,
  ],
  templateUrl: './new-route-modal.component.html',
  styleUrl: './new-route-modal.component.css',
})
export class NewRouteModalComponent {
  private _availableLines: Line[] = [];
  private _matchingBusStops: StopWithLineDto[] = [];

  @Output() routeCreated = new EventEmitter<void>();

  display = false;
  newRouteForm: FormGroup;

  constructor(
    private routeService: RouteService,
    private lineService: LineService,
    private stopService: StopService,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {
    this.newRouteForm = this.fb.group({
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
          this.stopService.fetchLineStops(selectedLine.id!).subscribe({
            next: (fetchedStops) => this._matchingBusStops = fetchedStops.sort((a, b) => a.lineOrder - b.lineOrder),
            error: () =>
              this.notification.error('Wystąpił błąd podczas pobierania przystanków'),
          })
        } else {
          this.newRouteForm.get('initialValue')?.disable();
          this.newRouteForm.get('lastStop')?.disable();
        }
      });
  }

  fetchAllLines() {
    this.lineService.fetchAllLines().subscribe({
      next: (fetchedLines) => (this._availableLines = fetchedLines),
      error: () =>
        this.notification.error('Wystąpił błąd podczas pobierania linii'),
    });
  }

  show() {
    this.display = true;
    this.fetchAllLines();
  }

  hide() {
    this.display = false;
  }

  onSubmit() {
    const initialStop = this.newRouteForm.get('initialStop')?.value;
    const lastStop = this.newRouteForm.get('lastStop')?.value;

    const createRouteDto = {
      originStopId: initialStop ? initialStop.id : null,
      destinationStopId: lastStop ? lastStop.id : null,
      price: this.newRouteForm.get('price')?.value,
      isActive: this.newRouteForm.get('isActive')?.value,
      isTicketAvailable: this.newRouteForm.get('isTicketAvailable')?.value,
    };
    this.routeService.createRoute(createRouteDto).subscribe({
      next: () => {
        this.resetForm();
        this.display = false;
        this.routeCreated.emit();
      },
      error: (err) => console.log("Couldn't create route", err),
    });
  }

  private resetForm() {
    this.newRouteForm.reset();
    this.newRouteForm.get('initialStop')?.disable();
    this.newRouteForm.get(['isActive'])!.setValue(true);
    this.newRouteForm.get(['isTicketAvailable'])!.setValue(true);
  }

  onCancel() {
    this.resetForm();
    this.display = false;
  }

  get availableLines() {
    return this._availableLines;
  }

  get matchingBusStops() {
    return this._matchingBusStops;
  }
}
