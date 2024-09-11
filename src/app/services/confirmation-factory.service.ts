import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationFactoryService {

  constructor(private confirmationService: ConfirmationService) { }

  showDeleteDialog(message: string, onAccept: () => void) {
    this.confirmationService.confirm({
      header: 'Usuwanie',
      acceptLabel: 'Tak',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectLabel: 'Nie',
      rejectButtonStyleClass: 'p-button-text',
      icon: 'pi pi-exclamation-triangle',
      message: message,
      accept: onAccept
    });
  }
}
