import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationFactoryService } from '../../services/confirmation-factory.service';
import { NotificationService } from '../../services/notification-factory.service';
import { Car } from '../../shared/model/car.model';
import { CarsService } from '../services/cars.service';
import { NewCarModalComponent } from './new-car-modal/new-car-modal.component';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    NewCarModalComponent,
    TableModule,
    ToastModule,
  ],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css',
})
export class CarsComponent implements OnInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  allCars: Car[] = []

  constructor(
    private carsService: CarsService,
    private notification: NotificationService,
    private confirmation: ConfirmationFactoryService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.carsService.fetchAllCars().subscribe({
      next: fetchedData => this.allCars = fetchedData
    })
  }

  onCarCreated(car: Car) {
    this.allCars.push(car)
  }

  onDeleteCar(id: number) {
    this.confirmation.showDeleteDialog(
      'Czy na pewno chcesz usunąć wskazany pojazd?',
      () => this.deleteCar(id)
    )
  }

  private deleteCar(id: number) {
    this.carsService.deleteCar(id).subscribe({
      next: () => {
        this.allCars = this.allCars.filter(car => car.id !== id)
        this.notification.success('Poprawnie usunięto pojazd')
      },
      error: (e) => {
        if (e.status === 404) {
          this.notification.error('Nie udało się znaleźć wskazanego pojazdu w bazie danych')
        } else {
          this.notification.error('Nie udało się usunąć wskazanego pojazdu. Spróbuj ponownie lub skontaktuj się z pomocą techniczną')
        }
      }
    })
  }


}
