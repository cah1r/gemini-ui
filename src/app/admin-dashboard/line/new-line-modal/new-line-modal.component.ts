import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { API_URL, MODAL_LIFE } from '../../../shared/constants';
import { CreateLineDto } from '../../../shared/model/line';

@Component({
  selector: 'app-new-line-modal',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    FormsModule,
    InputTextModule,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './new-line-modal.component.html',
  styleUrl: './new-line-modal.component.css',
})
export class NewLineModalComponent {
  display = false;
  newLineForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.newLineForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  show() {
    this.display = true;
  }

  onSubmit() {
    const line: CreateLineDto = {
      description: this.newLineForm.get('description')?.value,
    };
    this.http.post(API_URL + '/admin/lines', line).subscribe({
      next: () => {
        this.lineCreatedNotification(line.description);
        this.newLineForm.reset();
        this.display = false;
      },
    });
    this.newLineForm.reset();
  }

  onCancel() {
    this.display = false;
    this.newLineForm.reset();
  }

  lineCreatedNotification(line: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: `Utowrzono nowa trasę ${line}`,
      life: MODAL_LIFE,
    });
  }
}
