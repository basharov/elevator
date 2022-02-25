import { initElevatorMachine } from './ElevatorMachine'
import { initElevatorControllerDataStorage } from './DataStorage'
import { CabinDirection, IElevatorConfig, IElevatorControllerEventListeners, IPerson } from './types'
import { orderBy, partition, random, sample } from 'lodash'

const initElevatorController = async (config: IElevatorConfig) => {
  const storage = initElevatorControllerDataStorage()
  const elevatorMachine = await initElevatorMachine(config)

  const eventListeners: IElevatorControllerEventListeners = {}

  const onServedAll = (cb: any) => {
    eventListeners.onServedAll = cb
  }

  const onBeforeFloor = (cb: any) => {
    eventListeners.onBeforeFloor = cb
  }

  const addPersonToAwaitingList = (person: IPerson) => {
    let destinationFloor = -1

    if ((person.startFloor === 0 && person.direction === CabinDirection.Down) || (person.startFloor === config.floorsCount && person.direction === CabinDirection.Up)) {
      console.log('Trying to add a person wishing to go to the floor higher than the building has or to a lower floor than the building has')
      return
    }

    if (person.direction === CabinDirection.Up) {
      destinationFloor = random(person.startFloor + 1, config.floorsCount - 1)
    } else if (person.direction === CabinDirection.Down) {
      destinationFloor = random(0, person.startFloor - 1)
    }
    storage.personsAwaiting.push({ ...person, destinationFloor })
  }

  const getNextDirection = (): CabinDirection => {
    if (storage.personsInCabin.length === 0 && storage.personsAwaiting.length === 0) {
      eventListeners.onServedAll && eventListeners.onServedAll()
      return CabinDirection.None
    }

    const cabinFloor = elevatorMachine.getCurrentFloor()
    const [floorsBelow, floorsAbove] = partition(storage.personsAwaiting, (person => person.startFloor < cabinFloor))

    const floorsBelowOrdered = orderBy(floorsBelow, ['startFloor'], ['desc'])
    const floorsAboveOrdered = orderBy(floorsAbove, ['startFloor'], ['asc'])

    const suggestedBelowFloor = floorsBelowOrdered[0]?.startFloor
    const suggestedAboveFloor = floorsAboveOrdered[0]?.startFloor

    const closestBelowFloor = Number.isInteger(suggestedBelowFloor) ? suggestedBelowFloor : -Infinity
    const closestAboveFloor = Number.isInteger(suggestedAboveFloor) ? suggestedAboveFloor : Infinity

    const distanceToAboveFloor = closestAboveFloor - cabinFloor
    const distanceToBelowFloor = cabinFloor - closestBelowFloor

    console.log({ closestBelowFloor, closestAboveFloor })

    if (distanceToBelowFloor === 0 || distanceToAboveFloor === 0) {
      console.log('Current floor should be served before calculating next direction.')
      if (storage.personsInCabin.length > 0) {
        return storage.personsInCabin[0].direction
      }
    }

    return distanceToAboveFloor <= distanceToBelowFloor ? CabinDirection.Up : CabinDirection.Down
  }

  const unloadCabin = () => {
    if (storage.personsInCabin.length === 0) {
      console.log('Cabin is empty, skipping unload step....')
      return
    }

    console.log('Unloading passengers...')
    const personsInCabinBeforeUnloading = storage.personsInCabin
    storage.personsInCabin = storage.personsInCabin.filter((person) => {
      return person.destinationFloor !== elevatorMachine.getCurrentFloor()
    })
    console.log(`Unloaded ${personsInCabinBeforeUnloading.length - storage.personsInCabin.length} passengers...`)
  }

  const loadCabin = async (): Promise<CabinDirection> => {
    console.log('Loading cabin with passengers...')
    let nextDirection: CabinDirection

    // If there is somebody in the cabin, keep going in the same direction
    // and load only passengers with the same direction
    if (storage.personsInCabin.length > 0) {
      nextDirection = storage.personsInCabin[0]?.direction
      storage.personsInCabin = [...storage.personsInCabin, ...getCabinFloorPersonsAwaiting().filter((person) => {
        return person.direction === storage.personsInCabin[0].direction
      })]
    } else {
      const personsToLoad = getCabinFloorPersonsAwaiting()
      const directions = partition(personsToLoad, (person => person.direction === CabinDirection.Up))
      storage.personsInCabin = directions[0].length >= directions[1].length ? directions[0] : directions[1]
      nextDirection = getNextDirection()
    }

    const cabinFloor = elevatorMachine.getCurrentFloor()

    storage.personsAwaiting = storage.personsAwaiting.filter(person => !(person.startFloor === cabinFloor && person.direction === nextDirection))

    console.log(`${storage.personsInCabin.length} passengers are in the cabin!`)
    console.log(`${storage.personsAwaiting.length} persons left to serve...`)

    return nextDirection
  }

  const getCabinFloorPersonsAwaiting = () => {
    return storage.personsAwaiting.filter(person => person.startFloor === elevatorMachine.getCurrentFloor())
  }

  const processQueue = async () => {
    await unloadCabin()
    const nextDirection = await loadCabin()

    if (nextDirection === CabinDirection.Up) {
      elevatorMachine.moveUp()
    } else if (nextDirection === CabinDirection.Down) {
      elevatorMachine.moveDown()
    }
  }

  const personsAwaitingOnTheFloor = (floorNumber: number): IPerson[] => {
    return storage.personsAwaiting.filter((person) => person.startFloor === floorNumber)
  }

  elevatorMachine.onDoorsOpened && elevatorMachine.onDoorsOpened(() => {
    processQueue()
  })

  elevatorMachine.onBeforeFloor && elevatorMachine.onBeforeFloor((floorNumber: number) => {
    console.log(`Floor: ${elevatorMachine.getCurrentFloor()} - ${floorNumber}`)

    const personsArriving = storage.personsInCabin.filter((person) => person.destinationFloor === floorNumber)

    if (personsArriving.length > 0) {
      console.log(`${personsArriving.length} persons arriving at the current floor...`)
      elevatorMachine.stopAndOpenDoors()
    } else if (personsAwaitingOnTheFloor(floorNumber).length > 0) {
      console.log(`Somebody is waiting on the floor ${floorNumber}, let's get them!`)
      elevatorMachine.stopAndOpenDoors()
    }

    if (floorNumber >= config.floorsCount - 1 || floorNumber < 0) {
      console.log('Will stop the cabin because the top/ground floor is reached')
      elevatorMachine.stopAndOpenDoors()
    }
    eventListeners.onBeforeFloor && eventListeners.onBeforeFloor(floorNumber)
  })

  elevatorMachine.onFloorButtonPressed && elevatorMachine.onFloorButtonPressed((currentFloor: number, direction: CabinDirection) => {
    console.log('Event: floorButtonPressed')
    addPersonToAwaitingList({ startFloor: currentFloor, direction })
    if (storage.autostart) {
      processQueue()
    }
  })

  const addRandomPersonsToAwaitingList = (count = 1000) => {
    while (storage.personsAwaiting.length < count) {
      const direction = sample<CabinDirection>([CabinDirection.Up, CabinDirection.Down]) as CabinDirection

      const startFloor = random(direction === CabinDirection.Down ? 1 : 0, direction === CabinDirection.Up ? config.floorsCount - 2 : config.floorsCount - 1)

      const person: IPerson = {
        startFloor,
        direction,
      }

      addPersonToAwaitingList(person)
    }
    console.log(`Generated ${count} persons awaiting.`)

    if (storage.autostart) {
      processQueue()
    }

    return storage.personsAwaiting
  }

  const setAutoStart = async (value: boolean) => {
    storage.autostart = value
    processQueue()
  }

  const pressCabinButton = (floorNumber: number) => {
    console.log(`pressCabinButton ${floorNumber}`)
  }

  const getPersonsAwaiting = (): IPerson[] => storage.personsAwaiting
  const getPersonsInCabin = (): IPerson[] => storage.personsInCabin

  return {
    pressFloorButton: elevatorMachine.pressFloorButton,
    moveUp: elevatorMachine.moveUp,
    moveDown: elevatorMachine.moveDown,

    onServedAll,
    onBeforeFloor,

    setAutoStart,
    pressCabinButton,
    loadCabin,
    unloadCabin,
    addRandomPersonsToAwaitingList,
    processQueue,
    getNextDirection,
    getPersonsAwaiting,
    getPersonsInCabin,
  }
}

export { initElevatorController }
