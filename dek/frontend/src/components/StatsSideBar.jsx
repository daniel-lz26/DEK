// src/components/StatsSidebar.jsx
import React, { useState, useEffect } from 'react';
// NEW: Import the getRecentlyPlayed function
import { getTopTracks, getAudioFeaturesForTracks, getRecentlyPlayed } from '../lib/spotify';

export const StatsSideBar = () => {
  //================================================================
  // STATE MANAGEMENT
  //================================================================
  const [averageBpm, setAverageBpm] = useState(null);
  // NEW: State for the new listening stats
  const [listeningStats, setListeningStats] = useState(null);
  const [loading, setLoading] = useState(true);

  //================================================================
  // DATA FETCHING & ANALYSIS
  //================================================================
  useEffect(() => {
    const calculateAllStats = async () => {
      try {
        // --- Fetch all data in parallel for efficiency ---
        const [topTracksData, recentTracksData] = await Promise.all([
          getTopTracks('medium_term', 50),
          getRecentlyPlayed(50) // Fetch last 50 tracks
        ]);

        // --- Calculate Average BPM ---
        const topTracks = topTracksData.items;
        if (topTracks && topTracks.length > 0) {
          const trackIds = topTracks.map(track => track.id);
          const audioFeaturesData = await getAudioFeaturesForTracks(trackIds);
          const featuresList = audioFeaturesData.audio_features.filter(f => f);
          
          if (featuresList.length > 0) {
            const totalBpm = featuresList.reduce((sum, track) => sum + track.tempo, 0);
            setAverageBpm(Math.round(totalBpm / featuresList.length));
          }
        }

        // --- Calculate Listening Stats ---
        const recentTracks = recentTracksData.items;
        if (recentTracks && recentTracks.length > 0) {
          // 1. Calculate total minutes played from the duration of each track
          const totalMilliseconds = recentTracks.reduce((sum, item) => sum + item.track.duration_ms, 0);
          const minutesPlayed = Math.round(totalMilliseconds / 60000); // Convert ms to minutes

          // 2. Count the number of tracks played
          const tracksPlayed = recentTracks.length;

          // 3. Set the new stats
          setListeningStats({ minutesPlayed, tracksPlayed });
        }
        
      } catch (error) {
        console.error("Failed to calculate stats:", error);
        setAverageBpm('N/A');
        setListeningStats({ minutesPlayed: 'N/A', tracksPlayed: 'N/A' });
      } finally {
        setLoading(false);
      }
    };

    calculateAllStats();
  }, []); // The empty array ensures this runs only once on mount

  //================================================================
  // RENDER METHOD
  //================================================================
  return (
    <aside className="fixed top-0 right-0 h-screen w-72 bg-neutral-900 pt-20 text-white p-4 flex flex-col gap-4 border-l border-neutral-800">
      
      {/* Header */}
      <div className="font-bold text-xl">
        Your Music Vibe
      </div>

      {/* BPM Stat Card */}
      <div className="bg-neutral-800 rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
        {loading ? (
          <p className="text-neutral-400">Calculating...</p>
        ) : (
          <>
            <p className="text-neutral-400 text-sm mb-1">Average Tempo</p>
            <p className="text-5xl font-bold text-red-400">{averageBpm}</p>
            <p className="text-lg text-white">BPM</p>
          </>
        )}
      </div>

      {/* Listening Stats Card */}
      <div className="bg-neutral-800 rounded-lg p-6 flex items-center justify-around text-center h-36">
        {loading ? (
          <p className="text-neutral-400">Loading Stats...</p>
        ) : (
          <>
            {/* Minutes Played Stat */}
            <div className="flex flex-col">
              <p className="text-neutral-400 text-sm">Mins Played</p>
              <p className="text-4xl font-bold text-red-400">{listeningStats?.minutesPlayed}</p>
              <p className="text-xs text-white">(Recently)</p>
            </div>
            {/* Divider */}
            <div className="w-px h-2/3 bg-neutral-700"></div>
            {/* Tracks Played Stat */}
            <div className="flex flex-col">
              <p className="text-neutral-400 text-sm">Tracks Played</p>
              <p className="text-4xl font-bold text-red-400">{listeningStats?.tracksPlayed}</p>
              <p className="text-xs text-white">(Recently)</p>
            </div>
          </>
        )}
      </div>

    </aside>
  );
};