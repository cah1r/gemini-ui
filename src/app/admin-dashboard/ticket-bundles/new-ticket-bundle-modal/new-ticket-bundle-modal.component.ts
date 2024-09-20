import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from '../../../services/notification-factory.service';
import { StopWithLineDto } from '../../../shared/model/bus-stop';
import { LineViewDto } from '../../../shared/model/line';
import { RouteViewDto } from '../../../shared/model/route';
import {
  CreateTicketBundleRequest,
  TicketBundle,
} from '../../../shared/model/ticket-bundle.model';
import { LineService } from '../../services/line.service';
import { StopService } from '../../services/stop.service';
import { TicketBundlesService } from '../../services/ticket-bundles.service';
import { DataViewModule } from 'primeng/dataview';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-new-ticket-bundle-modal',
  standalone: true,
  imports: [
    Button,
    DataViewModule,
    DialogModule,
    DropdownModule,
    FloatLabelModule,
    InputNumberModule,
    InputSwitchModule,
    NgClass,
    NgFor,
    NgIf,
    MultiSelectModule,
    ReactiveFormsModule,
    RippleModule,
    TableModule,
    ToastModule,
  ],
  templateUrl: './new-ticket-bundle-modal.component.html',
  styleUrl: './new-ticket-bundle-modal.component.css',
})
export class NewTicketBundleModalComponent {
  display = false;
  newTicketBundleForm: FormGroup;

  @Output() bundleCreated = new EventEmitter<TicketBundle>();

  availableLines: LineViewDto[] = [];
  availableStops: StopWithLineDto[] = [];
  matchingStops: StopWithLineDto[] = [];
  selectedRoutes: RouteViewDto[] = [];

  constructor(
    private fb: FormBuilder,
    private lineService: LineService,
    private stopService: StopService,
    private routeService: RouteService,
    private ticketBundlesService: TicketBundlesService,
    private notification: NotificationService
  ) {
    this.newTicketBundleForm = this.fb.group({
      line: '',
      stopA: ['', Validators.required],
      stopB: ['', Validators.required],
      ticketsQuantity: ['', Validators.required],
      price: ['', Validators.required],
      isActive: true,
    });
    this.fetchStopsForSelectedLine();
    this.matchDestinationStop();
  }

  private fetchStopsForSelectedLine() {
    this.newTicketBundleForm
      .get('line')
      ?.valueChanges.subscribe((line: LineViewDto) => {
        this.newTicketBundleForm.get('stopA')?.enable();
        this.newTicketBundleForm.get('stopB')?.enable();
        this.stopService.fetchLineStops(line.id!).subscribe({
          next: (response) => {
            this.availableStops = response
              .map((stop: StopWithLineDto) => ({
                ...stop,
                displayName: stop.details
                  ? `${stop.town}, ${stop.details}`
                  : stop.town,
              }))
              .sort(
                (a: StopWithLineDto, b: StopWithLineDto) =>
                  a.lineOrder - b.lineOrder
              );
          },
          error: () =>
            this.notification.error(
              'Nie udało się pobrać przystanków dla wybranej linii'
            ),
        });
      });
  }

  private matchDestinationStop() {
    this.newTicketBundleForm
      .get('stopA')
      ?.valueChanges.subscribe(
        (selectedStop: StopWithLineDto) =>
          (this.matchingStops = this.availableStops.filter(
            (stop) => stop.lineOrder > selectedStop.lineOrder
          ))
      );
  }

  show() {
    this.display = true;
    this.fetchAllLines();
    this.newTicketBundleForm.get('stopA')?.disable();
    this.newTicketBundleForm.get('stopB')?.disable();
    this.newTicketBundleForm.get(['isActive'])!.setValue(true);
  }

  fetchAllLines() {
    this.lineService.fetchAllLines().subscribe({
      next: (fetchedLines) => (this.availableLines = fetchedLines),
      error: () =>
        this.notification.error('Wystąpił błąd podczas pobierania linii'),
    });
  }

  onAddRoute() {
    let stopAId = this.newTicketBundleForm.get('stopA')?.value.id;
    let stopBId = this.newTicketBundleForm.get('stopB')?.value.id;
    let lineId = this.newTicketBundleForm.get('line')?.value.id;
    if (stopAId && stopBId) {
      this.routeService.fetchRouteForStops(lineId, stopAId, stopBId).subscribe({
        next: (response) =>
          (this.selectedRoutes = [...this.selectedRoutes, response]),
        error: () =>
          this.notification.error(
            'Nie znaleziono trasy dla podanych przystanków.'
          ),
      });
    } else {
      this.notification.error('Oba przystanki musz być wybrane.');
    }
  }

  onSubmit() {
    if (this.newTicketBundleForm.valid) {
      this.ticketBundlesService
        .createTicketBundle(this.createRequest())
        .subscribe({
          next: (response) => {
            console.log(
              'TicketBundle from backend response: ' + JSON.stringify(response)
            );
            this.bundleCreated.emit(response);
            this.notification.success('Utworzono nowy pakiet biletów');
            this.onCancel();
          },
          error: (e: Error) => this.notification.error(e.message),
        });
    }
  }

  private createRequest(): CreateTicketBundleRequest {
    return {
      stopAId: this.newTicketBundleForm.get('stopA')?.value.id,
      stopBId: this.newTicketBundleForm.get('stopB')?.value.id,
      routesIds: this.selectedRoutes.map((route) => route.id),
      ticketsQuantity: this.newTicketBundleForm.get('ticketsQuantity')?.value,
      price: this.newTicketBundleForm.get('price')?.value,
      isActive: this.newTicketBundleForm.get('isActive')?.value,
    };
  }

  onCancel() {
    this.display = false;
    this.newTicketBundleForm.reset();
    this.selectedRoutes = [];
  }
}
