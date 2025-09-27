// src/components/FriendDeks.jsx
import profile6 from "../images/profile6.jpg";
import profile7 from "../images/profile7.jpg";

// Sample data for your friends list
const friends = [
  { id: 1, name: 'warnerbro', avatar: profile6 },
  { id: 2, name: 'PnutBtter', avatar: profile7 },
  { id: 3, name: 'EmmaFrost', avatar: 'https://placehold.co/100x100/60a5fa/000000?text=EM' },
  { id: 4, name: 'pandulce', avatar: 'https://placehold.co/100x100/facc15/000000?text=p' },
  { id: 5, name: 'fettywap679', avatar: 'https://placehold.co/100x100/c084fc/000000?text=fw' },
  { id: 6, name: 'User5430', avatar: 'https://placehold.co/100x100/a78bfa/000000?text=U5' },
];

export const FriendDeks = () => {
  return (
    <aside className="fixed top-0 right-0 h-screen w-72 bg-neutral-900 text-white p-4 flex flex-col gap-4 border-l border-neutral-800">
      
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
              className="w-12 h-12 rounded-lg object-cover" // Square icons with rounded corners
            />
            <div>
              <p className="font-semibold">{friend.name}</p>
              <p className="text-xs text-neutral-400">Listening to: Artist</p>
            </div>
          </a>
        ))}
      </div>

      {/* Featured Card (Inspired by 'About the artist') */}
      <div className="relative h-48 rounded-lg overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://placehold.co/400x400/3b82f6/ffffff?text=Friend+Highlight" 
          alt="Featured Friend" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        {/* Text Content */}
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-sm">Now Playing</p>
          <p className="font-bold text-lg">Song by ZarkMuckerburg</p>
        </div>
      </div>
    </aside>
  );
};