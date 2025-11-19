// src/components/FriendDeks.jsx

import { StatsSideBar } from '../components/StatsSideBar';
import { friends } from '../lib/friends';

export const FriendDeks = () => {
  return (
    <aside className="fixed top-0 right-0 h-screen w-72 bg-neutral-900 pt-20 text-white p-4 flex flex-col gap-4 border-l border-neutral-800">
      
      {/* Header */}
      <div className="font-bold text-xl">
        Friends' Activity
      </div>

      {/* Friends List (Scrollable) */}
      <div className="flex flex-col gap-2 flex-grow overflow-y-auto">
        {friends.map(friend => (
          <a key={friend.id} href="#" className="flex items-center gap-4 p-2 rounded-lg hover:bg-neutral-800 transition-colors">
            <img 
              src={friend.avatar} 
              alt={friend.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold">{friend.name}</p>
              {/* 2. Use the dynamic listening data */}
              <p className="text-xs text-neutral-400">Listening to: {friend.listeningTo}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Featured Card */}
      <div className="relative h-48 rounded-lg overflow-hidden">
        {/* ... component content ... */}
      </div>
    </aside>
  );
};