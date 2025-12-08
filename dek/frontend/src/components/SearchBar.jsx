// import { Link } from "react-router-dom"; // 1. Import the Link component
// import { HomeIcon } from "@heroicons/react/24/solid";
// import { useState, useEffect } from "react";
// import { isSpotifyAuthenticated, getCurrentUser } from '../lib/spotify';

// // 2. Accept the 'onLogout' function as a prop
// export const SearchBar = ({ onLogout }) => {
//   const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
//   const [spotifyUser, setSpotifyUser] = useState(null);

//   useEffect(() => {
//     const loadSpotifyData = async () => {
//       if (isSpotifyAuthenticated()) {
//         setIsSpotifyConnected(true);
//         const user = await getCurrentUser();
//         setSpotifyUser(user);
//       }
//     };

//     loadSpotifyData();
//   }, []);
//   return (
//     <nav className="fixed top-0 z-50 w-full bg-black text-white shadow-md">
//       <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//         {/* Left Section (empty for spacing) */}
//         <div className="w-1/4"></div>

//         {/* Center Section */}
//         <div className="w-1/2 flex items-center justify-center gap-4">
//           <div className="text-xl font-bold whitespace-nowrap">DekMusic</div>
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full max-w-sm px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
//           />

//           {/* Home Link */}
//           <Link
//             to="/"
//             className="bg-neutral-800 hover:bg-neutral-700 rounded-full p-2 transition-colors"
//             title="Home"
//           >
//             <HomeIcon className="h-6 w-6 text-white" />
//           </Link>
//         </div>

//         {/* Right Section: Profile pic/Log Out button */}
//         <div className="w-1/4 flex items-center justify-end gap-3">
//           <img 
//             src={isSpotifyConnected && spotifyUser?.images?.[0]?.url 
//               ? spotifyUser.images[0].url 
//               : "https://placehold.co/40x40/1f2937/FFFFFF?text=U"
//             } 
//             className="w-10 h-10 rounded-full object-cover"
//           />
//           <button
//             onClick={onLogout}
//             className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm py-2 px-4 rounded-full transition-colors"
//           >
//             Log Out
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };



import { Link } from "react-router-dom";
import { HomeIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
import { isSpotifyAuthenticated, getCurrentUser, spotifyApiRequest } from '../lib/spotify';

export const SearchBar = ({ onLogout }) => {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [spotifyUser, setSpotifyUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

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

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query) => {
    if (!isSpotifyConnected || !query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await spotifyApiRequest(
        `/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=5`
      );
      
      const results = [
        ...(response.artists?.items || []).map(item => ({ ...item, type: 'artist' })),
        ...(response.tracks?.items || []).map(item => ({ ...item, type: 'track' })),
        ...(response.albums?.items || []).map(item => ({ ...item, type: 'album' })),
      ];
      
      setSearchResults(results.slice(0, 8));
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result) => {
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
    
    if (result.external_urls?.spotify) {
      window.open(result.external_urls.spotify, '_blank');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="w-1/4"></div>

        <div className="w-1/2 flex items-center justify-center gap-4">
          <div className="text-xl font-bold whitespace-nowrap">DekMusic</div>
          
          <div className="relative w-full max-w-sm" ref={searchRef}>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                className="w-full pl-10 pr-10 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-neutral-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                {isSearching && (
                  <div className="p-4 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
                  </div>
                )}
                
                {!isSearching && searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-neutral-700 transition-colors text-left border-b border-neutral-700 last:border-b-0"
                  >
                    <img
                      src={
                        result.type === 'artist' 
                          ? result.images?.[0]?.url || 'https://placehold.co/48x48/333/FFFFFF?text=🎤'
                          : result.type === 'track'
                          ? result.album?.images?.[0]?.url || 'https://placehold.co/48x48/333/FFFFFF?text=🎵'
                          : result.images?.[0]?.url || 'https://placehold.co/48x48/333/FFFFFF?text=💿'
                      }
                      alt={result.name}
                      className={`w-12 h-12 object-cover ${result.type === 'artist' ? 'rounded-full' : 'rounded'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-white">{result.name}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {result.type === 'track' && result.artists?.map(a => a.name).join(', ')}
                        {result.type === 'artist' && `Artist • ${result.followers?.total?.toLocaleString() || 0} followers`}
                        {result.type === 'album' && `Album • ${result.artists?.[0]?.name}`}
                      </p>
                    </div>
                    <span className="text-xs bg-red-500 px-2 py-1 rounded-full capitalize">
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {showResults && !isSearching && searchResults.length === 0 && searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-neutral-800 rounded-lg shadow-xl p-4 text-center text-gray-400">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>

          <Link
            to="/"
            className="bg-neutral-800 hover:bg-neutral-700 rounded-full p-2 transition-colors"
            title="Home"
          >
            <HomeIcon className="h-6 w-6 text-white" />
          </Link>
        </div>

        <div className="w-1/4 flex items-center justify-end gap-3">
          <img 
            src={isSpotifyConnected && spotifyUser?.images?.[0]?.url 
              ? spotifyUser.images[0].url 
              : "https://placehold.co/40x40/1f2937/FFFFFF?text=U"
            } 
            alt="Profile"
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