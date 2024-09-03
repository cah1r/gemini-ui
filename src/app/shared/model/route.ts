import BigNumber from 'bignumber.js';
import { CreateStop, Stop, StopDto } from './bus-stop';

export interface Route {
  id?: string;
  originStop: CreateStop;
  destinationStop: CreateStop;
  price: BigNumber;
  isActive: boolean;
  isTicketAvailable: boolean;
}

export interface RouteDto {
  id: string;
  isTicketAvailable: boolean;
  price: BigNumber;
  originStop: StopDto;
  destinationStop: StopDto;
  isActive: boolean;
}
