import {Line} from "./Line";

export interface BusStop {
  id?: string
  city: string
  details?: string
  isTicketAvailable: boolean
  lines: Line[]
}
