import { SearchBar } from "../components/SearchBar"

export const Friends = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-black">
      <Navbar />
      <main className="pt-28 px-4">
        <h1 className="text-3xl mb-4">Friends</h1>
        <p className="opacity-80">find & view what your friends are listening to</p>
      </main>
    </div>
  )
}
