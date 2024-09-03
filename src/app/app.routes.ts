import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DriversComponent } from './admin-dashboard/drivers/drivers.component';
import { LineComponent } from './admin-dashboard/line/line.component';
import { RouteComponent } from './admin-dashboard/route/route.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AdminGuard } from './services/admin.guard';

export const routes: Routes = [
  {
    path: 'index',
    component: MainPageComponent,
    data: { animation: 'MainPage' },
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'routes', pathMatch: 'full' },
      { path: 'routes', component: RouteComponent },
      { path: 'lines', component: LineComponent },
      { path: 'drivers', component: DriversComponent },
    ],
    data: { animation: 'AdminDash' },
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
