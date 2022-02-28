import './style.css'
import { DirectionsLabels, ElevatorConfig } from '@/services/ElevatorConfig'
import { initElevatorController } from '@/services/ElevatorController'
import { random, sample } from 'lodash'
import { CabinDirection, IPerson } from '@/services/types'

const createBuilding = () => {
  const building = document.querySelector('#building')

  for (let i = 0; i < ElevatorConfig.floorsCount; i += 1) {
    const floor = document.createElement('div')
    floor.className = 'floor'
    floor.innerHTML = `<div class="floorRow"></div><div class="floorIndicator">${String(i + 1)}</div>`
    building?.appendChild(floor)
  }
}

const populatePersonsAwaiting = (persons: IPerson[]) => {
  const rows = document.querySelectorAll<HTMLDivElement>('.floorRow')
  rows.forEach((el, index) => {
    const personsFiltered = persons.filter(person => person.startFloor === index)

    let value = ''
    personsFiltered.forEach((person: IPerson) => {
      value += `<div class="person ${DirectionsLabels[person.direction]}"></div>`
    })
    el.innerHTML = value
  })
}

const createCabin = () => {
  const building = document.querySelector('#building')
  const cabin = document.createElement('div')

  cabin.id = 'cabin'
  cabin.innerHTML = `<div class="cabinLabel">0</div>`
  cabin.style.transform = `translateY(-${ElevatorConfig.startFloor * 60}px)`
  building?.appendChild(cabin)

  window.elevatorController.onBeforeFloor && window.elevatorController.onBeforeFloor((floorNumber: number) => {
    cabin.style.transform = `translateY(-${floorNumber * 60}px)`
    populateCabin()
    const personsWaiting = window.elevatorController.getPersonsAwaiting()
    populatePersonsAwaiting(personsWaiting)
    populateDataPanel()
    updateDestinationFloors()
  })
}

const updateDestinationFloors = () => {
  const floorIndicators = document.querySelectorAll<HTMLDivElement>('.floorIndicator')
  const personsInCabin: IPerson[] = window.elevatorController.getPersonsInCabin()

  const destinationFloors = personsInCabin.reduce((accum: number[], person: IPerson) => {
    if (accum.indexOf(person.destinationFloor!) < 0) {
      accum.push(person.destinationFloor!)
    }
    return accum
  }, [])

  floorIndicators.forEach((el, index) => {
    if (destinationFloors.indexOf(index) > -1) {
      el.classList.add('activeDestination')
    } else {
      el.classList.remove('activeDestination')
    }
  })
}


const createFloorControls = () => {
  const floorButtons = document.querySelector('#floorButtons')
  for (let i = 0; i < ElevatorConfig.floorsCount; i += 1) {
    const floor = document.createElement('div')
    floor.className = 'floorControl'
    const upButton = `<div class="moveUpButton" data-floor="${i}">Up</div>`
    const downButton = `<div class="moveDownButton" data-floor="${i}">Down</div>`
    if (i === 0) {
      floor.innerHTML = upButton
    } else if (i === ElevatorConfig.floorsCount - 1) {
      floor.innerHTML = downButton
    } else {
      floor.innerHTML = `${upButton}${downButton}`
    }

    floorButtons?.appendChild(floor)
  }
}

const populateCabin = () => {
  const personsInCabin = window.elevatorController.getPersonsInCabin()
  const cabinCountElement = document.querySelector<HTMLDivElement>('.cabinLabel')
  cabinCountElement!.innerText = String(personsInCabin.length)
}

const populateDataPanel = () => {
  const personsAwaiting = window.elevatorController.getPersonsAwaiting()
  const personsInCabin = window.elevatorController.getPersonsInCabin()
  const personsAwaitingElement = document.querySelector<HTMLDivElement>('#dataPanel .personsAwaiting')
  const personsInCabinElement = document.querySelector<HTMLDivElement>('#dataPanel .cabinValue')
  personsAwaitingElement!.innerHTML = `<div class="dataRow">Awaiting: ${personsAwaiting.length}</div>`
  personsInCabinElement!.innerHTML = `<div class="dataRow">In cabin: ${personsInCabin.length}</div>`
}

