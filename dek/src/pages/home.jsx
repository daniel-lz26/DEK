import { Navbar } from "../components/NavBar"
import profile1 from "../images/profile1.jpg"
import profile2 from "../images/profile2.jpg"
import profile3 from "../images/profile3.jpg"
import profile4 from "../images/profile4.jpg"
import profile5 from "../images/profile5.jpg"

export const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-black">
            <Navbar />
            
            {/* CENTER BOX */}
            <div class="center-box">
                <h2>DekMusic</h2>
                <p>Welcome to DekMusic — your place for amazing tunes!</p>
            </div>

            {/* TOP 5 PROFILE SECTION */}
            <div className="profile-section">
                <h2>Explore Top 5 Deks</h2>
                <div className="profile-box">
                    <img src={profile1} alt="Profile 1" className="profile-image" />
                    <p className="profile-desc">@d4vid</p>
                </div>

                <div className="profile-box">
                    <img src={profile2} alt="Profile 2" className="profile-image" />
                    <p className="profile-desc">@KungFuPanda</p>
                </div>

                <div className="profile-box">
                    <img src={profile3} alt="Profile 3" className="profile-image" />
                    <p className="profile-desc">@ohtanis</p>
                </div>

                <div className="profile-box">
                    <img src={profile4} alt="Profile 4" className="profile-image" />
                    <p className="profile-desc">@ZarkMuckerburg</p>
                </div>

                <div className="profile-box">
                    <img src={profile5} alt="Profile 5" className="profile-image" />
                    <p className="profile-desc">@MelonMusk</p>
                </div>

            </div>

            {/* FRIENDS ACTIVITY */}
            <div className="friends-activity">
                <h2>Explore Your Friends Dek's</h2>
                <div>
                    <img src={profile1} alt="Friend 1" className="friend-image" />
                    <p className="friend-name">Friend 1</p>
                </div>
                <p>No recent activity from friends.</p>
            </div>
        </div>
    )
}