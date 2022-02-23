import React, { FC, useEffect } from 'react'
import { MainContainer } from './Viewport.styles'
import { useBuilding } from '@/hooks/useBuilding'
import { Building } from '@/Components/Building/Building'
import { useElevatorController } from '@/hooks/useElevatorController'

const Viewport: FC = () => {
  const { floorsCount } = useBuilding()
  const {
    cabinCurrentFloor,
    cabinPosition,
    personsAwaiting,
    addPersonAwaitingUp,
    addPersonAwaitingDown,
    personsInCabin,
  } = useElevatorController()

  return (
    <MainContainer>
      <Building
        personsInCabin={personsInCabin}
        cabinPosition={cabinPosition}
        floorsCount={floorsCount}
        cabinCurrentFloor={cabinCurrentFloor}
        addPersonAwaitingUp={addPersonAwaitingUp}
        addPersonAwaitingDown={addPersonAwaitingDown}
        personsAwaiting={personsAwaiting}
      />
    </MainContainer>
  )

}

export { Viewport }
