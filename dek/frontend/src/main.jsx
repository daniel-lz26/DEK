import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/home.css';
import App from './App.jsx';

// Comprehensive environment variable debug
console.log('🔍 COMPLETE ENVIRONMENT CHECK:', {
  // Your custom variables
  'VITE_SPOTIFY_CLIENT_ID': import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  'VITE_SPOTIFY_REDIRECT_URI': import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
  
  // Vite built-in variables
  'MODE': import.meta.env.MODE,
  'DEV': import.meta.env.DEV, 
  'PROD': import.meta.env.PROD,
  'SSR': import.meta.env.SSR,
  
  // Check if import.meta.env exists at all
  'import.meta.env exists': !!import.meta.env,
  'All env keys': Object.keys(import.meta.env)
});

// Also check if the file is being processed by Vite
console.log('📁 Current file URL:', import.meta.url);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);