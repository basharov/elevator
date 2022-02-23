import React, { FC } from 'react'

import { FloorContainer } from './Floor.styles'
import { FloorControl } from '@/Components/FloorControl/FloorControl'
import { Person } from '@/Components/Person/Person'
import { PersonsRow } from '../Person/Person.styles'
import { IPerson } from '@/types/IPerson'

interface IFloorProps {
  floorNumber: number
  cabinCurrentFloor: number
  addPersonAwaitingUp: any
  addPersonAwaitingDown: any
  personsAwaiting: IPerson[]
}

const Floor: FC<IFloorProps> = ({
  floorNumber,
  cabinCurrentFloor,
  addPersonAwaitingUp,
  personsAwaiting,
  addPersonAwaitingDown,
}: IFloorProps) => {

  return <FloorContainer>
    <PersonsRow>
      {personsAwaiting.map((person, index: number) =>
        <Person key={`${index}-${floorNumber}`} direction={person.direction} />)}
    </PersonsRow>
    <FloorControl
      floorNumber={floorNumber}
      cabinCurrentFloor={cabinCurrentFloor}
      addPersonAwaitingUp={addPersonAwaitingUp}
      addPersonAwaitingDown={addPersonAwaitingDown}
    />
  </FloorContainer>
}

export { Floor }