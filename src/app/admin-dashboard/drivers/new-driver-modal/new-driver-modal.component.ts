import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationService } from '../../../services/notification-factory.service';
import { DriverDto } from '../../../shared/model/driver.model';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-new-driver-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    NgIf,
    CommonModule,
    InputTextModule,
    InputNumberModule,
    InputMaskModule,
    CheckboxModule
  ],
  templateUrl: './new-driver-modal.component.html',
  styleUrl: './new-driver-modal.component.css'
})
export class NewDriverModalComponent {
  display = false;
  newDriverForm: FormGroup;

  @Output() driverCreated = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private driverService: DriverService, private notification: NotificationService) {
    this.newDriverForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]*$/)]],
      phoneNumber: ['', [Validators.required]],
      isActive: [true],
    });
  }

  show() {
    this.display = true;
  }

  onSubmit() {
    let driver: DriverDto = {
      firstName: this.newDriverForm.value.firstName,
      lastName: this.newDriverForm.value.lastName,
      phoneNumber: this.newDriverForm.value.phoneNumber,
      isActive: this.newDriverForm.value.isActive,
    }

    this.driverService.createDriver(driver).subscribe({
      next: () => {
        this.driverCreated.emit();
        this.onCancel();
      },
      error: () => this.notification.error('Nie udało się dodać kierowcy do bazy danych. Spróbuj ponownie.')
    })

  }

  onCancel() {
    this.newDriverForm.reset();
    this.newDriverForm.get('isActive')?.setValue(true)
    this.display = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.newDriverForm.get(fieldName);
    return field ? field.invalid && (field.touched || field.dirty) : false;
  }
}
