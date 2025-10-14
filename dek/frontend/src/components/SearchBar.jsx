import { Link } from "react-router-dom"; // 1. Import the Link component
import { HomeIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { isSpotifyAuthenticated, getCurrentUser } from '../lib/spotify';

// 2. Accept the 'onLogout' function as a prop
export const SearchBar = ({ onLogout }) => {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [spotifyUser, setSpotifyUser] = useState(null);

  useEffect(() => {
    const loadSpotifyData = async () => {
      if (isSpotifyAuthenticated()) {
        setIsSpotifyConnected(true);
        const user = await getCurrentUser();
        setSpotifyUser(user);
      }
    };

    loadSpotifyData();
  }, []);
  return (
    <nav className="fixed top-0 z-50 w-full bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left Section (empty for spacing) */}
        <div className="w-1/4"></div>

        {/* Center Section */}
        <div className="w-1/2 flex items-center justify-center gap-4">
          <div className="text-xl font-bold whitespace-nowrap">DekMusic</div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-sm px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          {/* Home Link */}
          <Link
            to="/"
            className="bg-neutral-800 hover:bg-neutral-700 rounded-full p-2 transition-colors"
            title="Home"
          >
            <HomeIcon className="h-6 w-6 text-white" />
          </Link>
        </div>

        {/* Right Section: Profile pic/Log Out button */}
        <div className="w-1/4 flex items-center justify-end gap-3">
          <img 
            src={isSpotifyConnected && spotifyUser?.images?.[0]?.url 
              ? spotifyUser.images[0].url 
              : "https://placehold.co/40x40/1f2937/FFFFFF?text=U"
            } 
            className="w-10 h-10 rounded-full object-cover"
          />
          <button
            onClick={onLogout}
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm py-2 px-4 rounded-full transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};
