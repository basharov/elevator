import { CabinDirection, IElevatorControllerDataStorage, IElevatorConfig, IElevatorMachineDataStorage } from './types'

export const initElevatorControllerDataStorage = (): IElevatorControllerDataStorage => (
  {
    personsAwaiting: [],
    personsInCabin: [],
    autostart: false,
  }
)
  export const initElevatorMachineDataStorage = (config: IElevatorConfig): IElevatorMachineDataStorage => ({
  currentFloor: config.startFloor,
  currentDirection: CabinDirection.None,
  stop: false,
})
