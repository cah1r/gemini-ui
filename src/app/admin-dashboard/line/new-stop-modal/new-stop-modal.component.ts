import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationService } from '../../../services/notification-factory.service';
import { API_URL } from '../../../shared/constants';
import { CreateStop } from '../../../shared/model/bus-stop';
import { Line } from '../../../shared/model/line';

@Component({
  selector: 'app-new-stop-modal',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-stop-modal.component.html',
  styleUrl: './new-stop-modal.component.css',
})
export class NewStopModalComponent {

  @Output() stopCreated = new EventEmitter<void>();

  display = false;
  newStopForm: FormGroup;
  private line: Line | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notification: NotificationService
  ) {
    this.newStopForm = this.fb.group({
      town: ['', Validators.required],
      description: [undefined],
    });
  }

  openModal(line: Line) {
    this.display = true;
    this.line = line;
  }

  onSubmit() {
    if (this.line && this.line.stops?.length) {
      const stop: CreateStop = {
        town: this.newStopForm.get('town')?.value,
        details: this.newStopForm.get('description')?.value,
        line: this.line,
        lineOrder: this.line.stops?.length + 1,
      };

      this.http
        .post<CreateStop>(API_URL + '/admin/stops', stop)
        .subscribe({
          next: (data) => {
            this.notification.success(`Przystanek w miejscowości ${stop.town} został dodany do bazy danych`)
            this.display = false;
            this.newStopForm.reset();
            this.stopCreated.emit();
          },
          error: (e) => {
            this.notification.error('Błąd zapisu przystanku')
          },
        });
    }
  }

  onCancel() {
    this.display = false;
  }
}
