import { CreateStop, Stop } from './bus-stop';

export interface Line {
  id?: number;
  description: string;
  stops?: Stop[];
}

export interface CreateLineDto {
  description: string;
}

export interface LineViewDto {
  id: number
  description: string
  stopsCount: number
}
