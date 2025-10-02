import { SearchBar } from "../components/SearchBar"

export const Stats = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-black">
      <Navbar />
      <main className="pt-28 px-4">
        <h1 className="text-3xl mb-4">Stats</h1>
        <p className="opacity-80">where to see your stats of what you listen too</p>
      </main>
    </div>
  )
}
