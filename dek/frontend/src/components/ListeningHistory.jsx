// components/ListeningHistory.jsx
import React, { useState, useEffect } from 'react';
import { getRecentlyPlayed, getTopTracks } from '../lib/spotify';

export const ListeningHistory = () => {
  const [recentTracks, setRecentTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('short_term');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListeningHistory = async () => {
      try {
        setLoading(true);
        const response = await getRecentlyPlayed(20);
        setRecentTracks(response.items);
      } catch (error) {
        console.error('Error fetching listening history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListeningHistory();
  }, []);

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
        <div className="bg-neutral-800/30 rounded-lg p-8 text-center">
          <p className="text-neutral-300">Loading your recent tracks...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
      
      <div className="bg-neutral-800/30 rounded-lg p-6">
        <div className="space-y-4">
          {recentTracks.slice(0, 10).map((item, index) => (
            <div key={`${item.track.id}-${index}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-700/30 transition-colors">
              <img 
                src={item.track.album.images[2]?.url || "https://placehold.co/40x40/333/FFFFFF?text=🎵"} 
                alt={item.track.album.name}
                className="w-10 h-10 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.track.name}</p>
                <p className="text-sm text-neutral-400 truncate">{item.track.artists.map(a => a.name).join(', ')}</p>
              </div>
              <div className="text-xs text-neutral-500">
                {new Date(item.played_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-neutral-700/50">
          <p className="text-sm text-neutral-400 text-center">
            Your last {recentTracks.length} played tracks
          </p>
        </div>
      </div>
    </section>
  );
};