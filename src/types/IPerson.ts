export interface IPerson {
  timestamp: number
  direction: 'up' | 'down'
  currentFloor: number

  destinationFloor?: number
}