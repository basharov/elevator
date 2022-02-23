import { useCallback, useEffect, useState } from 'react'
import { IPerson } from '@/types/IPerson'
import { ElevatorConfig } from '@/config/ElevatorConfig'
import { isEqual, partition, random, sortBy } from 'lodash'
import { useElevatorMechanism } from '@/hooks/useElevatorMechanism'

const generateDestinationFloor = (person: IPerson) => {

  const range = person.direction === 'up' ? [person.currentFloor + 1, ElevatorConfig.totalFloorsCount - 1] : [1, person.currentFloor - 1]

  const randomFloor = random(range[0], range[1])

  return ({
    ...person,
    destinationFloor: randomFloor,
  })
}

const useElevatorController = () => {
  const [cabinCurrentFloor, setCabinCurrentFloor] = useState<number>(8)

  const {
    moveUp,
    moveDown,
    cabinPosition,
    setCabinPosition,
    stopAndOpenDoors,
    areDoorsOpen,
    closeDoors,
  } = useElevatorMechanism((cabinCurrentFloor - 1) * ElevatorConfig.floorHeight)

  const [cabinDestinationFloor, setCabinDestinationFloor] = useState<number>()
  const [moveDirection, setMoveDirection] = useState<any>()

  const [personsAwaiting, setPersonsAwaiting] = useState<IPerson[]>([])
  const [personsInCabin, setPersonsInCabin] = useState<IPerson[]>([])

  const addPersonAwaitingUp = (currentFloor: number) => {
    setPersonsAwaiting([...personsAwaiting, { currentFloor, direction: 'up', timestamp: new Date().getTime() }])
  }

  const addPersonAwaitingDown = (currentFloor: number) => {
    setPersonsAwaiting([...personsAwaiting, { currentFloor, direction: 'down', timestamp: new Date().getTime() }])
  }

  const getDestinationFloor = useCallback(() => {
    const firstPerson = sortBy(personsAwaiting, 'timestamp')[0]
    setTimeout(() => {
      setCabinDestinationFloor(firstPerson.currentFloor)
      setMoveDirection(firstPerson.direction)
    }, 2000)
  }, [personsAwaiting])

  const putPersonIntoCabin = useCallback(() => {
    const [personsToLoad, remainingPersonsAwaiting] = partition(personsAwaiting, (person) => {
      return person.currentFloor === cabinCurrentFloor && person.direction === moveDirection
    })

    const [personsToUnload, remainingPersonsInCabin] = partition(personsInCabin, (person) => {
      return person.destinationFloor === cabinCurrentFloor
    })

    /*
        if (isEqual(personsToLoad, personsInCabin) || isEqual(remainingPersonsAwaiting, personsAwaiting)) {
          return
        }
    */

    const personsToLoadInCabin = [...personsToLoad.map(generateDestinationFloor), ...remainingPersonsInCabin]

    setPersonsAwaiting(remainingPersonsAwaiting)
    setPersonsInCabin(personsToLoadInCabin)
    closeDoors()
  }, [cabinCurrentFloor, closeDoors, moveDirection, personsAwaiting, personsInCabin])

  useEffect(() => {
    if (personsAwaiting.length > 0) {
      console.log(`${personsAwaiting.length} persons are waiting for the cabin to come`)
      getDestinationFloor()
    }
  }, [getDestinationFloor, personsAwaiting])

  useEffect(() => {
    if (cabinDestinationFloor) {
      setCabinCurrentFloor(cabinDestinationFloor)
    }
  }, [cabinCurrentFloor, cabinDestinationFloor])

  useEffect(() => {
    if (!cabinDestinationFloor) {
      return
    }

    if (cabinDestinationFloor > cabinCurrentFloor) {
      moveUp()
    } else if (cabinDestinationFloor < cabinCurrentFloor) {
      moveDown()
    }
  }, [cabinCurrentFloor, cabinDestinationFloor, moveDown, moveUp])

  useEffect(() => {
    if (!cabinDestinationFloor) {
      return
    }

    const destinationPosition = cabinDestinationFloor * ElevatorConfig.floorHeight

    if ((moveDirection === 'up' && cabinPosition > destinationPosition) || (moveDirection === 'down' && cabinPosition < destinationPosition)) {
      setCabinPosition(destinationPosition)
      stopAndOpenDoors()
    }
  }, [cabinDestinationFloor, cabinPosition, moveDirection, setCabinPosition, stopAndOpenDoors])

  const selectNextAction = useCallback(() => {
    console.log('selectNextAction')
    const personsSortedByFloor = sortBy(personsInCabin, 'destinationFloor')
    if (personsSortedByFloor.length > 0) {
      setCabinDestinationFloor(personsSortedByFloor[0].destinationFloor)
    }
  }, [personsInCabin])

  useEffect(() => {
    if (areDoorsOpen) {
      putPersonIntoCabin()
    } else {
      setTimeout(() => {
        selectNextAction()
      }, 1000)

    }
  }, [areDoorsOpen])

  return {
    cabinCurrentFloor,
    cabinPosition,
    personsAwaiting,
    addPersonAwaitingUp,
    addPersonAwaitingDown,
    putPersonIntoCabin,
    personsInCabin,
  }
}

export { useElevatorController }
