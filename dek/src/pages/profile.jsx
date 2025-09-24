import { Navbar } from "../components/NavBar"
import avatarSrc from "../assets/images/DEK.png"


export const Profile = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-black">
      <Navbar />
      <main className="pt-28 px-4">
        <h1 className="text-3xl mb-4">Profile</h1>
        <p className="opacity-80">View your profile information.</p>
      </main>
    </div>
  )
}