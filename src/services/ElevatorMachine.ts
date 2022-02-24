import { sleep } from '../utils/sleep'
import { CabinDirection, IElevatorControllerConfig } from './types'

const initElevatorMachine = async (config: IElevatorControllerConfig) => {
  const dataLayer: any = {
    currentFloor: config.startFloor,
    currentDirection: CabinDirection.None,
    stop: false,
  }

  const eventListeners: any = {}

  console.log('Elevator Machine is initializing...')
  await sleep(200)
  console.log('Elevator Machine is ready!')

  const on = (eventType: string, cb: (...args: any) => void) => {
    eventListeners[eventType] = cb
  }

  const setFloor = (floorNumber: number) => {
    dataLayer.currentFloor = floorNumber
  }

  const move = async (direction: CabinDirection) => {
    if (!dataLayer.stop) {
      eventListeners['beforeFloor'](dataLayer.currentFloor + 1 * direction)
      dataLayer.currentFloor += 1 * direction
      console.log(`Floor: ${getCurrentFloor()}`)
      dataLayer.moveTimeout = setTimeout(() => {
        move(direction)
      }, 30)
    } else {
      clearTimeout(dataLayer.moveTimeout)
      dataLayer.stop = false
    }
  }

  const startMovingInDirection = async (direction: CabinDirection) => {
    // console.log(`Action: ${direction === CabinDirection.Up ? 'moveUp' : 'moveDown'}`)
    await sleep(100)
    console.log('Closing doors...')
    eventListeners['doorsClosed']()
    console.log('Starting moving...')
    dataLayer.currentDirection = direction
    return move(direction)
  }

  const moveUp = async () => startMovingInDirection(CabinDirection.Up)
  const moveDown = async () => startMovingInDirection(CabinDirection.Down)

  const getCurrentFloor = (): number => {
    return dataLayer.currentFloor
  }

  const resetCurrentFloor = () => {
    dataLayer.currentFloor = config.startFloor
  }

  const getCurrentDirection = (): CabinDirection => {
    console.log('Action: getCurrentDirection')
    return dataLayer.currentDirection
  }

  const stopAndOpenDoors = async () => {
    console.log('Stopping...')
    dataLayer.stop = true
    await sleep(100)
    console.log('Stopped')
    console.log('Opening doors...')
    await sleep(100)
    console.log('Doors opened')
    dataLayer.currentDirection = CabinDirection.None
    eventListeners['doorsOpened']()
  }

  const pressFloorButton = (floorNumber: number, direction: 'up' | 'down') => {
    console.log(`Action: pressFloorButton ${floorNumber} going ${direction}`)
    eventListeners['floorButtonPressed'](floorNumber, direction)
  }

  const start = () => {
    console.log(`Action: start`)
  }

  return {
    on,
    moveUp,
    moveDown,
    stopAndOpenDoors,
    getCurrentFloor,
    resetCurrentFloor,
    getCurrentDirection,
    pressFloorButton,
    start,
    setFloor,
  }
}


export { initElevatorMachine }