import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/home.css';            // Tailwind setup
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


