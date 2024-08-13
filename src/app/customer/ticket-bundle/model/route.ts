import {BusStop} from "./bus-stop";

export interface Route {
  id?: string
  initialStop: BusStop
  lastStop: BusStop
  durationInMinutes: number
  ticketPriceInPennies: number
  isActive: boolean
}
