// EnvTest.jsx
import React from 'react';

export default function EnvTest() {
  return (
    <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px' }}>
      <h3>Environment Variables Test</h3>
      <p>VITE_SPOTIFY_CLIENT_ID: {import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'NOT FOUND'}</p>
      <p>VITE_SPOTIFY_REDIRECT_URI: {import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'NOT FOUND'}</p>
      <p>MODE: {import.meta.env.MODE}</p>
    </div>
  );
}