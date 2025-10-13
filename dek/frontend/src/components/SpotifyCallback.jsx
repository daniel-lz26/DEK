import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleSpotifyCallback } from '../lib/spotify';

export const SpotifyCallback = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const authError = searchParams.get('error');

      if (authError) return setError(`Spotify error: ${authError}`);
      if (!code) return setError('No authorization code received');

      try {
        await handleSpotifyCallback(code, state);
        onLogin();
        navigate('/');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [searchParams, navigate, onLogin]);

  const renderContent = () => {
    if (loading) return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connecting to Spotify</h2>
        <p className="text-neutral-400">Setting up your account...</p>
      </div>
    );

    if (error) return (
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2 text-red-500">Authentication Error</h2>
        <p className="text-neutral-400 mb-6">{error}</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors"
        >
          Back to Login
        </button>
      </div>
    );

    return null;
  };

  return (
    <div className="bg-neutral-900 text-white h-screen flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
};