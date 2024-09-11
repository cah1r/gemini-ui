import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LineComponent as NewLineComponent } from './admin-dashboard/line/line.component';
import { TicketBundleComponent } from './customer/ticket-bundle/ticket-bundle.component';
import { LoginNavComponent } from './navigation/login/login-nav/login-nav.component';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { API_URL } from './shared/constants';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    InfiniteScrollDirective,
    RouterOutlet,
    NgIf,
    TicketBundleComponent,
    NewLineComponent,
    AdminDashboardComponent,
    LoginNavComponent,
    NavbarComponent,
  ],
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'gemini-ui';

  constructor(private http: HttpClient, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true
    this.http
      .post(`${API_URL}/auth/csrf`, null, { withCredentials: true })
      .subscribe();
  }
}
