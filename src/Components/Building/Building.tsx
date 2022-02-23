import React, { FC } from 'react'

import { BuildingContainer } from './Building.styles'
import { Floor } from '@/Components/Floor/Floor'
import { Elevator } from '@/Components/Elevator/Elevator'
import { IPerson } from '@/types/IPerson'

interface IBuildingProps {
  floorsCount: number
  cabinCurrentFloor: number
  cabinPosition: number
  addPersonAwaitingUp: any
  addPersonAwaitingDown: any
  personsAwaiting: IPerson[]
  personsInCabin: IPerson[]
}

const Building: FC<IBuildingProps> = ({
  floorsCount,
  cabinCurrentFloor,
  cabinPosition,
  addPersonAwaitingUp,
  personsAwaiting,
  personsInCabin,
  addPersonAwaitingDown,
}: IBuildingProps) =>
  (<BuildingContainer>
    {Array.from(Array(floorsCount).keys()).reverse().map((floorNumber) => {

      const personsAwaitingOnTheFloor = personsAwaiting.filter(person => person.currentFloor === floorNumber)

      return (
        <Floor
          key={floorNumber}
          floorNumber={floorNumber + 1}
          cabinCurrentFloor={cabinCurrentFloor}
          addPersonAwaitingUp={addPersonAwaitingUp}
          addPersonAwaitingDown={addPersonAwaitingDown}
          personsAwaiting={personsAwaitingOnTheFloor}
        />)
    })}
    <Elevator
      cabinCurrentFloor={cabinCurrentFloor}
      floorsCount={floorsCount}
      cabinPosition={cabinPosition}
      personsInCabin={personsInCabin} />
  </BuildingContainer>)

export { Building }