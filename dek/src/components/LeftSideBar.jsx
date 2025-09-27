// src/components/LeftSidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// IMPORT the new icons and REMOVE BookmarkIcon if you're not using it
import { 
  PlusIcon, 
  Bars3Icon, 
  HeartIcon, 
  UserIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/solid';

// This is our new, simpler navigation structure
const navLinks = [
  //{ name: 'Home', href: '/home', icon: <HomeIcon className="h-7 w-7" /> },
  { name: 'Profile', href: '/profile', icon: <UserIcon className="h-7 w-7" /> },
  { name: 'Settings', href: '/settings', icon: <Cog6ToothIcon className="h-7 w-7" /> },
];

export const LeftSidebar = () => {
  return (
    <nav className="fixed top-0 left-0 h-screen w-24 bg-black text-white p-3 flex flex-col gap-4">
      
      {/* Top Icon */}
      <div className="flex flex-col items-center">
        <button className="text-neutral-400 hover:text-white">
          <Bars3Icon className="h-7 w-7" />
        </button>
      </div>

      {/* Action Buttons (Like & Add) */}
      <div className="bg-neutral-900 rounded-xl p-2 flex flex-col items-center gap-2">
        <a href="/liked" className="w-full aspect-square flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-400">
          <HeartIcon className="h-8 w-8" />
        </a>
        <button className="w-full aspect-square flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors">
          <PlusIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Main Navigation Links (This is the new part) */}
      <div className="bg-neutral-900 rounded-xl p-2 flex flex-col items-center gap-2 flex-grow">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.href} 
            className="w-full aspect-square flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            title={link.name} // Adds a tooltip on hover
          >
            {link.icon}
          </Link>
        ))}
      </div>
    </nav>
  );
};