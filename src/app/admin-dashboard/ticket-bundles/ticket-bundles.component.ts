import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ConfirmationFactoryService } from '../../services/confirmation-factory.service';
import { NotificationService } from '../../services/notification-factory.service';
import { TicketBundle } from '../../shared/model/ticket-bundle.model';
import { TicketBundlesService } from '../services/ticket-bundles.service';
import { NewTicketBundleModalComponent } from './new-ticket-bundle-modal/new-ticket-bundle-modal.component';

@Component({
  selector: 'app-ticket-packages',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    DecimalPipe,
    InputIconModule,
    InputTextModule,
    IconFieldModule,
    TagModule,
    NgClass,
    NgFor,
    NgIf,
    NewTicketBundleModalComponent,
  ],
  templateUrl: './ticket-bundles.component.html',
  styleUrl: './ticket-bundles.component.css',
})
export class TicketBundlesComponent implements OnInit {
  allTicketBundles: TicketBundle[] = [];
  loading: boolean = true;

  constructor(
    private bundleService: TicketBundlesService,
    private notification: NotificationService,
    private confirmation: ConfirmationFactoryService
  ) {}

  ngOnInit(): void {
    this.fetchTicketsBundles();
    console.log('fetched bundles: ', JSON.stringify(this.allTicketBundles));
  }

  fetchTicketsBundles() {
    this.bundleService.getAllTicketBundles().subscribe({
      next: (response: TicketBundle[]) => (this.allTicketBundles = response),
      error: () =>
        this.notification.error(
          'Nie udało się pobrać listy pakietów biletów z bazy danych'
        ),
    });
  }

  setActiveStatus(id: string, isActive: boolean) {
    this.bundleService.setActiveStatus(id, isActive).subscribe({
      next: () => {
        const bundle = this.allTicketBundles.find((pkg) => pkg.id === id);
        if (bundle) {
          bundle.isActive = isActive;
        }
      },
      error: () =>
        this.notification.error(
          'Nie udało się zmienić statusu aktywności pakietu biletów'
        ),
    });
  }

  onDeleteBundle(id: string) {
    this.confirmation.showDeleteDialog(
      'Czy na pewno chcesz usunąć pakiet biletów?',
      () => this.deleteBundle(id)
    );
  }

  private deleteBundle(id: string) {
    this.bundleService.deleteTicketBundle(id).subscribe({
      next: () =>
        (this.allTicketBundles = this.allTicketBundles.filter(
          (tb) => tb.id !== id
        )),
      error: () =>
        this.notification.error(
          'Nie udało się usunąć pakietu biletów z bazy danych'
        ),
    });
  }

  mapBooleanToStatus(isActive: boolean) {
    return isActive ? 'Aktywny' : 'Nieaktywny';
  }

  getSeverity(isActive: boolean) {
    return isActive ? 'success' : 'danger';
  }

  onBundleCreated(bundle: any) {
    console.log('received event: ' + JSON.stringify(bundle));
    this.allTicketBundles = [...this.allTicketBundles, bundle];
  }
}
