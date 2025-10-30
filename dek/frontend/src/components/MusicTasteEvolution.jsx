// components/MusicEvolution.jsx
import React, { useState, useEffect } from 'react';
import { getTopArtists } from '../lib/spotify';

export const MusicTasteEvolution = () => {
  const [timeRanges, setTimeRanges] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvolutionData = async () => {
      try {
        setLoading(true);
        
        // Fetch top artists for different time ranges
        const [shortTerm, mediumTerm, longTerm] = await Promise.all([
          getTopArtists('short_term', 10),
          getTopArtists('medium_term', 10),
          getTopArtists('long_term', 10)
        ]);

        setTimeRanges({
          short: shortTerm.items,
          medium: mediumTerm.items,
          long: longTerm.items
        });
      } catch (error) {
        console.error('Error fetching evolution data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvolutionData();
  }, []);

  const getTimeRangeLabel = (range) => {
    const labels = {
      short: 'Last 4 Weeks',
      medium: 'Last 6 Months', 
      long: 'All Time'
    };
    return labels[range];
  };

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Music Evolution</h2>
        <div className="bg-neutral-800/30 rounded-lg p-8 text-center">
          <p className="text-neutral-300">Tracking your music journey...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Music Evolution</h2>
      
      <div className="bg-neutral-800/30 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(timeRanges).map(([range, artists]) => (
            <div key={range} className="bg-neutral-700/20 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 text-red-400">
                {getTimeRangeLabel(range)}
              </h3>
              <div className="space-y-2">
                {artists.map((artist, index) => (
                  <div key={artist.id} className="flex items-center gap-3 p-2 rounded hover:bg-neutral-600/30">
                    <div className="w-6 h-6 rounded-full bg-neutral-600 flex items-center justify-center text-xs">
                      {index + 1}
                    </div>
                    <img 
                      src={artist.images[2]?.url || "https://placehold.co/30x30/333/FFFFFF?text=🎤"} 
                      alt={artist.name}
                      className="w-8 h-8 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{artist.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg border border-blue-500/30">
          <h4 className="font-semibold mb-2">Your Music Journey</h4>
          <p className="text-sm text-neutral-300">
            See how your taste changes from recent favorites to all-time classics. 
            Your evolving preferences tell the story of your musical journey.
          </p>
        </div>
      </div>
    </section>
  );
};