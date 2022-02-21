import React, { useEffect } from 'react'
import { ControlBar, MainContainer } from './Viewport.styles'
import { useBuilding } from '@/hooks/useBuilding'
import { Building } from '@/Components/Building/Building'
import { useElevator } from '@/hooks/useElevator'
import { ElevatorConfig } from '@/config/ElevatorConfig'

const Viewport = () => {
  const { floorsCount } = useBuilding()
  const {
    currentFloor, setCurrentFloor,
    floorsPersonsCounts,
    addPersonAwaitingUp,
    addPersonAwaitingDown,
  } = useElevator()

  useEffect(() => {
    console.log('floorsPersonsCounts')

    const isSomeoneWaiting = Object.keys(floorsPersonsCounts).map(floorKey => {
      return floorsPersonsCounts[floorKey]
    })

    console.log(isSomeoneWaiting)

  }, [floorsPersonsCounts, setCurrentFloor])

  return (
    <MainContainer>
      <Building floorsCount={floorsCount} currentFloor={currentFloor} setCurrentFloor={setCurrentFloor}
                addPersonAwaitingUp={addPersonAwaitingUp}
                floorsPersonsCounts={floorsPersonsCounts}
                addPersonAwaitingDown={addPersonAwaitingDown}
      />
      <ControlBar>
        <button
          disabled={currentFloor === ElevatorConfig.totalFloorsCount}
          onClick={() => {
            setCurrentFloor(currentFloor + 1)
          }}>Go up
        </button>
        <button
          disabled={currentFloor === 1}

          onClick={() => {
            setCurrentFloor(currentFloor - 1)
          }}>Go down
        </button>
      </ControlBar>
    </MainContainer>
  )

}

export { Viewport }
