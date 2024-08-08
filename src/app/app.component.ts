import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "./header/header.component";
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, HeaderComponent, NgIf],
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  title = 'gemini-ui';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.post(`http://localhost:8080/api/v1/csrf`, null, { withCredentials: true }).subscribe()
  }

}
