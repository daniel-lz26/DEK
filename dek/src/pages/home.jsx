import { Navbar } from "../components/NavBar";
import profile1 from "../images/profile1.jpg";
import profile2 from "../images/profile2.jpg";
import profile3 from "../images/profile3.jpg";
import profile4 from "../images/profile4.jpg";
import profile5 from "../images/profile5.jpg";
import profile6 from "../images/profile6.jpg";
// Import Tailwind styles

export const Home = () => {
  return (
    <div className="min-h-screen bg-red-500 text-gray-900 overflow-x-hidden font-sans">
      <Navbar />

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
            {
              img: profile2,
              name: "@KungFuPanda",
              suit: "♥",
              color: "text-red-600",
            },
            {
              img: profile3,
              name: "@ohtaniswife",
              suit: "♦",
              color: "text-red-600",
            },
            {
              img: profile4,
              name: "@ZarkMuckerburg",
              suit: "♣",
              color: "text-black",
            },
            // {
            //   img: profile5,
            //   name: "@MelonMusk",
            //   suit: "♠",
            //   color: "text-black",
            // },
          ].map((profile, i) => (
            <div key={i} className="profile-box">
              {/* Top-left suit */}
              <span className={`suit-symbol top-2 left-2 ${profile.color}`}>
                {profile.suit}
              </span>
              {/* Bottom-right suit */}
              <span className={`suit-symbol bottom-2 right-2 ${profile.color}`}>
                {profile.suit}
              </span>

              <img
                src={profile.img}
                alt={profile.name}
                className="profile-image"
              />
              <p className="profile-desc">{profile.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FRIENDS ACTIVITY */}
      <div className="friends-activity">
        <h2 className="text-white text-2xl font-semibold">
          Explore your friends' deks
        </h2>
        <div className="flex flex-col items-center mt-4">
          <img src={profile6} alt="Friend 1" className="friend-image" />
          <p className="text-white mt-2">Friend 1</p>
        </div>
        <p className="text-gray-200 mt-3">No recent activity from friends.</p>
      </div>
    </div>
  );
};
