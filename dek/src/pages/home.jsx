import { Navbar } from "../components/NavBar"
import profile1 from "../images/profile1.jpg"
import profile2 from "../images/profile2.jpg"
import profile3 from "../images/profile3.jpg"

export const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-black">
            <Navbar />
            
            {/* CENTER BOX */}
            <div class="center-box">
                <h2>DekMusic</h2>
                <p>Welcome to DekMusic — your place for amazing tunes!</p>
            </div>

            {/* PROFILE SECTION */}
            <div className="profile-section">
                <div className="profile-box">
                    <img src={profile1} alt="Profile 1" className="profile-image" />
                    <p className="profile-desc">This is profile 1 description.</p>
                </div>

                <div className="profile-box">
                    <img src={profile2} alt="Profile 2" className="profile-image" />
                    <p className="profile-desc">This is profile 2 description.</p>
                </div>

                <div className="profile-box">
                    <img src={profile3} alt="Profile 3" className="profile-image" />
                    <p className="profile-desc">This is profile 3 description.</p>
                </div>
            </div>
        </div>
    )
}