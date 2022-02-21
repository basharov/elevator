import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: #fff;
    padding: 0;
    margin: 0;
    touch-action: pan-x pan-y;
    font-family: sans-serif;
  }

  #root {
    background-color: red;
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
`
