import { Component } from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";

@Component({
  selector: 'app-phone-modal',
  standalone: true,
  imports: [
    ButtonDirective,
    DialogModule,
    FormsModule,
    InputTextModule,
    NgIf,
    PrimeTemplate,
    ReactiveFormsModule
  ],
  templateUrl: './phone-modal.component.html',
  styleUrl: './phone-modal.component.css'
})
export class PhoneModalComponent {

}
