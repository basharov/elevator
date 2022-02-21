import { useState } from 'react'
import { ElevatorConfig } from '@/config/ElevatorConfig'

const useBuilding = () => {
  const [floorsCount, setFloorCount] = useState(ElevatorConfig.totalFloorsCount)

  return { floorsCount }
}

export { useBuilding }
