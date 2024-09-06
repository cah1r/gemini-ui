import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { NotificationService } from '../../services/notification-factory.service';
import { Driver } from '../../shared/model/driver.model';
import { DriverService } from '../services/driver.service';
import { NewDriverModalComponent } from "./new-driver-modal/new-driver-modal.component";
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    InputIconModule,
    InputTextModule,
    IconFieldModule,
    TagModule,
    NewDriverModalComponent,
    NgIf,
  ],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.css'
})
export class DriversComponent implements OnInit {

  private _allDrivers: Driver[] = [];
  loading: boolean = true;
  constructor(
    private driverService: DriverService,
    private notification: NotificationService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers() {
    this.driverService.getAllDrivers().subscribe({
      next: response => {
        this._allDrivers = response.sort((a, b) => a.lastName.localeCompare(b.lastName));
      },
      error: () => this.notification.error('Nie udało się pobrać listy kierowców z bazy danych')
    });
  }

  get allDrivers(): Driver[] {
    return this._allDrivers;
  }

  setActiveStatus(id: string, isActive: boolean) {
    this.driverService.setActiveStatus(id, isActive).subscribe({
      next: () => {
        const driver = this._allDrivers.find(driver => driver.id === id);
        if (driver) {
          driver.isActive = isActive;
        }
      },
      error: () => this.notification.error('Nie udało się zmienić statusu aktywności kierowcy')
    });
  }

  onDeleteDriver(id: string) {
    this.confirmationService.confirm({
      header: 'Usuwanie',
      acceptLabel: 'Tak',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectLabel: 'Nie',
      rejectButtonStyleClass: 'p-button-text',
      icon: 'pi pi-exclamation-triangle',
      message: 'Czy na pewno chcesz usunąć kierowcę?',
      accept: () => {
        this.driverService.deleteDriver(id).subscribe({
          next: () => this.fetchDrivers(),
          error: () => this.notification.error('Nie udało się usunąć kierowcy z bazy danych')
        });
      }
    });
  }

  mapBooleanToStatus(isActive: boolean) {
    return isActive ? 'Aktywny' : 'Nieaktywny';
  }

  getSeverity(isActive: boolean) {
    return isActive ? 'success' : 'danger';
  }

  onDriverCreated() {
    this.fetchDrivers();
  }
}
