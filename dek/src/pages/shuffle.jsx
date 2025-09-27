import { SearchBar } from "../components/SearchBar"

export const Shuffle = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-black">
      <Navbar />
      <main className="pt-28 px-4">
        <h1 className="text-3xl mb-4">Shuffle</h1>
        <p className="opacity-80"> shuffle music </p>
      </main>
    </div>
  )
}
