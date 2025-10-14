import React, { useState, useEffect } from 'react';
import { LeftSidebar } from '../components/LeftSideBar';
import { getTopTracks, getTopArtists, getRecentlyPlayed } from '../lib/spotify';

// The main component for displaying user's Spotify statistics.
export const StatsPage = ({ onLogout, isSpotifyConnected }) => {
  //================================================================
  // STATE HOOKS
  //================================================================
  
  // State for storing data fetched from the Spotify API
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  
  // State for managing UI and data fetching logic
  const [timeRange, setTimeRange] = useState('medium_term'); // Controls the time period for stats (e.g., 4 weeks, 6 months)
  const [loading, setLoading] = useState(false);           // Manages the loading spinner visibility
  const [error, setError] = useState(null);                 // Holds any errors from the API calls

  //================================================================
  // DATA FETCHING
  //================================================================

  // This effect triggers the data fetching process whenever the Spotify
  // connection status or the selected timeRange changes.
  useEffect(() => {
    if (isSpotifyConnected) {
      fetchStats();
    }
  }, [isSpotifyConnected, timeRange]);

  // Asynchronous function to fetch all required stats from the Spotify API.
  const fetchStats = async () => {
    setLoading(true); // Show loading spinner
    setError(null);   // Clear any previous errors
    
    try {
      // Fetch top tracks, top artists, and recent tracks in parallel for efficiency.
      const [tracks, artists, recent] = await Promise.all([
        getTopTracks(timeRange, 10),
        getTopArtists(timeRange, 10),
        getRecentlyPlayed(10)
      ]);
      
      // Update state with the fetched data
      setTopTracks(tracks.items);
      setTopArtists(artists.items);
      setRecentTracks(recent.items);

    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message); // If an error occurs, store the message to show the user
    } finally {
      setLoading(false); // Hide loading spinner regardless of success or failure
    }
  };

  //================================================================
  // UI CONFIGURATION
  //================================================================

  // Configuration object for the time range filter buttons.
  const timeRangeOptions = [
    { value: 'short_term', label: 'Last 4 Weeks' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' }
  ];

  //================================================================
  // RENDER METHOD
  //================================================================

  return (
    <div className="bg-neutral-900 text-white min-h-screen flex">
      {/* Persistent sidebar for navigation */}
      <LeftSidebar />
      
      {/* Main content area */}
      <main className="ml-24 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Music Stats</h1>
            <div className="w-1/4 flex justify-end">
              <button
                onClick={onLogout}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm py-2 px-4 rounded-full transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
          
          {/* Conditional Rendering: Check if Spotify is connected */}
          {!isSpotifyConnected ? (
            // If not connected, show a prompt to the user.
            <div className="bg-neutral-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Connect Spotify to See Your Stats</h2>
              <p className="text-neutral-400">Login with Spotify to view your top tracks, artists, and listening history.</p>
            </div>
          ) : (
            // If connected, show the stats content.
            <>
              {/* Time Range Selector Buttons */}
              <div className="mb-6">
                <div className="flex gap-2">
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeRange(option.value)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        timeRange === option.value
                          ? 'bg-red-500 text-white'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Rendering for Loading and Error states */}
              {loading ? (
                // Show a loading spinner while fetching data.
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : error ? (
                // Show an error message if the API call fails.
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400">
                  Error: {error}
                </div>
              ) : (
                // If not loading and no error, display the data grid.
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Top Tracks List */}
                  <div className="bg-neutral-800/50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Top Tracks</h2>
                    <div className="space-y-3">
                      {topTracks.map((track, index) => (
                        // Changed background to red and adjusted text colors
                        <div key={track.id} className="flex items-center gap-4 bg-red-500/80 border-2 border-white p-3 rounded-lg shadow-lg transition-transform hover:scale-[1.02]">
                          <span className="text-red-200 font-mono text-sm w-6 text-center">{index + 1}</span>
                          <img src={track.album.images[2]?.url} alt={track.name} className="w-12 h-12 rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{track.name}</p>
                            <p className="text-sm text-red-200 truncate">
                              {track.artists.map(artist => artist.name).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Artists List */}
                  <div className="bg-neutral-800/50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Top Artists</h2>
                    <div className="space-y-3">
                      {topArtists.map((artist, index) => (
                        // Changed background to red and adjusted text colors
                        <div key={artist.id} className="flex items-center gap-4 bg-red-500/80 border-2 border-white p-3 rounded-lg shadow-lg transition-transform hover:scale-[1.02]">
                          <span className="text-red-200 font-mono text-sm w-6 text-center">{index + 1}</span>
                          <img src={artist.images[2]?.url} alt={artist.name} className="w-12 h-12 rounded-full" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{artist.name}</p>
                            <p className="text-sm text-red-200 capitalize truncate">
                              {artist.genres.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};