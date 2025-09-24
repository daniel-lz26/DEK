
// import { useState } from "react";
// import { Menu, X, Search} from "lucide-react";
// import { useEffect } from "react";
// import { cn } from "../lib/utils";

// const navItems = [
//   { name: "Profile", href: "#profile" },
//   { name: "Stats", href: "#stats" },
//   { name: "Friends", href: "#friends" },
//   { name: "Shuffle", href: "#shuffle" },
// ];
// // makng a putting the entire navbar into one varible to call it to the home file
// export const Navbar = () => {
//   return (
//     <div className="fixed top-5 right-5 nav-style" >
//       <nav className="flex items-center bg-transparent">
//         {navItems.map((item) => (
//           <a
//             key={item.name}
//             href={item.href}
//             className="nav-text hover:underline px-2"
//           >
//             {item.name}
//           </a>
//         ))}
//         {/* Search Bar on the far left */}
//         <div className="flex items-center bg-zinc-800 rounded-full px-4 py-2 flex-grow max-w-sm">
//           <Search className="h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="What do you want to listen to?"
//             className="ml-2 w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
//           />
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Search } from "lucide-react";

const navItems = [
  { name: "Profile", href: "#profile" },
  { name: "Stats", href: "#stats" },
  { name: "Friends", href: "#friends" },
  { name: "Shuffle", href: "#shuffle" },
];

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // Handle search functionality here
      console.log("Searching for:", searchQuery);
      // You can add your search logic or navigation here
    }
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {/* Search Bar on the far left */}
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="let's look for new dek?"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
          />
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="nav-link"
            >
              {item.name}
            </a>
          ))}
        </div>
      </nav>

      <style jsx>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          z-index: 1000;
          padding: 0 20px;
          border-bottom: 1px solid #333;
        }
        
        .navbar {
          display: flex;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          height: 70px;
        }
        
        .search-container {
          display: flex;
          align-items: center;
          background: #7f7373ff;
          border-radius: 25px;
          padding: 8px 16px;
          margin-right: auto;
          min-width: 300px;
          transition: all 0.3s ease;
          border: 1px solid #333;
        }
        
        .search-container:focus-within {
          border-color: #994242ff;
          box-shadow: 0 0 0 2px rgba(89, 82, 107, 0.2);
        }
        
        .search-icon {
          height: 18px;
          width: 18px;
          color: #ffffffff;
          margin-right: 10px;
        }
        
        .search-input {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          font-size: 14px;
          outline: none;
        }
        
        .search-input::placeholder {
          color: #ffffffff;
        }
        
        .nav-items {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: #fa8b8bff;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: #fa8b8bff;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover::after {
          width: 80%;
        }
        
        /* Responsive design for smaller screens */
        @media (max-width: 768px) {
          .navbar {
            height: 60px;
            padding: 0 10px;
          }
          
          .search-container {
            min-width: 200px;
            margin-right: 15px;
          }
          
          .nav-items {
            gap: 15px;
          }
          
          .nav-link {
            padding: 6px 12px;
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          .navbar {
            flex-direction: column;
            height: auto;
            padding: 10px;
          }
          
          .search-container {
            width: 100%;
            margin-right: 0;
            margin-bottom: 10px;
          }
          
          .nav-items {
            width: 100%;
            justify-content: space-around;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;