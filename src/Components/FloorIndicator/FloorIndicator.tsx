import React, { FC } from 'react'

import { FloorIndicatorContainer } from './FloorIndicator.styles'

interface IFloorProps {
  floorNumber: number
  highlight: boolean
}

const FloorIndicator: FC<IFloorProps> = ({ floorNumber, highlight }: IFloorProps) => {
  return <FloorIndicatorContainer $highlight={highlight}>
    {floorNumber}
  </FloorIndicatorContainer>
}

export { FloorIndicator }