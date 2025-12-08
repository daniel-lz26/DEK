// components/GenreExplorer.jsx
import React, { useState, useEffect } from 'react';
import { getTopArtists } from '../lib/spotify';
import { LoadingSkeleton } from './LoadingSkeleton';

export const GenreExplorer = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await getTopArtists('medium_term', 50);
        
        // Count genre frequency
        const genreCounts = response.items.flatMap(artist => artist.genres)
          .reduce((acc, genre) => {
            acc[genre] = (acc[genre] || 0) + 1;
            return acc;
          }, {});

        // Convert to array and sort
        const genreArray = Object.entries(genreCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 15);

        setGenres(genreArray);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);
if (loading) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Top Genres</h2>
      <div className="bg-neutral-800/30 rounded-lg p-6">
        <LoadingSkeleton type="list" count={15} />
      </div>
    </section>
  );
}

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Your Top Genres</h2>
      
      <div className="bg-neutral-800/30 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {genres.map((genre, index) => (
            <div key={genre.name} className="flex items-center justify-between p-4 bg-neutral-700/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold capitalize">{genre.name}</p>
                  <p className="text-xs text-neutral-300">
                    {genre.count} artist{genre.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="w-20 bg-neutral-600 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(genre.count / genres[0].count) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
          <p className="text-sm text-neutral-200 text-center">
            You listen to <span className="font-bold text-purple-400">{genres.length}</span> different genres
          </p>
        </div>
      </div>
    </section>
  );
};