import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TradeOSProvider } from './context/TradeOSContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TradeOSProvider>
      <App />
    </TradeOSProvider>
  </React.StrictMode>
);
