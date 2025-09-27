// src/pages/LoginPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export const LoginPage = ({ onLogin }) => {
  return (
    <div className="bg-neutral-900 text-white h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">DekMusic</h1>
        <p className="text-neutral-400 mb-8">Log in or sign up to continue.</p>
      </div>
      
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex flex-col gap-4">
          
          {/* 2. Sign Up Button */}
          <Link 
            to="/signup"
            className="w-full border border-neutral-500 text-white font-bold py-3 px-4 rounded-full text-center hover:border-white transition-colors"
          >
            Sign Up
          </Link>

          {/* Log In Button */}
          <button 
            onClick={onLogin} 
            className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-full hover:bg-red-600 transition-colors"
          >
            Log In
          </button>
          
        </div>
        <p className="text-xs text-neutral-500 mt-6 text-center">
          (This is a demo. No username or password needed.)
        </p>
      </div>
    </div>
  );
};