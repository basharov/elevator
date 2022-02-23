import React, { FC } from 'react'

import { ButtonDown, ButtonUp, FloorControlContainer } from './FloorControl.styles'
import { ElevatorConfig } from '@/config/ElevatorConfig'

interface IFloorControlProps {
  floorNumber: number
  cabinCurrentFloor: number
  addPersonAwaitingUp: any
  addPersonAwaitingDown: any
}

const FloorControl: FC<IFloorControlProps> = ({
  floorNumber,
  cabinCurrentFloor,
  addPersonAwaitingUp,
  addPersonAwaitingDown,
}: IFloorControlProps) => {
  return <FloorControlContainer>
    <ButtonUp
      disabled={cabinCurrentFloor === ElevatorConfig.totalFloorsCount}
      onClick={() => {
        addPersonAwaitingUp(floorNumber - 1)
      }}>Up</ButtonUp>
    <ButtonDown
      onClick={() => {
        addPersonAwaitingDown(floorNumber - 1)
      }}>Down</ButtonDown>
  </FloorControlContainer>
}

export { FloorControl }