import React from 'react';
import Layout from './shared/components/Layout/Layout';
import './assets/styles.css';

/**
 * Główny komponent aplikacji
 * Wykorzystuje Layout jako podstawowy układ strony
 * @returns {JSX.Element} Główny widok aplikacji
 */
const App: React.FC = () => {
  return (
    <Layout>
      <div className="app-content">
        <h2>Witaj w Horos</h2>
        <p>Twoja aplikacja astrologiczna</p>
      </div>
    </Layout>
  );
};

export default App;
