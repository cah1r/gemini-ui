import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Car } from '../../../shared/model/car.model';
import { CarsService } from '../../services/cars.service';
import { NotificationService } from '../../../services/notification-factory.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-new-car-modal',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './new-car-modal.component.html',
})
export class NewCarModalComponent {
  display = false
  newCarForm: FormGroup
  @Output() carCreated = new EventEmitter<Car>()

  constructor(private fb: FormBuilder, private carsService: CarsService, private notification: NotificationService) {
    this.newCarForm = this.fb.group({
      registration: ['', [Validators.required, Validators.minLength(7)]],
      capacity: ['', [Validators.required, Validators.min(1)]],
      idNumber: '',
      name: ['', [Validators.maxLength(50)]]
    });
  }

  isFieldInvalid(field: string) {
    const control = this.newCarForm.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  show() {
    this.display = true
  }

  onSubmit() {
    if (this.newCarForm.valid) {
      const car: Car = {
        registration: this.newCarForm.value.registration,
        capacity: this.newCarForm.value.capacity,
        idNumber: this.newCarForm.value.idNumber,
        name: this.newCarForm.value.name
      }

      this.carsService.createCar(car).subscribe({
        next: (receivedId) => {
          car.id = receivedId
          this.carCreated.emit(car)
          this.onCancel()
          this.notification.success(`Poprawnie dodano nowy samochód`)
        },
        error: (e) => {
          if (e.status === 409) {
            this.notification.error('Numer rejestracyjny oraz numer identyfikacyjny muszą być unikalne.')
          } else {
            this.notification.error('Nie udało się dodać nowego pojazdu. Spróbuj ponownie lub skontaktuj się z pomocą techniczną.')
          }
        }
      })
    }
  }

  onCancel() {
    this.newCarForm.reset()
    this.display = false
  }
}
