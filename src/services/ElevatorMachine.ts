import { CabinDirection, IElevatorConfig, IElevatorMachineEventListeners } from './types'
import { initElevatorMachineDataStorage } from '@/services/DataStorage'
import { sleep } from '@/utils/sleep'

const initElevatorMachine = async (config: IElevatorConfig) => {
  window.config = config
  const machineStorage = initElevatorMachineDataStorage(config)
  const eventListeners: IElevatorMachineEventListeners = {}

  const onBeforeFloor = (cb: any) => {
    eventListeners.onBeforeFloor = cb
  }

  const onDoorsOpened = (cb: any) => {
    eventListeners.onDoorsOpened = cb
  }

  const onFloorButtonPressed = (cb: any) => {
    eventListeners.onFloorButtonPressed = cb
  }

  const onServedAll = (cb: any) => {
    eventListeners.onServedAll = cb
  }

  const move = async (direction: CabinDirection) => {
    if (!machineStorage.stop) {
      eventListeners.onBeforeFloor && eventListeners.onBeforeFloor(machineStorage.currentFloor + 1 * direction)
      machineStorage.currentFloor += 1 * direction
      console.log(`Floor: ${getCurrentFloor()}`)
      machineStorage.moveTimeout = setTimeout(() => {
        move(direction)
      }, 30)
    } else {
      clearTimeout(machineStorage.moveTimeout as number)
      machineStorage.stop = false
    }
  }

  const startMovingInDirection = async (direction: CabinDirection) => {
    await sleep(1000/config.speed)
    console.log('Closing doors...')
    eventListeners.onDoorsClosed && eventListeners.onDoorsClosed()
    console.log('Start moving...')
    machineStorage.currentDirection = direction

    if (machineStorage.currentDirection === CabinDirection.Up && getCurrentFloor() >= config.floorsCount - 1) {
      return move(CabinDirection.Down)
    }

    if (machineStorage.currentDirection === CabinDirection.Down && getCurrentFloor() <= 0) {
      return move(CabinDirection.Up)
    }

    return move(direction)
  }

  const moveUp = async () => startMovingInDirection(CabinDirection.Up)
  const moveDown = async () => startMovingInDirection(CabinDirection.Down)

  const getCurrentFloor = (): number => {
    return machineStorage.currentFloor
  }

  const getCurrentDirection = (): CabinDirection => {
    console.log('Action: getCurrentDirection')
    return machineStorage.currentDirection
  }

  const stopAndOpenDoors = async () => {
    console.log('Stopping...')
    machineStorage.stop = true
    await sleep(1000/config.speed)
    console.log('Stopped')
    console.log('Opening doors...')
    await sleep(1000/config.speed)
    console.log('Doors opened')
    machineStorage.currentDirection = CabinDirection.None
    eventListeners.onDoorsOpened && eventListeners.onDoorsOpened()
  }

  const pressFloorButton = (floorNumber: number, direction: CabinDirection) => {
    console.log(`Action: pressFloorButton ${floorNumber} going ${direction}`)
    eventListeners.onFloorButtonPressed && eventListeners.onFloorButtonPressed(floorNumber, direction)
  }

  return {
    onBeforeFloor,
    onDoorsOpened,
    onFloorButtonPressed,
    onServedAll,
    moveUp,
    moveDown,
    stopAndOpenDoors,
    getCurrentFloor,
    getCurrentDirection,
    pressFloorButton,
  }
}


export { initElevatorMachine }
