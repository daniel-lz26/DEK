// src/pages/ProfilePage.jsx

import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { MusicPlayer } from '../components/MusicPlayer';
import { LeftSidebar } from '../components/LeftSideBar';
import { FriendDeks } from '../components/FriendDeks';

// Sample data for the user's top artists
const topArtists = [
  { name: 'Artist One', image: 'https://placehold.co/200x200/34d399/FFFFFF?text=A1' },
  { name: 'Artist Two', image: 'https://placehold.co/200x200/fbbf24/FFFFFF?text=A2' },
  { name: 'Artist Three', image: 'https://placehold.co/200x200/818cf8/FFFFFF?text=A3' },
  { name: 'Artist Four', image: 'https://placehold.co/200x200/f472b6/FFFFFF?text=A4' },
];

export const ProfilePage = () => {
  return (
    <div className="bg-red-500 font-sans text-white">
      {/* Your existing layout components */}
      <SearchBar />
      <LeftSidebar />
      <FriendDeks />
      <MusicPlayer />

      {/* Main content area for the profile */}
      <main className="ml-24 mr-72 pt-20 px-8">
        
        {/* Profile Header Section */}
        <header className="flex items-center gap-8 py-12">
          <img 
            src="https://placehold.co/200x200/1f2937/FFFFFF?text=T" 
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover shadow-lg"
          />
          <div className="flex flex-col gap-2">
            <span className="font-bold text-sm uppercase">Profile</span>
            <h1 className="text-8xl font-black lowercase">tuffy</h1>
            <p className="text-neutral-300 text-sm">
              <span>5 Deks</span>
              <span className="mx-2">•</span>
              <span>1 Followers</span>
              <span className="mx-2">•</span>
              <span>20 Following</span>
            </p>
          </div>
        </header>

        {/* Top Artists Section */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Top artists this month</h2>
              <p className="text-sm text-neutral-300">Only visible to you</p>
            </div>
            <a href="#" className="text-sm font-bold text-neutral-300 hover:underline">
              Show all
            </a>
          </div>

          {/* Artist Grid */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
            {topArtists.map(artist => (
              <a key={artist.name} href="#" className="bg-neutral-800/30 p-4 rounded-lg hover:bg-neutral-800/60 transition-colors group">
                <img 
                  src={artist.image} 
                  alt={artist.name}
                  className="w-full aspect-circle rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform"
                />
                <p className="font-semibold mt-4 truncate">{artist.name}</p>
                <p className="text-sm text-neutral-400">Artist</p>
              </a>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};