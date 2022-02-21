import React, { FC } from 'react'
import { ElevatorContainer, FloorsIndicatorsContainer, Shaft } from '@/Components/Elevator/Elevator.styles'
import { Cabin } from '@/Components/Cabin/Cabin'
import { FloorIndicator } from '@/Components/FloorIndicator/FloorIndicator'

interface IElevatorProps {
  currentFloor: number
  floorsCount: number
}

const Elevator: FC<IElevatorProps> = ({ currentFloor, floorsCount }: IElevatorProps) =>
  (<ElevatorContainer>
    <Shaft>
      <Cabin currentFloor={currentFloor} />
      <FloorsIndicatorsContainer>
        {Array.from(Array(floorsCount).keys()).reverse().map((floorNumber) => (
          <FloorIndicator
            key={floorNumber}
            floorNumber={floorNumber + 1} />))}
      </FloorsIndicatorsContainer>
    </Shaft>
  </ElevatorContainer>)

export { Elevator }