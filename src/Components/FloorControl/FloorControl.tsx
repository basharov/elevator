import React, { FC } from 'react'

import { ButtonDown, ButtonUp, FloorControlContainer } from './FloorControl.styles'
import { useElevator } from '@/hooks/useElevator'
import { ElevatorConfig } from '@/config/ElevatorConfig'

interface IFloorControlProps {
  floorNumber: any
  currentFloor: any
  setCurrentFloor: any
  addPersonAwaitingUp: any
  addPersonAwaitingDown: any
}

const FloorControl: FC<IFloorControlProps> = ({
  floorNumber,
  currentFloor,
  setCurrentFloor,
  addPersonAwaitingUp,
  addPersonAwaitingDown,
}: IFloorControlProps) => {
  return <FloorControlContainer>
    <ButtonUp
      disabled={currentFloor === ElevatorConfig.totalFloorsCount}
      onClick={() => {
        // setCurrentFloor(currentFloor + 1)
        addPersonAwaitingUp(floorNumber)
      }}>Up</ButtonUp>
    <ButtonDown
      onClick={() => {
        // setCurrentFloor(currentFloor - 1)
        addPersonAwaitingDown(floorNumber)
      }}>Down</ButtonDown>
  </FloorControlContainer>
}

export { FloorControl }