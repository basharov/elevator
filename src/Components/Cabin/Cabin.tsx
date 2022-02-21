import React from 'react'
import { CabinContainer } from '@/Components/Cabin/Cabin.styles'
import { ElevatorConfig } from '@/config/ElevatorConfig'

interface IBuildingProps {
  currentFloor: number
}

const Cabin = ({ currentFloor }: IBuildingProps) =>
  (<CabinContainer
    style={{ transform: `translateY(${ElevatorConfig.floorHeight * ElevatorConfig.totalFloorsCount - currentFloor * ElevatorConfig.floorHeight}px)` }}>
    {currentFloor}
  </CabinContainer>)

export { Cabin }