const createControlPanel = () => {
  console.log('createControlPanel')
  const generatePersonsAwaitingButton = document.querySelector('.generateRandomPersons')
  const processQueueButton = document.querySelector('.processQueue')
  const randomFloorPressButton = document.querySelector('.randomFloorPress')
  const speedControl = document.querySelector('.speedControl')

  generatePersonsAwaitingButton?.addEventListener('click', () => {
    const personsToGenerateInput = document.querySelector<HTMLInputElement>('#personsToGenerate')
    const personsWaiting = window.elevatorController.addRandomPersonsToAwaitingList(Number(personsToGenerateInput?.value))
    populatePersonsAwaiting(personsWaiting)
  })

  processQueueButton?.addEventListener('click', async () => {
    await window.elevatorController.processQueue()
  })

  speedControl?.addEventListener('change', async (event: any) => {
    window.config.speed = Number(event.currentTarget?.value)
  })


  const generateRandomFloorButton = () => {
    const direction = sample<any>([CabinDirection.Up, CabinDirection.Down])
    const startFloor = random(direction === CabinDirection.Down ? 1 : 0, direction === CabinDirection.Up ? ElevatorConfig.floorsCount - 2 : ElevatorConfig.floorsCount - 1)
    return { startFloor, direction }
  }

  randomFloorPressButton?.addEventListener('dblclick', async () => {
    return
  })

  randomFloorPressButton?.addEventListener('click', async () => {
    setInterval(() => {
        window.elevatorController.addRandomPersonsToAwaitingList(2)
        const { startFloor, direction } = generateRandomFloorButton()
        window.elevatorController.pressFloorButton(startFloor, direction)
        const personsAwaiting = window.elevatorController.getPersonsAwaiting()
        populatePersonsAwaiting(personsAwaiting)
        populateCabin()
      },
      random(0, 300),
    )
  })
}

const bindFloorButtons = () => {
  const upButtons = document.querySelectorAll<HTMLDivElement>('.moveUpButton')
  const downButtons = document.querySelectorAll<HTMLDivElement>('.moveDownButton')
  upButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const floor = Number(button.getAttribute('data-floor'))
      window.elevatorController.pressFloorButton(floor, CabinDirection.Up)

      const personsWaiting = window.elevatorController.getPersonsAwaiting()
      populatePersonsAwaiting(personsWaiting)
      populateDataPanel()

    })
  })

  downButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const floor = Number(button.getAttribute('data-floor'))
      window.elevatorController.pressFloorButton(floor, CabinDirection.Down)

      const personsWaiting = window.elevatorController.getPersonsAwaiting()
      populatePersonsAwaiting(personsWaiting)
      populateDataPanel()

    })
  })
}

const bindControllerEvents = () => {
  window.elevatorController.onServedAll && window.elevatorController.onServedAll(() => {
    console.log('No people to serve. Should stop and wait.')
    updateDestinationFloors()
    populateCabin()
  })
  window.elevatorController.onLoggableEvent && window.elevatorController.onLoggableEvent((eventLabel: any) => {
    document.querySelectorAll('.actionsList > div').forEach((el) => {
      if (el.classList.contains(eventLabel)) {
        el.classList.add('active')
      } else {
        el.classList.remove('active')
      }
    })
  })
}

const initElevatorInterface = async () => {
  window.elevatorController = await initElevatorController(ElevatorConfig)
}

const init = async () => {
  await initElevatorInterface()
  createBuilding()
  createFloorControls()
  createControlPanel()
  createCabin()

  bindFloorButtons()
  bindControllerEvents()

  console.log('Initializing elevator UI')
}

init()