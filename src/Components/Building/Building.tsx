import React from 'react'

import { BuildingContainer } from './Building.styles'
import { Floor } from '@/Components/Floor/Floor'
import { Elevator } from '@/Components/Elevator/Elevator'

interface IBuildingProps {
  floorsCount: number
  currentFloor: number
  setCurrentFloor: any
  addPersonAwaitingUp: any
  addPersonAwaitingDown: any
  floorsPersonsCounts: any
}

const Building = ({
  floorsCount,
  currentFloor,
  setCurrentFloor,
  addPersonAwaitingUp,
  floorsPersonsCounts,
  addPersonAwaitingDown,
}: IBuildingProps) =>
  (<BuildingContainer>
    {Array.from(Array(floorsCount).keys()).reverse().map((floorNumber) => (
      <Floor
        key={floorNumber}
        floorNumber={floorNumber + 1}
        currentFloor={currentFloor}
        setCurrentFloor={setCurrentFloor}
        addPersonAwaitingUp={addPersonAwaitingUp}
        floorsPersonsCounts={floorsPersonsCounts}
        addPersonAwaitingDown={addPersonAwaitingDown}
      />))}
    <Elevator currentFloor={currentFloor} floorsCount={floorsCount} />
  </BuildingContainer>)

export { Building }