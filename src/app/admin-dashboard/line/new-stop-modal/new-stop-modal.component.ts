import { Component, OnInit } from '@angular/core';
import { Line } from '../../../shared/model/line';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CreateStop } from '../../../shared/model/bus-stop';
import { API_URL, MODAL_LIFE } from '../../../shared/constants';
import { MessageService } from 'primeng/api';

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
  display = false;
  newStopForm: FormGroup;
  private line: Line | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
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
        .post<CreateStop>(API_URL + '/admin/stop/create', stop)
        .subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: `Przystanek w miejscowości ${stop.town} został dodany do bazy danych`,
              life: MODAL_LIFE,
            });
            this.display = false;
            this.newStopForm.reset();
          },
          error: () => {
            console.log('Błąd zapisu przystanku ');
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: `Błąd zapisu przystanku w bazie. Spróbuj ponownie lub sprawdź logi`,
            });
          },
        });
    }
  }

  onCancel() {
    this.display = false;
  }
}
