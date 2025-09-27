import { SearchBar } from "../components/SearchBar";
import { MusicPlayer } from "../components/MusicPlayer";
import { LeftSidebar } from "../components/LeftSideBar";
import { FriendDeks } from "../components/FriendDeks";
import profile1 from "../images/profile1.jpg";
import profile2 from "../images/profile2.jpg";
import profile3 from "../images/profile3.jpg";
import profile4 from "../images/profile4.jpg";
//import profile5 from "../images/profile5.jpg";
import profile6 from "../images/profile6.jpg";

export const Home = () => {
  return (
    <div className="bg-red-500 text-gray-900 font-sans">
      {/* Layout Components are kept outside the main scrollable area */}
      <SearchBar />
      <LeftSidebar />
      <FriendDeks />
      <MusicPlayer />

      {/* 1. Main content container with margins for the sidebars and top bar */}
      <main className="ml-24 mr-72 pt-20">
        
        {/* 2. Centered column for all the content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* CENTER BOX */}
          <div className="center-box">
            <h2 className="text-2xl font-bold">DekMusic</h2>
            <p className="text-gray-600">
              Welcome to DekMusic — your place for amazing tunes!
            </p>
          </div>

          {/* TOP 5 PROFILE SECTION */}
          <div className="profiles-container">
            <h2 className="profiles-header">Discover your top suites</h2>
            <div className="profile-section">
              {[
                { img: profile1, name: "@d4vd", suit: "♠", color: "text-black" },
                { img: profile2, name: "@KungFuPanda", suit: "♥", color: "text-red-600" },
                { img: profile3, name: "@ohtaniswife", suit: "♦", color: "text-red-600" },
                { img: profile4, name: "@ZarkMuckerburg", suit: "♣", color: "text-black" },
              ].map((profile, i) => (
                <div key={i} className="profile-box">
                  <span className={`suit-symbol top-2 left-2 ${profile.color}`}>{profile.suit}</span>
                  <span className={`suit-symbol bottom-2 right-2 ${profile.color}`}>{profile.suit}</span>
                  <img src={profile.img} alt={profile.name} className="profile-image" />
                  <p className="profile-desc">{profile.name}</p>
                </div>
              ))}
            </div>
          </div>

        </div> {/* End of centered column */}
      </main> {/* End of main content container */}
    </div>
  );
};