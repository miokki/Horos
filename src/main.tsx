import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/index';
import App from './App';
import './assets/styles.css';
import { registerServiceWorker } from './pwa';

/**
 * Renderowanie głównego komponentu aplikacji
 * Inicjalizacja React w trybie strict mode
 * Konfiguracja Redux store i PWA
 */
// Rejestracja service workera dla PWA
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
