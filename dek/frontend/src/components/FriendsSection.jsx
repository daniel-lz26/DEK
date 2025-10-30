//================================================================
// IMPORTS
//================================================================
import React, { useState, useEffect } from 'react';

//================================================================
// FRIENDS SECTION COMPONENT
//================================================================
export const FriendsSection = () => {
  //================================================================
  // STATE MANAGEMENT
  //================================================================
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  //================================================================
  // MOCK DATA - Replace with actual API calls when permissions are available
  //================================================================
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setFriends([
        {
          id: 1,
          name: "Alex Chen",
          status: "online",
          currentTrack: {
            name: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            playing: true,
            progress: 65
          },
          avatar: "https://placehold.co/100x100/3B82F6/FFFFFF?text=A"
        },
        {
          id: 2,
          name: "Sam Rivera",
          status: "online",
          currentTrack: {
            name: "As It Was",
            artist: "Harry Styles",
            album: "Harry's House",
            playing: true,
            progress: 42
          },
          avatar: "https://placehold.co/100x100/10B981/FFFFFF?text=S"
        },
        {
          id: 3,
          name: "Jordan Taylor",
          status: "offline",
          currentTrack: null,
          avatar: "https://placehold.co/100x100/8B5CF6/FFFFFF?text=J"
        },
        {
          id: 4,
          name: "Maya Patel",
          status: "online",
          currentTrack: {
            name: "Flowers",
            artist: "Miley Cyrus",
            album: "Endless Summer Vacation",
            playing: false,
            progress: 0
          },
          avatar: "https://placehold.co/100x100/EC4899/FFFFFF?text=M"
        },
        {
          id: 5,
          name: "Ryan Kim",
          status: "online",
          currentTrack: {
            name: "Kill Bill",
            artist: "SZA",
            album: "SOS",
            playing: true,
            progress: 78
          },
          avatar: "https://placehold.co/100x100/F59E0B/FFFFFF?text=R"
        }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  //================================================================
  // RENDER METHOD
  //================================================================
  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Friends</h2>
        <div className="bg-neutral-800/30 rounded-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-700 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-8 bg-neutral-700 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-neutral-300 mt-4">Loading your friends...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Friends</h2>
      
      {/* Friends List */}
      <div className="bg-neutral-800/30 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Currently Active</h3>
          <span className="text-sm text-neutral-400">
            {friends.filter(f => f.status === 'online').length} online
          </span>
        </div>

        <div className="space-y-4">
          {friends.map(friend => (
            <div key={friend.id} className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-colors">
              {/* Friend Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <img 
                    src={friend.avatar} 
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-neutral-800 ${
                    friend.status === 'online' ? 'bg-green-500' : 'bg-neutral-500'
                  }`} />
                </div>
                <div>
                  <p className="font-semibold">{friend.name}</p>
                  <p className={`text-sm ${
                    friend.status === 'online' ? 'text-green-400' : 'text-neutral-400'
                  }`}>
                    {friend.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Currently Playing */}
              <div className="flex-1 text-right">
                {friend.currentTrack ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-end gap-2">
                      {friend.currentTrack.playing && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                      <p className="font-medium text-sm truncate max-w-xs">
                        {friend.currentTrack.name}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-400 truncate">
                      {friend.currentTrack.artist} • {friend.currentTrack.album}
                    </p>
                    {friend.currentTrack.playing && (
                      <div className="w-32 h-1 bg-neutral-600 rounded-full ml-auto">
                        <div 
                          className="h-1 bg-red-500 rounded-full transition-all duration-300"
                          style={{ width: `${friend.currentTrack.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">Not listening</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Friends Section */}
        <div className="mt-8 pt-6 border-t border-neutral-700/50">
          <h3 className="text-lg font-semibold mb-4">Connect with Friends</h3>
          <div className="bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-lg p-4 border border-red-500/30">
            <p className="text-sm text-neutral-200 mb-3">
              To see what your friends are listening to in real-time, you'll need to:
            </p>
            <ul className="text-xs text-neutral-300 space-y-1 list-disc list-inside">
              <li>Connect your Spotify account with friend activity permissions</li>
              <li>Your friends need to have their listening activity set to public</li>
              <li>Follow each other on Spotify</li>
            </ul>
            <button className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Connect Spotify Friends
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};