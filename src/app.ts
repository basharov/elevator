import './style.css'
import { ElevatorConfig } from '@/services/ElevatorConfig'
import { initElevatorController } from '@/services/ElevatorController'
import { IPerson } from '@/types/IPerson'

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
      value += `<div class="person ${person.direction}"></div>`
    })
    el.innerHTML = value
  })
}

const createCabin = () => {
  const building = document.querySelector('#building')

  const cabin = document.createElement('div')
  cabin.id = 'cabin'
  cabin.innerHTML = `<div class="cabinValue">0</div>`
  cabin.style.transform = `translateY(-${ElevatorConfig.startFloor * 60}px)`
  building?.appendChild(cabin)

  window.elevatorController.on('beforeFloor', (floorNumber: number) => {
    cabin.style.transform = `translateY(-${floorNumber * 60}px)`
    populateCabin()
    const personsWaiting = window.elevatorController.getPersonsAwaiting()
    populatePersonsAwaiting(personsWaiting)
    populateDataPanel()
  })
}

const createFloorControls = () => {
  const floorButtons = document.querySelector('#floorButtons')

  for (let i = 0; i < ElevatorConfig.floorsCount; i += 1) {
    const floor = document.createElement('div')
    floor.className = 'floorControl'
    const upButton = '<div class="moveUpButton">Up</div>'
    const downButton = `<div class="moveDownButton">Down</div>`
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
  const cabinCountElement = document.querySelector<HTMLDivElement>('.cabinValue')
  cabinCountElement!.innerText = personsInCabin.length
}

const populateDataPanel = () => {
  const personsAwaiting = window.elevatorController.getPersonsAwaiting()
  const personsAwaitingElement = document.querySelector<HTMLDivElement>('#dataPanel .personsAwaiting')
  personsAwaitingElement!.innerText = personsAwaiting.length
}

const createControlPanel = () => {
  console.log('createControlPanel')
  const generatePersonsAwaitingButton = document.querySelector('.generateRandomPersons')
  const loadCabinButton = document.querySelector('.loadCabin')
  const processQueueButton = document.querySelector('.processQueue')

  generatePersonsAwaitingButton?.addEventListener('click', () => {
    const personsWaiting = window.elevatorController.addRandomPersonsToAwaitingList()
    populatePersonsAwaiting(personsWaiting)
  })

  loadCabinButton?.addEventListener('click', async () => {
    await window.elevatorController.loadCabin()
    const personsWaiting = window.elevatorController.getPersonsAwaiting()
    populatePersonsAwaiting(personsWaiting)
    populateCabin()
  })

  processQueueButton?.addEventListener('click', async () => {
    await window.elevatorController.processQueue()
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

  console.log('Initializing elevator UI')
}

init()