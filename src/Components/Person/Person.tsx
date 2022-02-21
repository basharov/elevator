import React, { FC } from 'react'

import { Down, PersonContainer, Up } from './Person.styles'

interface IPersonProps {
  direction: 'up' | 'down'
  toFloor: number
}

const Person: FC<IPersonProps> = ({ direction, toFloor }: IPersonProps) => {
  return <PersonContainer>
    {direction === 'up' ? <Up>{toFloor}</Up> : <Down>{toFloor}</Down>}
  </PersonContainer>
}

export { Person }