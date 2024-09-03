import { Line } from './line';

export interface CreateStop {
  town: string;
  details?: string;
  line: Line;
  lineOrder?: number;
}

export interface Stop {
  id: number;
  town: string;
  details: string;
  lineOrder: number;
  departures: string;
}

export interface StopWithLineDto {
  id: number;
  town: string;
  details: string;
  lineOrder: number;
  lineId: number;
}

export interface StopDto {
  id: number;
  town: string;
  details: string;
  lineOrder: number;
}
