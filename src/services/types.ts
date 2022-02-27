export enum CabinDirection {
  Down = -1,
  None = 0,
  Up = 1,
}

export interface IElevatorConfig {
  floorsCount: number
  startFloor: number
  cabinCapacity: number
  speed: number
}

export interface IPerson {
  direction: CabinDirection
  startFloor: number

  destinationFloor?: number
}

export interface IElevatorControllerDataStorage {
  personsAwaiting: IPerson[]
  personsInCabin: IPerson[]
}

export interface IElevatorMachineDataStorage {
  moveTimeout?: ReturnType<typeof setTimeout> | number
  currentFloor: number
  currentDirection: CabinDirection
  stop: boolean
}

export interface IElevatorMachineEventListeners {
  onBeforeFloor?: (...args: any[]) => any
  onDoorsClosed?: (...args: any[]) => any
  onDoorsOpened?: (...args: any[]) => any
  onFloorButtonPressed?: (...args: any[]) => any
  onServedAll?: (...args: any[]) => any
}

export interface IElevatorControllerFunctions {
  getPersonsAwaiting: () => IPerson[]
  getPersonsInCabin: () => IPerson[]
  addRandomPersonsToAwaitingList: (amount: number) => IPerson[]
  loadCabin: () => Promise<CabinDirection>
  processQueue: () => void
  pressFloorButton: (floorNumber: number, direction: CabinDirection) => void
}

export interface IElevatorControllerEventListeners {
  onServedAll?: (...args: any[]) => void
  onBeforeFloor?: (...args: any[]) => void
  onLoggableEvent?: (...args: any[]) => void
}