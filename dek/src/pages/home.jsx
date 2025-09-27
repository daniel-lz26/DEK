import { SearchBar } from "../components/SearchBar";
import { MusicPlayer } from "../components/MusicPlayer";
import { LeftSidebar } from "../components/LeftSideBar";
import { FriendDeks } from "../components/FriendDeks";
import { suitesData } from "../lib/suites";

export const Home = ({ onLogout }) => {
  return (
    // 1. This outer container creates a fixed frame the size of the screen
    <div className="bg-red-500 text-gray-900 font-sans h-screen overflow-hidden">
      {/* Your fixed components stay outside of the scrollable area */}
      <SearchBar onLogout={onLogout} />
      <LeftSidebar />
      <FriendDeks />
      <MusicPlayer />

      {/* 2. This <main> element is now the designated scrollable area */}
      <main className="ml-24 mr-72 h-full overflow-y-auto pt-20">
        
        {/* 3. Add padding to the bottom (pb-24) to ensure the last items aren't hidden by the music player */}
        <div className="max-w-7xl mx-auto px-8 pb-24">
          
          {/* Center Box */}
          <div className="center-box">
            <h2 className="text-2xl font-bold">DekMusic</h2>
            <p className="text-gray-600">
              Welcome to DekMusic — your place for amazing tunes!
            </p>
          </div>

          {/* Profiles Section */}
          <div className="profiles-container">
            <h2 className="profiles-header">Discover your top suites</h2>
            <div className="profile-section">
              {suitesData.map((profile) => (
                <div key={profile.id} className="profile-box">
                  <span className={`suit-symbol top-2 left-2 ${profile.color}`}>{profile.suit}</span>
                  <span className={`suit-symbol bottom-2 right-2 ${profile.color}`}>{profile.suit}</span>
                  <img src={profile.img} alt={profile.name} className="profile-image" />
                  <p className="profile-desc">{profile.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};