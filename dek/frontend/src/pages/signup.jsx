// src/pages/SignupPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export const SignupPage = ({ onSignup }) => {
  return (
    <div className="bg-neutral-900 text-white h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Create Account</h1>
        <p className="text-neutral-400 mb-8">Join DekMusic to start sharing.</p>
      </div>
      
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username"
            className="w-full bg-neutral-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input 
            type="email" 
            placeholder="Email Address"
            className="w-full bg-neutral-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full bg-neutral-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          
          {/* This button simulates a successful signup and logs the user in */}
          <button 
            onClick={onSignup} 
            className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-full hover:bg-red-600 transition-colors mt-4"
          >
            Sign Up
          </button>
          
          <p className="text-xs text-neutral-500 text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-red-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};