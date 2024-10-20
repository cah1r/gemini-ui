import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { LineComponent } from './line/line.component';
import { RouteComponent } from './route/route.component';
import { routeAnimations } from '../shared/app.animations';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [LineComponent, NgIf, PanelMenuModule, RouteComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  animations: [routeAnimations],
})
export class AdminDashboardComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Linie',
        icon: 'pi pi-arrows-h',
        command: () => this.router.navigate(['/admin/lines']),
      },
      {
        label: 'Cennik',
        icon: 'pi pi-dollar',
        command: () => this.router.navigate(['/admin/routes']),
      },
      {
        label: 'Pakiety',
        icon: 'pi pi-box',
        command: () => this.router.navigate(['/admin/bundles']),
      },
      { label: 'Rozkład jazdy', icon: 'pi pi-calendar' },
      {
        label: 'Kierowcy',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/admin/drivers']),
      },
      {
        label: 'Pojazdy',
        icon: 'pi pi-car',
        command: () => this.router.navigate(['/admin/cars']),
      },
    ];
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
