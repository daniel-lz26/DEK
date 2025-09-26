export const Navbar = () => {
  return (
    <nav className="w-full bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-xl font-bold">DekMusic</div>

        {/* Search Bar */}
        <div className="flex-1 px-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-sm px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Menu Items */}
        <ul className="flex gap-6 text-sm font-medium">
          <li><a href="#" className="hover:text-red-400">Home</a></li>
          <li><a href="#" className="hover:text-red-400">Profile</a></li>
          <li><a href="#" className="hover:text-red-400">Stats</a></li>
          <li><a href="#" className="hover:text-red-400">Friends</a></li>
          <li><a href="#" className="hover:text-red-400">Shuffle</a></li>
        </ul>
      </div>
    </nav>
  )
}
