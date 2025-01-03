import React from 'react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Główny komponent układu aplikacji
 * @param {LayoutProps} props - Właściwości komponentu
 * @returns {JSX.Element} Komponent układu
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>Horos</h1>
      </header>
      <main className="main">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2024 Horos</p>
      </footer>
    </div>
  );
};

export default Layout;
