import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/home';
import { ProfilePage } from './pages/profile';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { SettingsPage } from './pages/settings'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {!isLoggedIn ? (
          // If the user is NOT logged in:
          <>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          // If the user IS logged in:
          <>
            <Route path="/" element={<Home onLogout={handleLogout} />} />
            <Route path="/profile" element={<ProfilePage onLogout={handleLogout} />} />
            {/* 2. Add the new route for the settings page */}
            <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
            
            {/* Redirects */}
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;