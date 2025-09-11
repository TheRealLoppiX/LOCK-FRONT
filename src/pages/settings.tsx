import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './settings.css';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Configurações</h1>

        <div className="settings-section">
          <h2>Preferências</h2>
          <div className="settings-option">
            <label htmlFor="theme-toggle">
              Tema {theme === 'dark' ? 'Escuro' : 'Claro'}
            </label>
            <button onClick={toggleTheme} className="theme-toggle-btn">
              Mudar para {theme === 'dark' ? 'Claro' : 'Escuro'}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Conta</h2>
          <div className="settings-option">
            <p>Alterar Senha</p>
            <button className="settings-btn">Alterar</button>
          </div>
          <div className="settings-option">
            <p>Deletar Conta</p>
            <button className="settings-btn danger">Deletar</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;