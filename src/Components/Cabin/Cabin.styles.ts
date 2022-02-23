import styled from 'styled-components'
import { ElevatorConfig } from '@/config/ElevatorConfig'

export const CabinContainer = styled.div`
  background-color: white;
  border: 1px solid black;
  box-sizing: border-box;
  height: ${ElevatorConfig.floorHeight - 4}px;
  width: ${ElevatorConfig.cabinWidth - 4}px;
  position: absolute;
  top: 1px;
  left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  //transition: transform 0.5s ease-out;
  z-index: 200;
`