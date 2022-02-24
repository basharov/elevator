import { IPerson } from '../types/IPerson'

export enum CabinDirection {
  Down = -1,
  None = 0,
  Up = 1,
}

export interface IElevatorControllerConfig {
  floorsCount: number
  startFloor: number
}

export interface IDataStorage {
  personsAwaiting: IPerson[]
  personsInCabin: IPerson[]
}