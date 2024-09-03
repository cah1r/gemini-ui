import { Route } from './route';
import BigNumber from 'bignumber.js';

export interface TicketBundle {
  route: Route;
  quantity: number;
  price: BigNumber;
  isActive: boolean;
}
