import { initElevatorController } from './ElevatorController'
import { ElevatorConfig } from './ElevatorConfig'
import readline from 'readline'

import util from 'util'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = util.promisify(rl.question).bind(rl)

const floorPressButtonRx = new RegExp(/floor (\d+) (up|down)/i)
const setFloorRx = new RegExp(/set floor (\d+)/i)
const cabinPressButtonRx = new RegExp(/cabin (\d+) (up|down)/i)

const runApp = async () => {
  const elevatorController = await initElevatorController(ElevatorConfig)

  const runPrompt = async () => {
    const result = await question(': ')
    processMessage(result)
  }

  const processMessage = async (input: any) => {
    if (input.match(floorPressButtonRx)) {
      elevatorController.pressFloorButton(Number(input.match(floorPressButtonRx)[1]), input.match(floorPressButtonRx)[2])
    } else if (input.match(cabinPressButtonRx)) {
      elevatorController.pressCabinButton(Number(input.match(cabinPressButtonRx)[1]), input.match(cabinPressButtonRx)[2])
    } else if (input.match(setFloorRx)) {
      elevatorController.setFloor(Number(input.match(setFloorRx)[1]))
    } else if (input === 'status') {
      console.log(elevatorController.getStatus())
    } else if (input === 'run') {
      elevatorController.processQueue()
    } else if (input === 'rnd w') {
      elevatorController.addRandomPersonsToAwaitingList()
    } else if (input === 'rnd c') {
      elevatorController.addRandomPersonsToCabin()
    } else if (input === 'load') {
      elevatorController.loadCabin()
    } else if (input === 'unload') {
      elevatorController.unloadCabin()
    } else if (input === 'reset') {
      elevatorController.reset()
    } else if (input === 'next') {
      console.log(await elevatorController.getNextDirection())
    } else if (input === 'up') {
      elevatorController.moveUp()
    } else if (input === 'down') {
      elevatorController.moveDown()
    }

    runPrompt()
  }

  runPrompt()
}


runApp()