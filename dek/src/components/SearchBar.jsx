import { HomeIcon } from '@heroicons/react/24/solid';

export const SearchBar = () => {
  return (
    // Add sticky, top-0, and z-50 to make the navbar stick to the top
    <nav className="fixed top-0 z-50 w-full bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Left Section (empty for spacing) */}
        <div className="w-1/4">
        </div>

        {/* Center Section */}
        <div className="w-1/2 flex items-center justify-center gap-4">
          <div className="text-xl font-bold whitespace-nowrap">DekMusic</div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-sm px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <a 
            href="/" 
            className="bg-neutral-800 hover:bg-neutral-700 rounded-full p-2 transition-colors"
            title="Home"
          >
            <HomeIcon className="h-6 w-6 text-white" />
          </a>
        </div>

        {/* Right Section (empty for spacing) */}
        <div className="w-1/4">
        </div>

      </div>
    </nav>
  );
};