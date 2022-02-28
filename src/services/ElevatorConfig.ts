import { IElevatorConfig } from '@/services/types'

export const ElevatorConfig: IElevatorConfig = {
  floorsCount: 16,
  startFloor: 8,
  cabinCapacity: 15,
  speed: 20,
}


export const DirectionsLabels = {
  '-1': 'down',
  '0': 'none',
  '1': 'up',
}