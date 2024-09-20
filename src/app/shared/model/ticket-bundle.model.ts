import BigNumber from 'bignumber.js';
import { RouteViewDto } from './route';

export interface CreateTicketBundleRequest {
  stopAId: number;
  stopBId: number;
  routesIds: string[];
  ticketsQuantity: number;
  price: BigNumber;
  isActive: boolean;
}

export interface TicketBundle {
  id: string;
  routesPreview: RouteViewDto[];
  ticketsQuantity: number;
  price: BigNumber;
  isActive: boolean;
  displayName: string;
}
