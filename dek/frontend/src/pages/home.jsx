import React, { useState, useEffect } from 'react';
import { SearchBar } from "../components/SearchBar";
import { MusicPlayer } from "../components/MusicPlayer";
import { LeftSidebar } from "../components/LeftSideBar";
import { StatsSideBar } from "../components/StatsSideBar";
import { getTopArtists } from '../lib/spotify';

// The main component for the application's home page.
export const Home = ({ onLogout }) => {
  //================================================================
  // STATE HOOKS
  //================================================================
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //================================================================
  // UI CONFIGURATION
  //================================================================
  
  // The suit colors for the white playing cards.
  const suits = [
    { symbol: '♥', color: 'text-red-500' },
    { symbol: '♠', color: 'text-black' },
    { symbol: '♦', color: 'text-red-500' },
    { symbol: '♣', color: 'text-black' },
  ];

  //================================================================
  // DATA FETCHING
  //================================================================
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        setError(null);
        const artists = await getTopArtists('medium_term', 8);
        setTopArtists(artists.items);
      } catch (err) {
        console.error("Failed to fetch top artists:", err);
        setError("Couldn't load your top artists. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHomePageData();
  }, []);

  //================================================================
  // RENDER METHOD
  //================================================================
  return (
    <div className="bg-neutral-900 text-white font-sans h-screen overflow-hidden">
      <SearchBar onLogout={onLogout} />
      <LeftSidebar />
      <StatsSideBar />
      <MusicPlayer />

      {/* 1. Added bg-red-500 to the main content area */}
      <main className="ml-24 mr-72 h-full overflow-y-auto pt-20 bg-red-500">
        <div className="max-w-7xl mx-auto px-8 pb-24">
          
          {/* 2. Made the welcome message a separate white banner */}
          <div className="text-center bg-white text-neutral-800 p-6 rounded-lg mb-8 shadow-lg">
            <h2 className="text-4xl font-bold">DekMusic</h2>
            <p className="text-neutral-500 mt-2">
              Welcome to DekMusic — your place for amazing tunes!
            </p>
          </div>

          {/* Profiles Section */}

          <div className="profiles-container">
            <h2 className="profiles-header">Discover your top suites</h2>
            <div className="profile-section">
              {suitesData.map((profile) => (
                <div key={profile.id} className="profile-box">
                  <span className={`suit-symbol top-2 left-2 ${profile.color}`}>{profile.suit}</span>
                  <span className={`suit-symbol bottom-2 right-2 ${profile.color}`}>{profile.suit}</span>
                  <img src={profile.img} alt={profile.name} className="profile-image" />
                  <p className="profile-desc">{profile.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};