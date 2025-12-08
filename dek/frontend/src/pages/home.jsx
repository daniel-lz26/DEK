import React, { useState, useEffect } from 'react';
import { SearchBar } from "../components/SearchBar";
import { LeftSidebar } from "../components/LeftSideBar";
import { StatsSideBar } from "../components/StatsSideBar";
import { getTopArtists, getRecentlyPlayed } from '../lib/spotify';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

// The main component for the application's home page.
export const Home = ({ onLogout }) => {
  //================================================================
  // STATE HOOKS
  //================================================================
  const [topArtists, setTopArtists] = useState([]);
  const [artistRecentTracks, setArtistRecentTracks] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
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
  // DATA FETCHING & PROCESSING
  //================================================================
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Step 1: Get top 8 artists
        const artists = await getTopArtists('medium_term', 8);
        setTopArtists(artists.items);

        // Step 2: Get user's recently played tracks
        const recentlyPlayed = await getRecentlyPlayed(50);
        
        // Step 3: Organize recent tracks by artist
        const tracksByArtist = {};
        
        // Initialize empty arrays for each artist
        artists.items.forEach(artist => {
          tracksByArtist[artist.id] = [];
        });

        // Group recently played tracks by artist (most recent first)
        recentlyPlayed.items.forEach(item => {
          const track = item.track;
          track.artists.forEach(artist => {
            if (tracksByArtist[artist.id]) {
              // Only add if not already in the array (to avoid duplicates)
              if (!tracksByArtist[artist.id].some(t => t.id === track.id)) {
                tracksByArtist[artist.id].push(track);
              }
            }
          });
        });

        // Take the 5 most recent unique tracks for each artist
        const finalArtistTracks = {};
        artists.items.forEach(artist => {
          finalArtistTracks[artist.id] = tracksByArtist[artist.id].slice(0, 5);
        });

        setArtistRecentTracks(finalArtistTracks);
        
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Couldn't load your music data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHomePageData();
  }, []);

  //================================================================
  // CARD FLIP HANDLERS
  //================================================================
  const handleCardClick = (artistId) => {
    setFlippedCards(prev => ({
      ...prev,
      [artistId]: !prev[artistId]
    }));
  };

  const handleBackClick = (artistId, e) => {
    e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [artistId]: false
    }));
  };

  //================================================================
  // RENDER METHOD
  //================================================================
  return (
    <div className="bg-neutral-900 text-white font-sans h-screen overflow-hidden">
      <SearchBar onLogout={onLogout} />
      <LeftSidebar />
      <StatsSideBar />

      {/* Main content area with red theme background */}
      <main className="ml-24 pr-80 h-full overflow-y-auto pt-20 bg-red-500">
        <div className="w-full max-w-6xl mx-auto px-8 pb-24">
          
          {/* Welcome message banner */}
          <div className="text-center bg-white text-neutral-800 p-6 rounded-lg mb-8 shadow-lg border-l-4 border-red-600">
            <h2 className="text-4xl font-bold">DekMusic</h2>
            <p className="text-neutral-500 mt-2">
              Welcome to DekMusic — your place for amazing tunes!
            </p>
          </div>

          {/* Top artists section wrapped in darker red container */}
          <div className="bg-red-800 rounded-xl p-8 shadow-lg">
            <h2 className="profiles-header text-white text-2xl font-bold mb-8 text-center">
              Discover your top suites
            </h2>
            
            {loading ? (
              <LoadingSkeleton type="playing-card" count={8} />
            ) : error ? (
              <p className="text-center text-white bg-red-700 p-4 rounded-lg">{error}</p>
            ) : (
              <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-6 w-fit">
                  {topArtists.map((artist, index) => {
                    const assignedSuit = suits[index % suits.length];
                    const recentTracks = artistRecentTracks[artist.id] || [];
                    const isFlipped = flippedCards[artist.id];

                    return (
                      <div 
                        key={artist.id} 
                        className="relative w-48 h-64 cursor-pointer"
                        onClick={() => handleCardClick(artist.id)}
                      >
                        {/* Card Container with Flip Animation */}
                        <div className={`absolute inset-0 transition-all duration-500 transform preserve-3d ${
                          isFlipped ? 'rotate-y-180' : ''
                        }`}>
                          
                          {/* FRONT OF CARD - Artist View */}
                          <div className="absolute inset-0 backface-hidden">
                            <div className="profile-box bg-white rounded-lg shadow-md p-4 relative h-full w-full border-t-4 border-red-600 hover:scale-105 transition-transform duration-200">
                              <span className={`suit-symbol absolute top-2 left-2 text-xl ${assignedSuit.color}`}>
                                {assignedSuit.symbol}
                              </span>
                              <span className={`suit-symbol absolute bottom-2 right-2 text-xl ${assignedSuit.color}`}>
                                {assignedSuit.symbol}
                              </span>
                              <img 
                                src={artist.images[0]?.url} 
                                alt={artist.name} 
                                className="profile-image w-24 h-24 rounded-full mx-auto mb-3 object-cover" 
                              />
                              <p className="profile-desc text-neutral-800 text-center font-semibold">
                                {artist.name}
                              </p>
                            </div>
                          </div>

                          {/* BACK OF CARD - Recently Played Tracks */}
                          <div className="absolute inset-0 backface-hidden rotate-y-180">
                            <div className="bg-white rounded-lg shadow-md p-4 relative h-full w-full border-t-4 border-red-600 overflow-hidden">
                              {/* Back Button */}
                              <button 
                                onClick={(e) => handleBackClick(artist.id, e)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                ×
                              </button>
                              
                              {/* Artist Header on Back */}
                              <div className="text-center mb-3">
                                <h3 className="text-neutral-800 font-bold text-sm truncate">
                                  {artist.name}
                                </h3>
                                <p className="text-red-500 text-xs">Recently Played</p>
                              </div>

                              {/* Recently Played Tracks List */}
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {recentTracks.map((track, trackIndex) => (
                                  <div 
                                    key={track.id} 
                                    className="flex items-center gap-2 p-1 rounded hover:bg-red-50 transition-colors"
                                  >
                                    <span className="text-red-500 font-bold text-xs w-4">
                                      {trackIndex + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-neutral-800 font-semibold text-xs truncate">
                                        {track.name}
                                      </p>
                                      <p className="text-neutral-600 text-xs truncate">
                                        {Math.floor(track.duration_ms / 60000)}:
                                        {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {recentTracks.length === 0 && (
                                <p className="text-center text-neutral-500 text-xs py-4">
                                  No recent plays
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add CSS for flip animations */}
      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};