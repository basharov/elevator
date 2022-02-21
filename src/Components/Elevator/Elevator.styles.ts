import styled from 'styled-components'

import { ElevatorConfig } from '@/config/ElevatorConfig'

export const ElevatorContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  width: ${ElevatorConfig.cabinWidth}px;
  height: ${ElevatorConfig.floorHeight * ElevatorConfig.totalFloorsCount}px;
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -${ElevatorConfig.cabinWidth / 2}px
`

export const FloorsIndicatorsContainer = styled(ElevatorContainer)`
`

export const Shaft = styled.div`
  background-color: #999;
  width: ${ElevatorConfig.cabinWidth}px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
`