import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "./header/header.component";
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {API_URL} from "./shared/constants";

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
    this.http.post(`${API_URL}/csrf`, null, { withCredentials: true }).subscribe()
  }

}
