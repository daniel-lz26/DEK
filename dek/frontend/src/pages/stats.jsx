import React, { useState, useEffect } from 'react';
import { LeftSidebar } from '../components/LeftSideBar';
import { getTopTracks, getTopArtists, getRecentlyPlayed } from '../lib/spotify';

export const StatsPage = ({ onLogout, isSpotifyConnected }) => {
  // fetched Spotify data
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  
  // UI Time management 
  const [timeRange, setTimeRange] = useState('medium_term'); // Time period for stats
  const [loading, setLoading] = useState(false);           // Loading state
  const [error, setError] = useState(null);                 // Error state

  // fetch spotify data stats
  useEffect(() => {
    if (isSpotifyConnected) {
      fetchStats();
    }
  }, [isSpotifyConnected, timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    // get top data from the time period 
    try {
      const [tracks, artists, recent] = await Promise.all([
        getTopTracks(timeRange, 10),
        getTopArtists(timeRange, 10),
        getRecentlyPlayed(10)
      ]);
      
      setTopTracks(tracks.items);
      setTopArtists(artists.items);
      setRecentTracks(recent.items);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message); // Show error message to user if API calls fail
    } finally {
      setLoading(false);
    }
  };

  //Time range filtering 
  const timeRangeOptions = [
    { value: 'short_term', label: 'Last 4 Weeks' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' }
  ];

  return (
    <div className="bg-neutral-900 text-white min-h-screen flex">
      <LeftSidebar />
      
      <main className="ml-24 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
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
          {/* is spotify connected? */ }
          {!isSpotifyConnected ? (
            <div className="bg-white rounded-lg p-8 text-center text-black">
              <h2 className="text-2xl font-bold mb-4">Connect Spotify to See Your Stats</h2>
              <p className="text-gray-600">Login with Spotify to view your top tracks, artists, and listening history.</p>
            </div>
          ) : (
            <>
              { /* Time Range Selector */ }
              <div className="mb-6">
                <div className="flex gap-2">
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeRange(option.value)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        timeRange === option.value
                          ? 'bg-green-500 text-white'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* API loading state */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
                //* API error state */
              ) : error ? (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-400">
                  Error: {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Tracks */}
                  <div className="bg-white rounded-lg p-6 text-black">
                    <h2 className="text-2xl font-bold mb-4">Top Tracks</h2>
                    <div className="space-y-3">
                      {topTracks.map((track, index) => (
                        <div key={track.id} className="flex items-center gap-4">
                          {/* Track ranking number */}
                          <span className="text-gray-500 font-mono text-sm w-6">
                            {index + 1}
                          </span>
                          <img 
                            src={track.album.images[2]?.url} 
                            alt={track.name}
                            className="w-12 h-12 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{track.name}</p>
                            <p className="text-sm text-gray-600 truncate">
                              {track.artists.map(artist => artist.name).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Artists */}
                  <div className="bg-white rounded-lg p-6 text-black">
                    <h2 className="text-2xl font-bold mb-4">Top Artists</h2>
                    <div className="space-y-3">
                      {topArtists.map((artist, index) => (
                        <div key={artist.id} className="flex items-center gap-4">
                          <span className="text-gray-500 font-mono text-sm w-6">
                            {index + 1}
                          </span>
                          <img 
                            src={artist.images[2]?.url} 
                            alt={artist.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{artist.name}</p>
                            <p className="text-sm text-gray-600 capitalize">
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
