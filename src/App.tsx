import React from 'react';
import { Viewport } from './Viewport/Viewport';
import { GlobalStyle } from './GlobalStyle';

export const App = () => {
  return <>
    <GlobalStyle />
    <Viewport />
  </>
}