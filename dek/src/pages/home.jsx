import { Navbar } from "../components/NavBar"
import { Logo } from "../assets/Logo"

export const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-black">
            <Navbar />
            <main className="pt-28 px-4">
                <h1 className="text-3xl mb-4">Home</h1>
            </main>
        </div>
    )
}