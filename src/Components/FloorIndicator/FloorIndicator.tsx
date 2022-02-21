import React, { FC } from 'react'

import { FloorIndicatorContainer } from './FloorIndicator.styles'

interface IFloorProps {
  floorNumber: number;
}

const FloorIndicator: FC<IFloorProps> = ({ floorNumber }: IFloorProps) => {
  return <FloorIndicatorContainer>
    {floorNumber}
  </FloorIndicatorContainer>
}

export { FloorIndicator }