import styled from 'styled-components'
import { ElevatorConfig } from '@/config/ElevatorConfig'

export const FloorControlContainer = styled.div`
  height: 60px;
  right: 0;
  position: absolute;
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
`

const BasicButton = styled.button`
  padding: 0;
  width: 80px;
  background-color: #aaa;
  border: 0;
  margin: 5px;
  height: ${ElevatorConfig.floorHeight - 10}px;
  cursor: pointer;
`

export const ButtonUp = styled(BasicButton)`
`
export const ButtonDown = styled(BasicButton)`
`