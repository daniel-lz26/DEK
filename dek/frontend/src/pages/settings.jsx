// src/pages/SettingsPage.jsx

import React, { useState } from 'react';
import { SearchBar } from "../components/SearchBar";
import { MusicPlayer } from "../components/MusicPlayer";
import { LeftSidebar } from "../components/LeftSideBar";

// A simple toggle switch component for our settings
const ToggleSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  return (
    <button
      onClick={() => setIsEnabled(!isEnabled)}
      className={`${
        isEnabled ? 'bg-red-500' : 'bg-neutral-600'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
    >
      <span
        className={`${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
};

export const SettingsPage = ({ onLogout }) => {
  return (
    <div className="bg-neutral-900 text-white font-sans h-screen overflow-hidden">
      {/* Re-using your main layout components */}
      <SearchBar onLogout={onLogout} />
      <LeftSidebar />
      <MusicPlayer />

      {/* Main content area for the settings */}
      <main className="ml-24 h-full overflow-y-auto pt-20">
        <div className="max-w-4xl mx-auto px-8 pb-24">
          <h1 className="text-4xl font-bold mb-8">Settings</h1>

          {/* Account Settings Section */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold border-b border-neutral-700 pb-2 mb-4">Account</h2>
            <div className="flex justify-between items-center py-2">
              <p>Email Address</p>
              <span className="text-neutral-400">user@example.com</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <p>Password</p>
              <button className="text-red-400 hover:underline">Change Password</button>
            </div>
          </section>

          {/* Appearance Settings Section */}
          <section>
            <h2 className="text-xl font-semibold border-b border-neutral-700 pb-2 mb-4">Appearance</h2>
            <div className="flex justify-between items-center py-2">
              <p>Dark Mode</p>
              <ToggleSwitch />
            </div>
            <div className="flex justify-between items-center py-2">
              <p>Language</p>
              <span className="text-neutral-400">English</span>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};