//================================================================
// IMPORTS
//================================================================
import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { MusicPlayer } from '../components/MusicPlayer';
import { LeftSidebar } from '../components/LeftSideBar';
import { StatsSideBar } from '../components/StatsSideBar'; // Corrected component name
import { StatsCard } from '../components/StatsCard';       // Corrected component name
import { getTopArtists, getTopTracks, getAudioFeaturesForTracks } from '../lib/spotify'; // Spotify API functions

//================================================================
// PROFILE PAGE COMPONENT
//================================================================
export const ProfilePage = ({ onLogout }) => {
  //================================================================
  // STATE MANAGEMENT
  //================================================================
  const [topArtists, setTopArtists] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  //================================================================
  // DATA FETCHING & ANALYSIS
  //================================================================
  useEffect(() => {
    // This function runs once when the component loads
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch top artists and tracks in parallel for speed
        const [artistsResponse, tracksResponse] = await Promise.all([
          getTopArtists('medium_term', 4), // Get top 4 artists to display
          getTopTracks('medium_term', 50),  // Get top 50 tracks for accurate analysis
        ]);

        setTopArtists(artistsResponse.items);
        
        const tracks = tracksResponse.items;
        if (!tracks || tracks.length === 0) {
          setLoading(false);
          return;
        }

        // --- Perform Music Analysis ---
        const trackIds = tracks.map(track => track.id);
        const featuresResponse = await getAudioFeaturesForTracks(trackIds);
        const features = featuresResponse.audio_features.filter(f => f); // Filter out any null items

        const avgBpm = Math.round(features.reduce((sum, track) => sum + track.tempo, 0) / features.length);
        const avgEnergy = Math.round((features.reduce((sum, track) => sum + track.energy, 0) / features.length) * 100);
        const avgDanceability = Math.round((features.reduce((sum, track) => sum + track.danceability, 0) / features.length) * 100);

        // We need all top artists to calculate the top genre accurately
        const allArtistsResponse = await getTopArtists('medium_term', 50);
        const genreCounts = allArtistsResponse.items.flatMap(artist => artist.genres).reduce((acc, genre) => {
          acc[genre] = (acc[genre] || 0) + 1;
          return acc;
        }, {});

        const topGenre = Object.keys(genreCounts).length > 0
          ? Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b)
          : 'N/A';
        
        // Set all calculated stats in state
        setUserStats({ avgBpm, avgEnergy, avgDanceability, topGenre });

      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []); // The empty array ensures this effect runs only once

  //================================================================
  // RENDER METHOD
  //================================================================
  return (
    <div className="bg-red-500 font-sans text-white h-screen overflow-hidden">
      {/* Layout Components */}
      <SearchBar />
      <LeftSidebar />
      <StatsSideBar />
      <MusicPlayer />

      {/* Main Scrollable Content */}
      <main className="ml-24 mr-72 pt-20 px-8 h-full overflow-y-auto">
        
        {/* --- Profile Header Section --- */}
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

        {/* --- Music Analysis Section --- */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Music Analysis</h2>
          {loading ? (
            <p className="text-neutral-300">Analyzing your music taste...</p>
          ) : userStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard label="Avg. Tempo" value={userStats.avgBpm} unit="BPM" />
              <StatCard label="Avg. Energy" value={userStats.avgEnergy} unit="%" />
              <StatCard label="Avg. Danceability" value={userStats.avgDanceability} unit="%" />
              <StatCard label="Top Genre" value={<span className="capitalize">{userStats.topGenre}</span>} />
            </div>
          ) : (
            <p className="text-neutral-300">Not enough data to perform analysis.</p>
          )}
        </section>

        {/* --- Top Artists Section --- */}
        <section className="mt-8 pb-24">
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
              <a key={artist.id} href="#" className="bg-neutral-800/30 p-4 rounded-lg hover:bg-neutral-800/60 transition-colors group">
                <img 
                  src={artist.images[0]?.url} // Use image from API data
                  alt={artist.name}
                  className="w-full aspect-square rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform"
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