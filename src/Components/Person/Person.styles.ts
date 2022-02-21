import styled from 'styled-components'
import { ElevatorConfig } from '@/config/ElevatorConfig'

export const PersonsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(50% - ${ElevatorConfig.cabinWidth / 2}px - 4px);
  justify-content: flex-end;
`

export const PersonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 20px;
  margin: 0 2px;
`

const BasicPerson = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  font-size: 12px;
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`

export const Up = styled(BasicPerson)`
  background-color: #649425;
`

export const Down = styled(BasicPerson)`
  background-color: #94252e;
`