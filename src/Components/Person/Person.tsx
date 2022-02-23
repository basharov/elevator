import React, { FC } from 'react'

import { Down, PersonContainer, Up } from './Person.styles'

interface IPersonProps {
  direction: 'up' | 'down'
}

const Person: FC<IPersonProps> = ({ direction }: IPersonProps) => {
  return <PersonContainer>
    {direction === 'up' ? <Up /> : <Down />}
  </PersonContainer>
}

export { Person }