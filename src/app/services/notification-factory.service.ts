import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MODAL_LIFE } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }

  success(details: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: details,
      life: MODAL_LIFE,
      key: 'br'
    });
  }

  error(details: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Błąd',
      detail: details,
      life: MODAL_LIFE,
      key: 'br'
    });
  }
}
