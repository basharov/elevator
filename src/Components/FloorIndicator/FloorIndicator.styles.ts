import styled from 'styled-components'

export const FloorIndicatorContainer = styled.div<{ $highlight: boolean }>`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #999;
  border-top: 0;
  box-sizing: border-box;
  font-weight: bold;
  background-color: ${({ $highlight }) => ($highlight ? 'green' : 'transparent')};
  color: ${({ $highlight }) => ($highlight ? '#fff' : '#444')};
`