import React from 'react';
import ReactDOM from "react-dom";
import { App } from "./App";
import { FlagProvider } from './hooks/useFlag'


ReactDOM.render(
    <FlagProvider>
      <App />
    </FlagProvider>,
    document.getElementById('root')  
);
  