import React, { FC } from 'react'
import { CabinContainer } from '@/Components/Cabin/Cabin.styles'
import { ElevatorConfig } from '@/config/ElevatorConfig'

interface IBuildingProps {
  personsCount: number
  position: number
}

const Cabin: FC<IBuildingProps> = ({ personsCount, position }: IBuildingProps) =>
  (<CabinContainer
    style={{ transform: `translateY(${ElevatorConfig.floorHeight * (ElevatorConfig.totalFloorsCount - 1) - position}px)` }}>
    {personsCount}
  </CabinContainer>)

export { Cabin }