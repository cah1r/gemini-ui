import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { PrimeNGConfig } from 'primeng/api';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LineComponent as NewLineComponent } from './admin-dashboard/line/line.component';
import { LoginNavComponent } from './navigation/login/login-nav/login-nav.component';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { API_URL } from './shared/constants';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    AdminDashboardComponent,
    InfiniteScrollDirective,
    LoginNavComponent,
    NavbarComponent,
    NewLineComponent,
    NgIf,
    RouterOutlet,
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
