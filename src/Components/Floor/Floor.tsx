import React, { FC } from 'react'

import { FloorContainer } from './Floor.styles'
import { FloorControl } from '@/Components/FloorControl/FloorControl'
import { Person } from '@/Components/Person/Person'
import { PersonsRow } from '../Person/Person.styles'

interface IFloorProps {
  floorNumber: number
  currentFloor: any
  setCurrentFloor: any
  addPersonAwaitingUp: any
  floorsPersonsCounts: any
  addPersonAwaitingDown: any
}

const Floor: FC<IFloorProps> = ({
  floorNumber,
  currentFloor,
  setCurrentFloor,
  addPersonAwaitingUp,
  floorsPersonsCounts,
  addPersonAwaitingDown,
}: IFloorProps) => {

  return <FloorContainer>
    <PersonsRow>
      {(floorsPersonsCounts[floorNumber] || []).map((key: any, index: number) =>
        <Person key={`${index}-${floorNumber}`} direction={key > floorNumber ? 'up' : 'down'} toFloor={key}/>)}
    </PersonsRow>
    <FloorControl
      floorNumber={floorNumber}
      currentFloor={currentFloor}
      setCurrentFloor={setCurrentFloor}
      addPersonAwaitingUp={addPersonAwaitingUp}
      addPersonAwaitingDown={addPersonAwaitingDown}
    />
  </FloorContainer>
}

export { Floor }