import {Component, OnInit} from '@angular/core';
import {BusStop} from "../../customer/ticket-bundle/model/bus-stop";
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../../shared/constants";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {DropdownModule} from "primeng/dropdown";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {PanelModule} from "primeng/panel";
import {InputNumberModule} from "primeng/inputnumber";
import {Button} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {RouteDto} from "../../customer/ticket-bundle/model/route-dto";
import {Route} from "../../customer/ticket-bundle/model/route";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {CurrencyPipe, DecimalPipe, NgIf} from "@angular/common";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {ChipsModule} from "primeng/chips";
import {availableLines, Line} from "../../customer/ticket-bundle/model/Line";

@Component({
  selector: 'app-route-manager',
  standalone: true,
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    DropdownModule,
    FormsModule,
    PanelModule,
    InputNumberModule,
    ReactiveFormsModule,
    Button,
    CheckboxModule,
    TableModule,
    TagModule,
    NgIf,
    CurrencyPipe,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    ChipsModule,
    DecimalPipe
  ],
  templateUrl: './route-manager.component.html',
  styleUrl: './route-manager.component.css'
})
export class RouteManagerComponent implements OnInit {

  private _allBusStops: BusStop[] = []
  private _matchingBusStops: BusStop[] = []
  private _allRoutes: Route[] = []
  private _availableLines = availableLines

  newRouteForm: FormGroup

  constructor(private http: HttpClient, private fb: FormBuilder, private confirmationService: ConfirmationService) {
    this.newRouteForm = this.fb.group({
      selectedLine: [null, Validators.required],
      initialStop: [{value: null, disabled: true}, Validators.required],
      lastStop: [{value: null, disabled: true}, Validators.required],
      durationH: null,
      durationM: null,
      ticketPrice: null,
      isActive: [true]
    }, {validators: this.oneOfTwo()})

    this.newRouteForm.get('selectedLine')?.valueChanges.subscribe((selectedValue: Line) => {
      if (selectedValue) {
        this.newRouteForm.get('initialStop')?.enable()
        this.newRouteForm.get('lastStop')?.enable()
        this._matchingBusStops = this._allBusStops.filter(stop => stop.lines.includes(selectedValue))
      } else {
        this.newRouteForm.get('initialValue')?.disable()
        this.newRouteForm.get('lastStop')?.disable()
      }
    })
  }

  oneOfTwo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const durationH = control.get('durationH')?.value
      const durationM = control.get('durationM')?.value

      return durationH || durationM ? null : { oneOfTwo: true}
    }
  }

  ngOnInit() {
    this.fetchAllBusStops()
    this.refreshRoutes()
  }


  fetchAllBusStops() {
    this.http.get<BusStop[]>(API_URL + "/bus-stop/get-all").subscribe({
      next: data => {
        this._allBusStops = data.sort((a, b) => a.city.localeCompare(b.city))
      },
      error: e => console.log("Error obtained while fetching bus stops", e)
    })
  }

  get matchingBusStops(): BusStop[] {
    return this._matchingBusStops;
  }

  get allRoutes(): Route[] {
    return this._allRoutes;
  }

  get availableLines(): Line[] {
    return this._availableLines;
  }

  createNewRoute() {
    const initialStop = this.newRouteForm.get('initialStop')?.value
    const lastStop = this.newRouteForm.get('lastStop')?.value

    const routeDto = {
      initialStopId: initialStop ? initialStop.id : null,
      lastStopId: lastStop ? lastStop.id : null,
      durationInMinutes: this.newRouteForm.get('durationM')?.value + this.newRouteForm.get('durationH')?.value * 60,
      ticketPriceInPennies: this.newRouteForm.get('ticketPrice')?.value * 100,
      isActive: this.newRouteForm.get('isActive')?.value
    }
    this.http.post<RouteDto>(API_URL + "/manage/route/create", routeDto).subscribe({
      next: () => {
        this.newRouteForm.reset()
        this.refreshRoutes()
      },
      error: err => console.log("Couldn't create route", err)
    })
  }

  refreshRoutes() {
    this.http.get<Route[]>(API_URL + "/manage/route/get-all").subscribe({
      next: data => this._allRoutes = data.sort((a, b) => {
        const initialComparison = a.initialStop.city.localeCompare(b.initialStop.city)
        return initialComparison === 0 ? a.lastStop.city.localeCompare(b.lastStop.city) : initialComparison
      }),
      error: err => console.log("Couldn't fetch routes from backend service", err)
    })
    console.log(`Fetched routes: ${this._allRoutes}`)
  }

  formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    let timeString = ''

    if (hours > 0) timeString += `${hours}h`
    if (minutes > 0 || hours === 0) timeString += ` ${minutes}m`

    return timeString.trim();
  }

  onDeleteRoute(id: string) {
    this.confirmationService.confirm({
      message: 'Czy jesteś pewny, że chcesz usunąć wskazaną trasę?',
      header: 'Usuwanie',
      acceptLabel: 'Tak',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectLabel: 'Nie',
      rejectButtonStyleClass: 'p-button-text',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRoute(id)
      }
    })
  }

  private deleteRoute(id: string) {
    this.http.delete(API_URL + "/manage/route/delete/" + id).subscribe({
      next: () => this.refreshRoutes(),
      error: err => console.log("Couldn't delete route", err)
    })
  }

  getSeverity(isActive: boolean) {
    return isActive ? 'success' : 'secondary'
  }

  mapBooleanToStatus(isActive: boolean) {
    return isActive ? 'Aktywna' : 'Nieaktywna'
  }

  setActiveStatus(id: string, status: boolean) {
    this.http.patch<any>(API_URL + "/manage/route/setStatus/" + id, {isActive: status}).subscribe({
      next: () => this.refreshRoutes()
    })
  }

  formatCityInfo(city: string, details: string) {
    const formatedDetails = details === null ? "" : " | " + details
    return city + formatedDetails;
  }
}
