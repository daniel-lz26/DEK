import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/home';
import { ProfilePage } from './pages/profile';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { SettingsPage } from './pages/settings';
import { FriendDeks } from './pages/friends';
import { StatsPage } from './pages/stats';
import { LikedPage } from './pages/liked';
import { SpotifyCallback } from './components/SpotifyCallback';
import { isSpotifyAuthenticated, logoutSpotify } from './lib/spotify';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const spotifyAuth = isSpotifyAuthenticated();
    if (spotifyAuth) {
      setIsLoggedIn(true);
      setIsSpotifyConnected(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Check if they just connected via Spotify
    if (isSpotifyAuthenticated()) {
      setIsSpotifyConnected(true);
    }
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSpotifyConnected(false);
    // Clear Spotify tokens if they exist
    logoutSpotify();
  };

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          // If the user is NOT logged in:
          <>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
            <Route path="/callback" element={<SpotifyCallback onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          // If the user IS logged in:
          <>
            <Route path="/" element={<Home onLogout={handleLogout} isSpotifyConnected={isSpotifyConnected} />} />
            <Route path="/profile" element={<ProfilePage onLogout={handleLogout} isSpotifyConnected={isSpotifyConnected} />} />
            <Route path="/friends" element={<FriendDeks onLogout={handleLogout} />} />
            <Route path="/stats" element={<StatsPage onLogout={handleLogout} isSpotifyConnected={isSpotifyConnected} />} />
            <Route path="/settings" element={<SettingsPage onLogout={handleLogout} isSpotifyConnected={isSpotifyConnected} />} />
            <Route path="/liked" element={<LikedPage onLogout={handleLogout} isSpotifyConnected={isSpotifyConnected} />} />
            
            {/* Redirects */}
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
            <Route path="/callback" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;