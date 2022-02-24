import { initElevatorMachine } from './ElevatorMachine'
import { initDataStorage } from './DataStorage'
import { IElevatorControllerConfig } from './types'
import { IPerson } from '../types/IPerson'
import { orderBy, partition, random, sample } from 'lodash'

const initElevatorController = async (config: IElevatorControllerConfig) => {
  let storage = initDataStorage()
  const elevatorMachine = await initElevatorMachine(config)

  const eventListeners: any = {}


  const on = (eventType: string, cb: (...args: any) => void) => {
    eventListeners[eventType] = cb
  }

  const addPersonToAwaitingList = (person: IPerson) => {
    let destinationFloor = -1

    if ((person.startFloor === 0 && person.direction === 'down') || (person.startFloor === config.floorsCount && person.direction === 'up')) {
      console.log('Trying to add a person wishing to go to the floor higher than the building has or to a lower floor than the building has')
      return
    }

    if (person.direction === 'up') {
      destinationFloor = random(person.startFloor + 1, config.floorsCount - 1)
    } else if (person.direction === 'down') {
      destinationFloor = random(0, person.startFloor - 1)
    }
    storage.personsAwaiting.push({ ...person, destinationFloor })
  }

  const addPersonToCabin = () => {
    let destinationFloor = -1


    const direction = sample<any>(['up', 'down'])

    const startFloor = random(direction === 'down' ? 1 : 0, direction === 'up' ? config.floorsCount - 2 : config.floorsCount - 1)

    const person: IPerson = {
      startFloor,
      direction,
    }

    if (person.direction === 'up') {
      destinationFloor = random(person.startFloor < config.floorsCount - 1 ? person.startFloor + 1 : config.floorsCount - 2, config.floorsCount - 1)
    } else if (person.direction === 'down') {
      destinationFloor = random(0, person.startFloor - 1)
    }
    storage.personsInCabin.push({ ...person, destinationFloor })
  }

  const getNextDirection = () => {
    if (storage.personsInCabin.length === 0 && storage.personsAwaiting.length === 0) {
      console.log('No people to serve. Should stop and wait.')
      return
    }

    const cabinFloor = elevatorMachine.getCurrentFloor()
    const [floorsBelow, floorsAbove] = partition(storage.personsAwaiting, (person => person.startFloor < cabinFloor))

    const floorsBelowOrdered = orderBy(floorsBelow, ['startFloor'], ['desc'])
    const floorsAboveOrdered = orderBy(floorsAbove, ['startFloor'], ['asc'])

    const closestBelowFloor = floorsBelowOrdered[0]?.startFloor || -Infinity
    const closestAboveFloor = floorsAboveOrdered[0]?.startFloor || Infinity

    const distanceToAboveFloor = closestAboveFloor - cabinFloor
    const distanceToBelowFloor = cabinFloor - closestBelowFloor

    if (distanceToBelowFloor === 0 || distanceToAboveFloor === 0) {
      console.log('Current floor should be served before calculating next direction.')
      if (storage.personsInCabin.length > 0) {
        return storage.personsInCabin[0].direction
      }
    }

    return distanceToAboveFloor <= distanceToBelowFloor ? 'up' : 'down'
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

  const loadCabin = async (): Promise<any> => {
    console.log('Loading cabin with passengers...')
    let nextDirection: 'up' | 'down' | undefined

    // If there is somebody in the cabin, keep going in the same direction
    // and load only passengers with the same direction
    if (storage.personsInCabin.length > 0) {
      nextDirection = storage.personsInCabin[0]?.direction
      storage.personsInCabin = [...storage.personsInCabin, ...getCabinFloorPersonsAwaiting().filter((person) => {
        return person.direction === storage.personsInCabin[0].direction
      })]
    } else {
      const personsToLoad = getCabinFloorPersonsAwaiting()
      const directions = partition(personsToLoad, (person => person.direction === 'up'))
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

    if (nextDirection === 'up') {
      elevatorMachine.moveUp()
    } else if (nextDirection === 'down') {
      elevatorMachine.moveDown()
    }
  }

  const personsAwaitingOnTheFloor = (floorNumber: number): IPerson[] => {
    return storage.personsAwaiting.filter((person) => person.startFloor === floorNumber)
  }

  elevatorMachine.on('doorsClosed', () => {
  })

  elevatorMachine.on('doorsOpened', () => {
    processQueue()
  })

  elevatorMachine.on('beforeFloor', (floorNumber: number) => {
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
    console.log(eventListeners)
    eventListeners['beforeFloor'](floorNumber)
  })

  elevatorMachine.on('floorButtonPressed', (currentFloor: number, direction: 'up' | 'down') => {
    console.log('Event: floorButtonPressed')
    addPersonToAwaitingList({ startFloor: currentFloor, direction })
  })

  const addRandomPersonsToAwaitingList = (count = 1000) => {
    // reset()
    while (storage.personsAwaiting.length < count) {
      addPersonToAwaitingList({
        startFloor: random(0, config.floorsCount - 1),
        direction: sample<any>(['up', 'down']),
      })
    }
    console.log(`Generated ${count} persons awaiting.`)

    return storage.personsAwaiting
  }

  const addRandomPersonsToCabin = (count = 3) => {
    reset()
    while (storage.personsInCabin.length < count) {
      addPersonToCabin()
    }
  }

  const reset = async () => {
    storage = initDataStorage()
    elevatorMachine.resetCurrentFloor()
  }

  const pressCabinButton = (floorNumber: number, direction: 'up' | 'down') => {
    console.log(`pressCabinButton ${floorNumber}`)
  }

  const getStatus = () => {
    return `
Direction:              ${elevatorMachine.getCurrentDirection()}
Current Floor:          ${elevatorMachine.getCurrentFloor()}
Awaiting persons:       ${JSON.stringify(storage.personsAwaiting, null, '  ')}
Awaiting persons count: ${storage.personsAwaiting.length}

Persons in cabin:       ${JSON.stringify(storage.personsInCabin)}
      `
  }

  const getPersonsAwaiting = () => storage.personsAwaiting
  const getPersonsInCabin = () => storage.personsInCabin

  return {
    pressFloorButton: elevatorMachine.pressFloorButton,
    setFloor: elevatorMachine.setFloor,
    moveUp: elevatorMachine.moveUp,
    moveDown: elevatorMachine.moveDown,
    pressCabinButton,
    loadCabin,
    unloadCabin,
    addRandomPersonsToAwaitingList,
    addRandomPersonsToCabin,
    processQueue,
    getStatus,
    reset,
    getNextDirection,
    getPersonsAwaiting,
    getPersonsInCabin,
    on,
  }
}

export { initElevatorController }
