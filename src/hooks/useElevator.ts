import { useState } from 'react'
import { ElevatorConfig } from '@/config/ElevatorConfig'
import { randomNumber } from '@/utils/generateNumber'

const useElevator = () => {
  const [currentFloor, setCurrentFloor] = useState(1)
  const [floorsPersonsCounts, setFloorsPersonsCounts] = useState<any>({})

  const getToken = async () => {
    const resp = await fetch('/api/token')
    const data = await resp.json()
    return data.token
  }

  const addPersonAwaitingUp = (floor: number) => {
    setFloorsPersonsCounts({ ...floorsPersonsCounts, ...{ [floor]: [...(floorsPersonsCounts[floor] || []), randomNumber(floor, ElevatorConfig.totalFloorsCount)] } })
  }

  const addPersonAwaitingDown = (floor: number) => {
    setFloorsPersonsCounts({ ...floorsPersonsCounts, ...{ [floor]: [...(floorsPersonsCounts[floor] || []), randomNumber(floor, 1)] } })
  }

  return {
    getToken,
    currentFloor,
    setCurrentFloor,
    floorsPersonsCounts,
    addPersonAwaitingUp,
    addPersonAwaitingDown,
  }
}

export { useElevator }
