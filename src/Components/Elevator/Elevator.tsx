import React, { FC } from 'react'
import { ElevatorContainer, FloorsIndicatorsContainer, Shaft } from '@/Components/Elevator/Elevator.styles'
import { Cabin } from '@/Components/Cabin/Cabin'
import { FloorIndicator } from '@/Components/FloorIndicator/FloorIndicator'
import { IPerson } from '@/types/IPerson'

interface IElevatorProps {
  cabinCurrentFloor: number
  floorsCount: number
  cabinPosition: number
  personsInCabin: IPerson[]
}

const Elevator: FC<IElevatorProps> = ({ personsInCabin, floorsCount, cabinPosition }: IElevatorProps) => {
  const highlights = personsInCabin

  return <ElevatorContainer>
    <Shaft>
      <Cabin personsCount={personsInCabin.length} position={cabinPosition} />
      <FloorsIndicatorsContainer>
        {Array.from(Array(floorsCount).keys()).reverse().map((floorNumber) => (
          <FloorIndicator
            key={floorNumber}
            floorNumber={floorNumber + 1}
            highlight={highlights.some(person=>person.destinationFloor===floorNumber)}
          />
        ))}
      </FloorsIndicatorsContainer>
    </Shaft>
  </ElevatorContainer>
}
export { Elevator }