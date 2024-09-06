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
import { Stop, StopWithLineDto } from '../../shared/model/bus-stop';
import { Line, LineViewDto } from '../../shared/model/line';
import { LineService } from '../services/line.service';
import { NewLineModalComponent } from './new-line-modal/new-line-modal.component';
import { NewStopModalComponent } from './new-stop-modal/new-stop-modal.component';
import { StopService } from '../services/stop.service';

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
  private _allLines: LineViewDto[] = [];
  stopsCache: { [lineId: number]: StopWithLineDto[] } = {}
  expandedStops = {};
  tableSize: any = 'p-datatable-sm';

  constructor(
    private lineService: LineService,
    private stopService: StopService,
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

  get allLines(): Line[] {
    return this._allLines;
  }

  countStops(line: Line) {
    return line.stops?.length;
  }

  onRowReorder(event: any, stops: StopWithLineDto[]) {
    this.stopService.updateStopsOrder(event, stops)
  }



  onSubmit() {
    const line: Line = {
      description: this.newLineForm.get('lineDescription')?.value,
    };
    this.lineService.createLine(line).subscribe({
      next: () => this.notification.success(`Utowrzono nowa trasę ${line.description}`),
      error: () => this.notification.error('Wystapił bład podczas tworzenia nowej linii'),
    });
    this.newLineForm.reset();
  }

  onStopCreated() {
    this.fetchAllLines();
  }

  fetchAllLines() {
    this.lineService.fetchAllLines().subscribe({
      next: (fetchedLines) => (this._allLines = fetchedLines),
    });
  }

  fetchLineStops(lineId: number) {
    if (!this.stopsCache[lineId]) {
      this.stopService.fetchLineStops(lineId).subscribe({
        next: (fetchedStops) => (this.stopsCache[lineId] = fetchedStops),
      });
    }
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
      accept: () => this.deleteStop(id),
    });
  }

  deleteStop(stopId: number) {
    this.stopService.deleteStop(stopId).subscribe({
      next: () => {
        this.fetchAllLines(),
          this.notification.success("Poprawnie usunięto wskazany przystanek")
      },
      error: () => this.notification.error("Wystąpił błąd podczas usuwania przystanku")
    });
  }
}
