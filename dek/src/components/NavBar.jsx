
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "Profile", href: "#profile" },
  { name: "Stats", href: "#stats" },
  { name: "Friends", href: "#friends" },
  { name: "Shuffle", href: "#shuffle" },
];
// makng a putting the entire navbar into one varible to call it to the home file
export const Navbar = () => {
  return (
    <div className="fixed top-5 right-5 nav-style" >
      <nav className="flex items-center bg-transparent">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="nav-text hover:underline px-2"
          >
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};