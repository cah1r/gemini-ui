import { CommonModule, CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { NotificationService } from '../../services/notification-factory.service';
import { API_URL } from '../../shared/constants';
import { LineViewDto } from '../../shared/model/line';
import { Page } from '../../shared/model/page';
import { RouteDto } from '../../shared/model/route';
import { LineService } from '../services/line.service';
import { TariffsService } from '../services/tariffs.service';
import { NewRouteModalComponent } from './new-route-modal/new-route-modal.component';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    DropdownModule,
    InputNumberModule,
    Button,
    CheckboxModule,
    TableModule,
    TagModule,
    NgIf,
    CurrencyPipe,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    ChipsModule,
    DecimalPipe,
    NewRouteModalComponent,
    InfiniteScrollDirective,
    CommonModule,
    PaginatorModule,
    CardModule,
    InputSwitchModule,
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css',
})
export class RouteComponent implements OnInit {
  @ViewChild('newRouteModal') newRouteModal!: NewRouteModalComponent;
  private _allRoutes: RouteDto[] = [];
  lines: LineViewDto[] = [];
  selectedLine: LineViewDto | undefined;

  keyword: string = '';
  tableSize = 'p-datatable-sm';

  first = 0;
  rows = 10;
  totalRecords = 0;
  currentPage = 0;

  constructor(
    private http: HttpClient,
    private lineService: LineService,
    private tariffsService: TariffsService,
    private confirmationService: ConfirmationService,
    private notification: NotificationService
  ) {}

  oneOfTwo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const durationH = control.get('durationH')?.value;
      const durationM = control.get('durationM')?.value;

      return durationH || durationM ? null : { oneOfTwo: true };
    };
  }

  ngOnInit() {
    this.fetchInitialData();
  }

  private fetchInitialData() {
    this.lineService.fetchAllLines().subscribe((data) => {
      this.lines = data;
      this.selectedLine = this.lines[0];
      this.loadRoutes({ page: 0 });
    });
  }

  openNewRouteModal() {
    if (this.newRouteModal) {
      this.newRouteModal.show();
    }
  }

  get allRoutes(): RouteDto[] {
    return this._allRoutes;
  }

  onRouteCreated() {
    this.loadRoutes({ page: this.currentPage });
    if (this.newRouteModal) {
      this.newRouteModal.hide();
    }
  }

  onGlobalFilter(event: Event) {
    throw new Error('Method not implemented.');
  }

  loadRoutes(event: PaginatorState) {
    const params = new HttpParams()
      .set('keyword', this.keyword)
      .set('page', event.page!)
      .set('size', this.rows)
      .set('lineId', this.selectedLine!.id);

    this.http.get<Page<RouteDto>>(API_URL + `/routes`, { params }).subscribe({
      next: (data) => {
        this._allRoutes = data.content;
        this.totalRecords = data.page.totalElements;
        this.currentPage = event.page!;
        console.log(JSON.stringify(event));
      },
      error: (e) => {
        if (e.status !== 401) {
          this.notification.error('Wystąpił błąd podczas pobierania tras');
        }
      },
    });
  }

  onLineChange() {
    const paginator: PaginatorState = { page: 0, rows: this.rows };
    this.loadRoutes(paginator);
  }

  onDeleteRoute(id: string) {
    this.confirmationService.confirm({
      message: 'Czy jesteś pewny, że chcesz usunąć wskazaną trasę?',
      header: 'Usuwanie',
      acceptLabel: 'Tak',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectLabel: 'Nie',
      rejectButtonStyleClass: 'p-button-text',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRoute(id);
      },
    });
  }

  private deleteRoute(id: string) {
    this.http.delete(API_URL + '/routes/' + id).subscribe({
      next: () => this.loadRoutes({ page: this.currentPage }),
      error: (err) => console.log("Couldn't delete route", err),
    });
  }

  setTicketAvailability(event: InputSwitchChangeEvent, route: RouteDto) {
    this.http
      .patch(
        API_URL + `/routes/${route.id}/set-ticket-availability`,
        {
          isTicketAvailable: event.checked,
        },
        { withCredentials: true }
      )
      .subscribe({
        error: () => {
          this.notification.error('Wystąpił błąd podczas zmiany statusu');
          route.isTicketAvailable = !event.checked;
        },
      });
  }

  getSeverity(isActive: boolean) {
    return isActive ? 'success' : 'secondary';
  }

  mapBooleanToStatus(isActive: boolean) {
    return isActive ? 'Aktywna' : 'Nieaktywna';
  }

  setActiveStatus(id: string, status: boolean) {
    this.http
      .patch<any>(
        API_URL + `/routes/${id}/set-status`,
        {
          id: id,
          isActive: status,
        },
        { withCredentials: true }
      )
      .subscribe({
        next: () => this.loadRoutes({ page: this.currentPage }),
        error: () =>
          this.notification.error('Wystąpił błąd podczas zmiany statusu'),
      });
  }

  formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let timeString = '';

    if (hours > 0) timeString += `${hours}h`;
    if (minutes > 0 || hours === 0) timeString += ` ${minutes}m`;

    return timeString.trim();
  }

  formatCityInfo(city: string, details: string) {
    const formatedDetails = details === null ? '' : ', ' + details;
    return city + formatedDetails;
  }

  downloadTariffExcel() {
    this.tariffsService.downloadTariffExcel(this.selectedLine!);
  }

  loadTariffsFromFile() {
    console.error('Method not implemented');
  }
}
