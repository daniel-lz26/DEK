// src/components/StatsSidebar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getAudioFeaturesForTracks, getRecentlyPlayed, getCurrentlyPlaying, getAccessToken, isSpotifyAuthenticated, redirectToSpotifyAuth, logoutSpotify } from '../lib/spotify';

// Simple pie chart component
const PieChart = ({ percentage, color = "#ef4444", size = 80 }) => {
  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm">{percentage}%</span>
      </div>
    </div>
  );
};

// Genre bubble chart component
const GenreBubbles = ({ genres }) => {
  if (!genres || genres.length === 0) return null;
  
  const sizeMap = {
    0: 'w-16 h-16 text-lg',
    1: 'w-14 h-14 text-base',
    2: 'w-12 h-12 text-sm',
    3: 'w-10 h-10 text-xs',
    4: 'w-8 h-8 text-xs'
  };

  const colorMap = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {genres.slice(0, 5).map((genre, index) => (
        <div
          key={genre}
          className={`${sizeMap[index] || 'w-8 h-8'} ${colorMap[index % colorMap.length]} rounded-full flex items-center justify-center text-white font-bold`}
          title={genre}
        >
          {genre.charAt(0).toUpperCase()}
        </div>
      ))}
    </div>
  );
};

export const StatsSideBar = () => {
  //================================================================
  //  STATE MANAGEMENT
  //================================================================
  const [currentStat, setCurrentStat] = useState(null);
  const [listeningStats, setListeningStats] = useState(null);
  const [musicStats, setMusicStats] = useState(null);
  const [topGenres, setTopGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statType, setStatType] = useState('energy');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  //================================================================
  //  STAT CALCULATION FUNCTIONS
  //================================================================
  const calculateEnergyLevel = (track) => {
    const duration = track.duration_ms / 60000;
    const popularity = track.popularity || 50;
    
    let energy = 50;
    if (duration < 3.5) energy += 20;
    if (duration > 5) energy -= 15;
    if (popularity > 70) energy += 15;
    if (popularity < 30) energy -= 10;
    
    return Math.max(10, Math.min(100, energy));
  };

  const getEnergyDescription = (energy) => {
    if (energy >= 80) return 'High Energy 🔥';
    if (energy >= 60) return 'Energetic ⚡';
    if (energy >= 40) return 'Balanced ⚖️';
    if (energy >= 20) return 'Chill 😎';
    return 'Relaxing 🌊';
  };

  const calculateDanceScore = (track) => {
    const duration = track.duration_ms / 60000;
    const popularity = track.popularity || 50;
    
    let score = 5;
    if (duration >= 3 && duration <= 4.5) score += 2;
    if (popularity > 60) score += 2;
    if (track.explicit) score += 1;
    
    return Math.max(1, Math.min(10, score));
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Morning 🌅';
    if (hour >= 12 && hour < 17) return 'Afternoon ☀️';
    if (hour >= 17 && hour < 22) return 'Evening 🌆';
    return 'Night 🌙';
  };

  const getMusicVibe = (track) => {
    const genres = ['Chill', 'Vibey', 'Upbeat', 'Melodic', 'Groovy', 'Hyped', 'Smooth'];
    return genres[Math.floor(Math.random() * genres.length)];
  };

  const getMoodType = () => {
    const moods = ['Happy', 'Chill', 'Energetic', 'Focused', 'Relaxed', 'Hyped', 'Melancholy'];
    return moods[Math.floor(Math.random() * moods.length)];
  };

  const calculateMusicStats = (track) => {
    const duration = track.duration_ms / 60000;
    const popularity = track.popularity || 50;
    
    // Calculate various stats as percentages
    const catchiness = Math.min(100, Math.max(20, popularity));
    const replayValue = track.explicit ? 75 : 65;
    const trendScore = popularity > 70 ? 85 : popularity > 50 ? 65 : 45;
    const vibeConsistency = 60 + Math.random() * 30;

    return {
      catchiness: Math.round(catchiness),
      replayValue: Math.round(replayValue),
      trendScore: Math.round(trendScore),
      vibeConsistency: Math.round(vibeConsistency),
      duration: duration.toFixed(1)
    };
  };

  const extractGenresFromTrack = (track) => {
    // Mock genres based on track characteristics
    const allGenres = {
      highEnergy: ['EDM', 'Hip Hop', 'Rock', 'Pop', 'Dance'],
      mediumEnergy: ['R&B', 'Indie', 'Alternative', 'Funk', 'Soul'],
      lowEnergy: ['Jazz', 'Lo-fi', 'Ambient', 'Classical', 'Acoustic']
    };

    const energy = calculateEnergyLevel(track);
    if (energy >= 70) return allGenres.highEnergy;
    if (energy >= 40) return allGenres.mediumEnergy;
    return allGenres.lowEnergy;
  };

  const calculateListeningStats = (currentPlayback, recentTracks) => {
    if (!currentPlayback || !currentPlayback.item) {
      return { 
        minutesPlayed: 0, 
        tracksPlayed: 0, 
        sessionDuration: '0m',
        currentProgress: '0:00',
        isPlaying: false
      };
    }

    const track = currentPlayback.item;
    
    // Calculate progress in current track
    const progressMs = currentPlayback.progress_ms || 0;
    const progressMinutes = Math.floor(progressMs / 60000);
    const progressSeconds = Math.floor((progressMs % 60000) / 1000);
    const currentProgress = `${progressMinutes}:${progressSeconds.toString().padStart(2, '0')}`;

    // Calculate session stats from recent tracks in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSessionTracks = recentTracks?.items?.filter(item => 
      new Date(item.played_at) > oneHourAgo
    ) || [];

    const uniqueTracks = new Set();
    let totalMinutes = 0;

    recentSessionTracks.forEach(item => {
      uniqueTracks.add(item.track.id);
      totalMinutes += item.track.duration_ms / 60000;
    });

    // Add current track if it's not in recent history
    if (!uniqueTracks.has(track.id)) {
      uniqueTracks.add(track.id);
      totalMinutes += track.duration_ms / 60000;
    }

    return { 
      minutesPlayed: Math.round(totalMinutes),
      tracksPlayed: uniqueTracks.size,
      sessionDuration: '1h', // Last hour session
      currentProgress,
      isPlaying: currentPlayback.is_playing
    };
  };

  //================================================================
  //  DATA FETCHING & ANALYSIS
  //================================================================
  const calculateAllStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isSpotifyAuthenticated()) {
        throw new Error('Not authenticated with Spotify. Please log in again.');
      }

      // Get current playback state (real-time)
      const currentPlayback = await getCurrentlyPlaying();
      
      // Get recent tracks for session context
      const recentTracksData = await getRecentlyPlayed(10);

      if (!currentPlayback || !currentPlayback.item) {
        setCurrentStat({ type: 'energy', value: 'N/A', label: 'No Active Track', sublabel: 'PLAY MUSIC' });
        setListeningStats({ 
          minutesPlayed: 0, 
          tracksPlayed: 0, 
          sessionDuration: '0m',
          currentProgress: '0:00',
          isPlaying: false
        });
        setMusicStats({ catchiness: 0, replayValue: 0, trendScore: 0, vibeConsistency: 0, duration: '0.0' });
        setTopGenres([]);
        setCurrentTrack(null);
        setIsPlaying(false);
        return;
      }

      const track = currentPlayback.item;
      setCurrentTrack(track);
      setIsPlaying(currentPlayback.is_playing);

      // Calculate REAL-TIME listening stats
      const listeningStatsData = calculateListeningStats(currentPlayback, recentTracksData);
      setListeningStats(listeningStatsData);

      // Calculate music stats for the CURRENTLY PLAYING track
      const musicStatsData = calculateMusicStats(track);
      setMusicStats(musicStatsData);

      // Extract genres from current track
      const genres = extractGenresFromTrack(track);
      setTopGenres(genres);

      // Calculate alternative stat based on current statType
      let stat;
      switch (statType) {
        case 'energy':
          const energy = calculateEnergyLevel(track);
          stat = {
            type: 'energy',
            value: `${energy}%`,
            label: 'Track Energy',
            sublabel: 'VIBE',
            description: getEnergyDescription(energy)
          };
          break;
        
        case 'dance':
          const danceScore = calculateDanceScore(track);
          stat = {
            type: 'dance',
            value: `${danceScore}/10`,
            label: 'Danceability',
            sublabel: 'GROOVE'
          };
          break;
        
        case 'mood':
          stat = {
            type: 'mood',
            value: getMoodType(),
            label: 'Track Mood',
            sublabel: 'FEELING'
          };
          break;
        
        case 'time':
          stat = {
            type: 'time',
            value: getTimeOfDay(),
            label: 'Listening Time',
            sublabel: 'RHYTHM'
          };
          break;
        
        case 'vibe':
        default:
          stat = {
            type: 'vibe',
            value: getMusicVibe(track),
            label: 'Current Vibe',
            sublabel: 'MOOD'
          };
          break;
      }
      
      setCurrentStat(stat);
      
    } catch (error) {
      console.error("Failed to calculate stats:", error);
      setError(error.message);
      setCurrentStat({ type: 'error', value: 'N/A', label: 'No Data', sublabel: 'REFRESH' });
      setListeningStats({ 
        minutesPlayed: 'N/A', 
        tracksPlayed: 'N/A', 
        sessionDuration: 'N/A',
        currentProgress: '0:00',
        isPlaying: false
      });
      setMusicStats({ catchiness: 0, replayValue: 0, trendScore: 0, vibeConsistency: 0, duration: '0.0' });
      setTopGenres([]);
      setCurrentTrack(null);
      setIsPlaying(false);
    } finally {
      setLoading(false);
    }
  }, [statType]);

  // More frequent updates for real-time tracking
  useEffect(() => {
    calculateAllStats();
    
    // Update every 10 seconds for real-time progress
    const interval = setInterval(() => {
      calculateAllStats();
    }, 10000); // 10 seconds for real-time updates

    return () => clearInterval(interval);
  }, [calculateAllStats]);

  const handleReauthenticate = () => {
    logoutSpotify();
    redirectToSpotifyAuth();
  };

  const cycleStatType = () => {
    const types = ['energy', 'dance', 'mood', 'time', 'vibe'];
    const currentIndex = types.indexOf(statType);
    const nextIndex = (currentIndex + 1) % types.length;
    setStatType(types[nextIndex]);
  };

  //================================================================
  //  RENDER METHOD
  //================================================================
  return (
    <aside className="fixed top-0 right-0 h-screen w-80 bg-neutral-900 pt-20 text-white p-4 flex flex-col gap-4 border-l border-neutral-800 overflow-y-auto">
      
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div className="font-bold text-xl">
          Your Music Vibe
        </div>
        <button 
          onClick={calculateAllStats} 
          disabled={loading}
          className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-1 px-3 rounded-full transition-colors"
          title="Refresh Stats"
        >
          {loading ? '...' : 'Refresh'}
        </button>
      </div>
      <p className="text-neutral-400 text-sm font-bold mb-4 text-center">If you're getting an error, try playing a song or re-authenticating.</p>

      {/* Now Playing Indicator */}
      {isPlaying && currentTrack && (
        <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-300 font-semibold">Now Playing</p>
          </div>
          <p className="text-green-200 text-xs truncate mt-1">
            {currentTrack.name} • {currentTrack.artists[0]?.name}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-sm">
          <p className="font-bold text-red-300">Error:</p>
          <p className="text-red-200 mb-3">{error}</p>
          {(error.includes('403') || error.includes('Permission denied') || error.includes('Authentication failed')) && (
            <button
              onClick={handleReauthenticate}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded transition-colors w-full"
            >
              Re-authenticate with Spotify
            </button>
          )}
        </div>
      )}

      {/* Main Stat Card */}
      <div 
        className="bg-neutral-800 rounded-lg p-6 flex flex-col items-center justify-center text-center h-48 cursor-pointer hover:bg-neutral-750 transition-colors"
        onClick={cycleStatType}
        title="Click to cycle through different stats"
      >
        {loading ? (
          <p className="text-neutral-400">Calculating...</p>
        ) : error ? (
          <p className="text-red-400">Error loading data</p>
        ) : currentStat ? (
          <>
            <p className="text-neutral-400 text-sm mb-1">{currentStat.label}</p>
            <p className="text-4xl font-bold text-red-400">{currentStat.value}</p>
            <p className="text-lg text-white">{currentStat.sublabel}</p>
            {currentStat.description && (
              <p className="text-xs text-neutral-400 mt-2">{currentStat.description}</p>
            )}
            <p className="text-xs text-neutral-500 mt-2">Click to cycle stats</p>
          </>
        ) : (
          <p className="text-neutral-400">No active track</p>
        )}
      </div>

      {/* Music Analytics Card */}
      <div className="bg-neutral-800 rounded-lg p-6">
        <h3 className="text-neutral-400 text-sm font-bold mb-4 text-center">CURRENT TRACK ANALYTICS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <PieChart percentage={musicStats?.catchiness || 0} color="#ef4444" />
            <p className="text-xs text-neutral-400 mt-2">Catchiness</p>
          </div>
          <div className="flex flex-col items-center">
            <PieChart percentage={musicStats?.replayValue || 0} color="#3b82f6" />
            <p className="text-xs text-neutral-400 mt-2">Replay Value</p>
          </div>
          <div className="flex flex-col items-center">
            <PieChart percentage={musicStats?.trendScore || 0} color="#10b981" />
            <p className="text-xs text-neutral-400 mt-2">Trend Score</p>
          </div>
          <div className="flex flex-col items-center">
            <PieChart percentage={musicStats?.vibeConsistency || 0} color="#8b5cf6" />
            <p className="text-xs text-neutral-400 mt-2">Vibe Consistency</p>
          </div>
        </div>
      </div>

      {/* Genre Profile Card */}
      <div className="bg-neutral-800 rounded-lg p-6">
        <h3 className="text-neutral-400 text-sm font-bold mb-4 text-center">CURRENT VIBE</h3>
        <GenreBubbles genres={topGenres} />
        <div className="mt-4 text-center">
          <p className="text-xs text-neutral-400">
            Based on current track
          </p>
        </div>
      </div>

      {/* Real-time Listening Stats Card */}
      <div className="bg-neutral-800 rounded-lg p-6">
        <h3 className="text-neutral-400 text-sm font-bold mb-4 text-center">CURRENT SESSION</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-neutral-750 rounded-lg">
            <p className="text-2xl font-bold text-red-400">{listeningStats?.minutesPlayed || 0}</p>
            <p className="text-xs text-neutral-400">Last Hour</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-neutral-750 rounded-lg">
            <p className="text-2xl font-bold text-red-400">{listeningStats?.tracksPlayed || 0}</p>
            <p className="text-xs text-neutral-400">Unique Tracks</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-neutral-750 rounded-lg">
            <p className="text-2xl font-bold text-red-400">{musicStats?.duration || '0.0'}</p>
            <p className="text-xs text-neutral-400">Track Length</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-neutral-750 rounded-lg">
            <p className="text-2xl font-bold text-red-400">
              {listeningStats?.currentProgress || '0:00'}
            </p>
            <p className="text-xs text-neutral-400">Progress</p>
          </div>
        </div>
        {isPlaying && (
          <div className="mt-3 text-center">
            <p className="text-xs text-green-400">🎵 Live updates every 10 seconds</p>
          </div>
        )}
      </div>

    </aside>
  );
};