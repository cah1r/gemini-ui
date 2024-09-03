import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginNavComponent } from '../login/login-nav/login-nav.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, CommonModule, LoginNavComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Strona główna',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/index']),
      },
      {
        label: 'Admin',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/admin']),
      },
      { label: 'Rozkłd jazdy', icon: 'pi pi-calendar' },
      { label: 'Praca', icon: 'pi pi-briefcase' },
    ];
  }
}
