import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { LineComponent } from './line/line.component';
import { RouteComponent } from './route/route.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [LineComponent, NgIf, PanelMenuModule, RouteComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Trasy',
        icon: 'pi pi-share-alt',
        command: () => this.router.navigate(['/admin/routes']),
      },
      {
        label: 'Linie',
        icon: 'pi pi-arrows-h',
        command: () => this.router.navigate(['/admin/lines']),
      },
      { label: 'Pakiety', icon: 'pi pi-receipt' },
      { label: 'Rozkład jazdy', icon: 'pi pi-calendar' },
      {
        label: 'Kierowcy',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/admin/drivers']),
      },
      { label: 'Samochody', icon: 'pi pi-car' },
    ];
  }
}
