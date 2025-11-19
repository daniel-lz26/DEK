//================================================================
// IMPORTS
//================================================================
import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { LeftSidebar } from '../components/LeftSideBar';
import { StatsSideBar } from '../components/StatsSideBar';
import { FriendsSection } from '../components/FriendsSection';
import { ListeningHistory } from '../components/ListeningHistory';
import { GenreExplorer } from '../components/GenreExplorer';
import { MusicTasteEvolution } from '../components/MusicTasteEvolution';
import { getTopArtists, getCurrentUser } from '../lib/spotify';

//================================================================
// PROFILE PAGE COMPONENT
//================================================================
export const ProfilePage = ({ onLogout }) => {
  //================================================================
  // STATE MANAGEMENT
  //================================================================
  const [topArtists, setTopArtists] = useState([]);
  const [allTopArtists, setAllTopArtists] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history'); // Default to Listening History
  const [showAllArtists, setShowAllArtists] = useState(false);

  //================================================================
  // DATA FETCHING
  //================================================================
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        console.log('🔄 Starting profile data fetch...');

        // Fetch user profile data
        const profileResponse = await getCurrentUser();
        console.log('✅ User profile:', profileResponse);
        setUserProfile(profileResponse);

        // Fetch top artists - get 8 for "show all" functionality
        try {
          const artistsResponse = await getTopArtists('medium_term', 8);
          console.log('✅ Top artists:', artistsResponse.items.length);
          setAllTopArtists(artistsResponse.items);
          setTopArtists(artistsResponse.items.slice(0, 4));
        } catch (artistError) {
          console.warn('⚠️ Could not fetch top artists:', artistError.message);
          setTopArtists([]);
          setAllTopArtists([]);
        }

      } catch (error) {
        console.error("❌ Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Toggle between showing 4 artists and all 8 artists
  const toggleShowAllArtists = () => {
    if (showAllArtists) {
      setTopArtists(allTopArtists.slice(0, 4));
      setShowAllArtists(false);
    } else {
      setTopArtists(allTopArtists);
      setShowAllArtists(true);
    }
  };

  //================================================================
  // RENDER METHOD
  //================================================================
  return (
    <div className="bg-red-500 font-sans text-white h-screen overflow-hidden">
      {/* Layout Components */}
      <SearchBar />
      <LeftSidebar />
      <StatsSideBar />

      {/* Main Scrollable Content */}
      <main className="ml-24 mr-80 pt-20 px-8 h-full overflow-y-auto">
        
        {/* --- Profile Header Section - Left Aligned --- */}
        <header className="flex items-center gap-8 py-12">
          <img 
            src={userProfile?.images?.[0]?.url || "https://placehold.co/200x200/1f2937/FFFFFF?text=E"} 
            alt={userProfile?.display_name || "Profile"}
            className="w-48 h-48 rounded-full object-cover shadow-lg"
          />
          <div className="flex flex-col gap-2">
            <span className="font-bold text-sm uppercase">Profile</span>
            <h1 className="text-8xl font-black lowercase">
              {userProfile?.display_name || "esther"}
            </h1>
            <p className="text-neutral-200 text-sm">
              <span>{userProfile?.followers?.total || 0} Followers</span>
              <span className="mx-2">•</span>
              <span>Public Playlists: {userProfile?.public_playlists || "N/A"}</span>
            </p>
          </div>
        </header>

        {/* --- Tab Navigation --- */}
        <div className="flex gap-6 mb-6 border-b border-neutral-700/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'history' 
                ? 'text-white border-b-2 border-white' 
                : 'text-neutral-200 hover:text-white'
            }`}
          >
            Listening History
          </button>
          <button
            onClick={() => setActiveTab('genres')}
            className={`pb-3 px-1 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'genres' 
                ? 'text-white border-b-2 border-white' 
                : 'text-neutral-200 hover:text-white'
            }`}
          >
            Genre Explorer
          </button>
          <button
            onClick={() => setActiveTab('evolution')}
            className={`pb-3 px-1 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'evolution' 
                ? 'text-white border-b-2 border-white' 
                : 'text-neutral-200 hover:text-white'
            }`}
          >
            Music Evolution
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`pb-3 px-1 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'friends' 
                ? 'text-white border-b-2 border-white' 
                : 'text-neutral-200 hover:text-white'
            }`}
          >
            Friends
          </button>
        </div>

        {/* --- Content Based on Active Tab --- */}
        {activeTab === 'history' && <ListeningHistory />}
        {activeTab === 'genres' && <GenreExplorer />}
        {activeTab === 'evolution' && <MusicTasteEvolution />}
        {activeTab === 'friends' && <FriendsSection />}

        {/* --- Top Artists Section (Always visible at bottom) --- */}
        {allTopArtists.length > 0 && (
          <section className="mt-8 pb-24">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">Top artists this month</h2>
                <p className="text-sm text-neutral-300">Only visible to you</p>
              </div>
              <button 
                onClick={toggleShowAllArtists}
                className="text-sm font-bold text-neutral-300 hover:underline transition-colors"
              >
                {showAllArtists ? 'Show less' : 'Show all'}
              </button>
            </div>

            {/* Artist Grid - Responsive layout */}
            <div className={`grid gap-6 ${
              showAllArtists 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-2 md:grid-cols-4'
            }`}>
              {topArtists.map(artist => (
                <div 
                  key={artist.id} 
                  className="bg-neutral-800/30 p-4 rounded-lg hover:bg-neutral-800/60 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img 
                      src={artist.images[0]?.url || "https://placehold.co/300x300/333/FFFFFF?text=Artist"} 
                      alt={artist.name}
                      className="w-full aspect-square object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Popularity indicator */}
                    <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 text-xs">
                      #{allTopArtists.findIndex(a => a.id === artist.id) + 1}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold truncate text-white">{artist.name}</p>
                    <p className="text-sm text-neutral-200 mt-1">Artist</p>
                    {artist.genres && artist.genres.length > 0 && (
                      <p className="text-xs text-neutral-300 mt-1 truncate">
                        {artist.genres[0]}
                      </p>
                    )}
                    {/* Followers count */}
                    <p className="text-xs text-neutral-300 mt-2">
                      {artist.followers?.total?.toLocaleString() || 0} followers
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Show message when all artists are displayed */}
            {showAllArtists && (
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-400">
                  Showing all {allTopArtists.length} top artists
                </p>
              </div>
            )}
          </section>
        )}

        {/* Message when no artists are available */}
        {allTopArtists.length === 0 && !loading && (
          <section className="mt-8 pb-24">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">Top artists this month</h2>
                <p className="text-sm text-neutral-300">Only visible to you</p>
              </div>
            </div>
            <div className="bg-neutral-800/30 rounded-lg p-8 text-center">
              <p className="text-neutral-300">No top artists data available</p>
              <p className="text-neutral-400 text-sm mt-2">
                Listen to more music to see your top artists
              </p>
            </div>
          </section>
        )}

        {/* Spotify Attribution Footer */}
        <div className="mt-12 pb-8 text-center">
          <p className="text-xs text-neutral-500">
            Data provided by Spotify • This app is for educational purposes
          </p>
        </div>
      </main>
    </div>
  );
};