import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { NotificationService } from '../../services/notification-factory.service';
import { API_URL } from '../../shared/constants';
import { Stop } from '../../shared/model/bus-stop';
import { Line } from '../../shared/model/line';
import { NewLineModalComponent } from './new-line-modal/new-line-modal.component';
import { NewStopModalComponent } from './new-stop-modal/new-stop-modal.component';

@Component({
  selector: 'app-line',
  standalone: true,
  imports: [
    PanelModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    Button,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    TableModule,
    NewLineModalComponent,
    AccordionModule,
    NewStopModalComponent,
    ConfirmDialogModule,
  ],
  templateUrl: './line.component.html',
  styleUrl: './line.component.css',
})
export class LineComponent implements OnInit {
  newLineForm: FormGroup;
  private _allLines: Line[] = [];
  expandedStops = {};
  tableSize: any = 'p-datatable-sm';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private notification: NotificationService,
    private confirmationService: ConfirmationService
  ) {
    this.newLineForm = this.fb.group({
      lineDescription: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchAllLines();
  }

  get getAllLines(): Line[] {
    return this._allLines;
  }

  countStops(line: Line) {
    return line.stops?.length;
  }

  onRowReorder(event: any, stops: Stop[]) {
    if (event.dragIndex !== event.dropIndex) {
      const movedItem = stops.splice(event.dragIndex, 1)[0];
      stops.splice(event.dropIndex, 0, movedItem);
      stops.forEach((stop, index) => (stop.lineOrder = index + 1));
      this.updateStopsOrder(stops);
    }
  }

  updateStopsOrder(stops: Stop[]) {
    this.http.put(API_URL + '/admin/stops', stops).subscribe();
  }

  onSubmit() {
    const line: Line = {
      description: this.newLineForm.get('lineDescription')?.value,
    };
    this.http.post(API_URL + '/admin/lines', line).subscribe({
      next: () => this.notification.success(`Utowrzono nowa trasę ${line.description}`),
      error: () => this.notification.error('Wystapił bład podczas tworzenia nowej linii'),
    });
    this.newLineForm.reset();
  }

  onStopCreated() {
    this.fetchAllLines();
  }

  fetchAllLines() {
    this.http.get<Line[]>(API_URL + '/admin/lines').subscribe({
      next: (fetchedLines) => (this._allLines = fetchedLines),
    });
  }

  formatCityInfo(town: string, details: string) {
    const formatedDetails = details === null ? '' : ',   ' + details;
    return town + formatedDetails;
  }

  onDeleteBusStop(id: number) {
    this.confirmationService.confirm({
      message: 'Czy jesteś pewny, że chcesz usunąć wskazany przystanek?',
      header: 'Usuwanie',
      acceptLabel: 'Tak',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectLabel: 'Nie',
      rejectButtonStyleClass: 'p-button-text',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteBusStop(id);
      },
    });
  }

  deleteBusStop(id: number) {
    this.http.delete(API_URL + '/admin/stops/' + id).subscribe({
      next: () => {
        this.fetchAllLines(),
          this.notification.success("Poprawnie usunięto wskazany przystanek")
      },
      error: () => this.notification.error("Wystąpił błąd podczas usuwania przystanku")
    });
  }
}
