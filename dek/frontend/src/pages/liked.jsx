// pages/liked.jsx
import React, { useState, useEffect } from 'react';
import { getTopArtists, getTopTracks, searchArtists, searchTracks } from '../lib/spotify';
import { SearchBar } from '../components/SearchBar';
import { LeftSidebar } from '../components/LeftSideBar';
import { StatsSideBar } from '../components/StatsSideBar';

// Free lyrics API - Lyrics.ovh (no API key required)
const fetchLyrics = async (artist, song) => {
  try {
    const cleanArtist = encodeURIComponent(artist.trim());
    const cleanSong = encodeURIComponent(song.trim());
    
    const response = await fetch(`https://api.lyrics.ovh/v1/${cleanArtist}/${cleanSong}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return `Lyrics for "${song}" by ${artist} not found.`;
      }
      throw new Error('Failed to fetch lyrics');
    }
    
    const data = await response.json();
    return data.lyrics || `No lyrics available for "${song}" by ${artist}.`;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return `Could not load lyrics for "${song}" by ${artist}. Please check the artist and song names.`;
  }
};

// Templates for quick setup
const TEMPLATES = {
  favoriteArtists: {
    name: "Favorite Artists",
    layout: [
      {
        id: 'section-1',
        type: 'section',
        content: { title: 'My Top Artists', subtitle: 'The artists I listen to most' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
      },
      {
        id: 'artist-1',
        type: 'artist',
        content: { name: 'Add your first artist', image: 'https://placehold.co/200x200/333/FFFFFF?text=Artist+1', genre: 'Genre' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      },
      {
        id: 'artist-2',
        type: 'artist',
        content: { name: 'Add your second artist', image: 'https://placehold.co/200x200/333/FFFFFF?text=Artist+2', genre: 'Genre' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      }
    ]
  },
  musicCollection: {
    name: "Music Collection",
    layout: [
      {
        id: 'section-1',
        type: 'section',
        content: { title: 'Recently Played', subtitle: 'My current favorites' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
      },
      {
        id: 'song-1',
        type: 'song',
        content: { title: 'Favorite Song', artist: 'Artist Name', album: 'Album Name', duration: '3:00' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      },
      {
        id: 'album-1',
        type: 'album',
        content: { title: 'Favorite Album', artist: 'Artist Name', image: 'https://placehold.co/200x200/333/FFFFFF?text=Album', year: '2024' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      }
    ]
  },
  lyricsWall: {
    name: "Lyrics Wall",
    layout: [
      {
        id: 'section-1',
        type: 'section',
        content: { title: 'Favorite Lyrics', subtitle: 'Words that speak to me' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
      },
      {
        id: 'lyrics-1',
        type: 'lyrics',
        content: { 
          text: 'Your favorite lyrics will appear here...\nAdd a song and artist to fetch real lyrics!', 
          song: 'Song Name', 
          artist: 'Artist Name' 
        },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      },
      {
        id: 'lyrics-2',
        type: 'lyrics',
        content: { 
          text: 'Another set of meaningful lyrics...\nCustomize which verses to feature!', 
          song: 'Another Song', 
          artist: 'Another Artist' 
        },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      }
    ]
  },
  mixedContent: {
    name: "Mixed Content",
    layout: [
      {
        id: 'section-1',
        type: 'section',
        content: { title: 'My Music Space', subtitle: 'A mix of everything I love' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
      },
      {
        id: 'artist-1',
        type: 'artist',
        content: { name: 'Top Artist', image: 'https://placehold.co/200x200/333/FFFFFF?text=Artist', genre: 'Genre' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      },
      {
        id: 'song-1',
        type: 'song',
        content: { title: 'Current Favorite', artist: 'Artist Name', album: 'Album Name', duration: '3:30' },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      },
      {
        id: 'lyrics-1',
        type: 'lyrics',
        content: { 
          text: 'Add your favorite song lyrics here...', 
          song: 'Song Name', 
          artist: 'Artist Name' 
        },
        style: { padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      }
    ]
  }
};

export const LikedPage = () => {
  const [layout, setLayout] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTile, setEditingTile] = useState(null);
  const [editContent, setEditContent] = useState({});
  const [searchResults, setSearchResults] = useState({ artists: [], tracks: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchingLyrics, setFetchingLyrics] = useState(false);
  const [searchType, setSearchType] = useState('artist');
  const [searchLoading, setSearchLoading] = useState(false);

  // NEW: State for lyrics customization
  const [customizingLyrics, setCustomizingLyrics] = useState(false);
  const [lyricsSnippets, setLyricsSnippets] = useState({});
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [artistsResponse, tracksResponse] = await Promise.all([
          getTopArtists('medium_term', 20),
          getTopTracks('medium_term', 20)
        ]);
        
        setTopArtists(artistsResponse.items);
        setTopTracks(tracksResponse.items);
        
        const savedLayout = localStorage.getItem('likedPageLayout');
        if (savedLayout) {
          setLayout(JSON.parse(savedLayout));
        }

        // NEW: Load saved lyrics snippets
        const savedSnippets = localStorage.getItem('lyricsSnippets');
        if (savedSnippets) {
          setLyricsSnippets(JSON.parse(savedSnippets));
        }
      } catch (error) {
        console.error('Error fetching data for liked page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (layout.length > 0) {
      localStorage.setItem('likedPageLayout', JSON.stringify(layout));
    }
  }, [layout]);

  // NEW: Save lyrics snippets
  useEffect(() => {
    if (Object.keys(lyricsSnippets).length > 0) {
      localStorage.setItem('lyricsSnippets', JSON.stringify(lyricsSnippets));
    }
  }, [lyricsSnippets]);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ artists: [], tracks: [] });
      setSearchLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType]);

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults({ artists: [], tracks: [] });
      return;
    }

    setSearchLoading(true);
    try {
      if (searchType === 'artist') {
        const results = await searchArtists(searchQuery, 5);
        setSearchResults(prev => ({ 
          ...prev, 
          artists: results.artists?.items || [] 
        }));
      } else if (searchType === 'track') {
        const results = await searchTracks(searchQuery, 5);
        setSearchResults(prev => ({ 
          ...prev, 
          tracks: results.tracks?.items || [] 
        }));
      }
    } catch (error) {
      console.error('Error searching Spotify:', error);
      setSearchResults({ artists: [], tracks: [] });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFetchLyrics = async (tileId) => {
    if (!editContent.artist || !editContent.song) {
      alert('Please enter both artist and song name to fetch lyrics.');
      return;
    }

    setFetchingLyrics(true);
    try {
      const lyrics = await fetchLyrics(editContent.artist, editContent.song);
      setEditContent(prev => ({ ...prev, text: lyrics }));
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      alert('Failed to fetch lyrics. Please try again.');
    } finally {
      setFetchingLyrics(false);
    }
  };

  // NEW: Function to customize lyrics snippet
  const customizeLyricsSnippet = (tileId, lyrics) => {
    setLyricsSnippets(prev => ({
      ...prev,
      [tileId]: lyrics
    }));
    setCustomizingLyrics(null);
  };

  // NEW: Function to extract snippet from full lyrics
  const extractSnippet = (fullLyrics, startLine = 0, numLines = 8) => {
    const lines = fullLyrics.split('\n').filter(line => line.trim());
    const snippet = lines.slice(startLine, startLine + numLines).join('\n');
    return snippet || fullLyrics.split('\n').slice(0, numLines).join('\n');
  };

  // NEW: Apply template
  const applyTemplate = (templateKey) => {
    const template = TEMPLATES[templateKey];
    if (template) {
      setLayout(template.layout);
      setShowTemplates(false);
    }
  };

  // Keep all your existing functions (addTile, removeTile, moveTile, startEditing, saveEditing, cancelEditing, etc.)
  const addTile = (type) => {
    const newTile = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      style: getDefaultStyle(type)
    };
    
    setLayout(prev => [...prev, newTile]);
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case 'artist':
        return {
          name: 'Artist Name',
          image: 'https://placehold.co/200x200/333/FFFFFF?text=Artist',
          genre: 'Genre'
        };
      case 'song':
        return {
          title: 'Song Title',
          artist: 'Artist Name',
          album: 'Album Name',
          duration: '3:00'
        };
      case 'album':
        return {
          title: 'Album Title',
          artist: 'Artist Name',
          image: 'https://placehold.co/200x200/333/FFFFFF?text=Album',
          year: '2024'
        };
      case 'lyrics':
        return {
          text: 'Your favorite lyrics will appear here...',
          song: 'Song Name',
          artist: 'Artist Name'
        };
      case 'section':
        return {
          title: 'Section Title',
          subtitle: 'Optional subtitle'
        };
      case 'text':
        return {
          content: 'Your text content here...',
          title: 'Optional Title'
        };
      case 'picture':
        return {
          image: 'https://placehold.co/400x300/333/FFFFFF?text=Image',
          caption: 'Optional caption'
        };
      case 'spacer':
        return {
          height: '2rem'
        };
      default:
        return {};
    }
  };

  const getDefaultStyle = (type) => {
    const baseStyle = {
      padding: '1rem',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)'
    };

    switch (type) {
      case 'section':
        return { ...baseStyle, backgroundColor: 'rgba(255, 255, 255, 0.1)' };
      case 'spacer':
        return { height: '2rem', backgroundColor: 'transparent' };
      default:
        return baseStyle;
    }
  };

  const removeTile = (tileId) => {
    setLayout(prev => prev.filter(tile => tile.id !== tileId));
  };

  const moveTile = (tileId, direction) => {
    const index = layout.findIndex(tile => tile.id === tileId);
    if (index === -1) return;

    const newLayout = [...layout];
    if (direction === 'up' && index > 0) {
      [newLayout[index], newLayout[index - 1]] = [newLayout[index - 1], newLayout[index]];
    } else if (direction === 'down' && index < newLayout.length - 1) {
      [newLayout[index], newLayout[index + 1]] = [newLayout[index + 1], newLayout[index]];
    }
    
    setLayout(newLayout);
  };

  const startEditing = (tileId, content) => {
    setEditingTile(tileId);
    setEditContent({ ...content });
    setSearchResults({ artists: [], tracks: [] });
    setSearchQuery('');
    // Set search type based on tile type
    if (content.name) setSearchType('artist');
    if (content.title) setSearchType('track');
  };

  const saveEditing = (tileId) => {
    setLayout(prev => prev.map(tile => 
      tile.id === tileId 
        ? { ...tile, content: { ...editContent } }
        : tile
    ));
    setEditingTile(null);
    setEditContent({});
    setSearchResults({ artists: [], tracks: [] });
  };

  const cancelEditing = () => {
    setEditingTile(null);
    setEditContent({});
    setSearchResults({ artists: [], tracks: [] });
  };

  const handleEditChange = (field, value) => {
    setEditContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectArtist = (artist) => {
    setEditContent(prev => ({
      ...prev,
      name: artist.name,
      image: artist.images[0]?.url || 'https://placehold.co/200x200/333/FFFFFF?text=Artist',
      genre: artist.genres[0] || 'Various Genres'
    }));
    setSearchResults({ artists: [], tracks: [] });
    setSearchQuery('');
  };

  const selectTrack = (track) => {
    const mainArtist = track.artists[0];
    setEditContent(prev => ({
      ...prev,
      title: track.name,
      artist: mainArtist.name,
      album: track.album.name,
      duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}`,
      image: track.album.images[0]?.url || 'https://placehold.co/200x200/333/FFFFFF?text=Album'
    }));
    setSearchResults({ artists: [], tracks: [] });
    setSearchQuery('');
  };

  // NEW: Enhanced lyrics tile with customization
  const renderLyricsTile = (tile) => {
    const { id, content, style } = tile;
    const isEditing = editingTile === id;
    const customSnippet = lyricsSnippets[id];
    const displayLyrics = customSnippet || content.text;

    if (isEditing) {
      return (
        <div className="relative group" style={style}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={editContent.artist || ''}
                onChange={(e) => handleEditChange('artist', e.target.value)}
                className="flex-1 p-2 bg-neutral-700 rounded text-white"
                placeholder="Artist name"
              />
              <input
                type="text"
                value={editContent.song || ''}
                onChange={(e) => handleEditChange('song', e.target.value)}
                className="flex-1 p-2 bg-neutral-700 rounded text-white"
                placeholder="Song name"
              />
              <button
                onClick={() => handleFetchLyrics(id)}
                disabled={fetchingLyrics || !editContent.artist || !editContent.song}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 rounded text-sm transition-colors"
              >
                {fetchingLyrics ? 'Loading...' : 'Get Lyrics'}
              </button>
            </div>
            
            <textarea
              value={editContent.text || ''}
              onChange={(e) => handleEditChange('text', e.target.value)}
              className="w-full p-2 bg-neutral-700 rounded text-white h-32"
              placeholder="Lyrics will appear here..."
            />
            
            <div className="flex gap-2">
              <button onClick={() => saveEditing(id)} className="px-3 py-1 bg-green-600 rounded text-sm">
                Save
              </button>
              <button onClick={cancelEditing} className="px-3 py-1 bg-neutral-600 rounded text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative group" style={style}>
        {/* NEW: Customize button for lyrics */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={() => setCustomizingLyrics(customizingLyrics === id ? null : id)}
            className="w-6 h-6 bg-blue-600 rounded text-xs flex items-center justify-center"
            title="Customize lyrics snippet"
          >
            ✂
          </button>
        </div>

        {customizingLyrics === id ? (
          <div className="space-y-3 p-4 bg-neutral-700 rounded-lg">
            <h4 className="font-semibold text-white">Customize Lyrics Snippet</h4>
            <p className="text-neutral-300 text-sm">
              Select which part of the lyrics to feature:
            </p>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {content.text.split('\n').filter(line => line.trim()).map((line, index) => (
                <div key={index} className="flex items-center gap-2 p-2 hover:bg-neutral-600 rounded">
                  <span className="text-neutral-400 text-xs w-6">{index + 1}</span>
                  <span className="text-neutral-200 text-sm flex-1">{line}</span>
                  <button
                    onClick={() => {
                      const snippet = extractSnippet(content.text, index, 6);
                      customizeLyricsSnippet(id, snippet);
                    }}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                  >
                    Start here
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => customizeLyricsSnippet(id, content.text)}
                className="px-3 py-1 bg-neutral-600 hover:bg-neutral-500 rounded text-sm"
              >
                Show Full Lyrics
              </button>
              <button
                onClick={() => setCustomizingLyrics(null)}
                className="px-3 py-1 bg-neutral-600 hover:bg-neutral-500 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-h-48 overflow-y-auto mb-3">
              <blockquote className="italic text-neutral-200 text-lg whitespace-pre-wrap leading-relaxed">
                {displayLyrics}
              </blockquote>
            </div>
            <p className="text-neutral-400 text-sm border-t border-neutral-600 pt-2">
              — {content.song} by {content.artist}
              {customSnippet && (
                <span className="text-blue-400 text-xs ml-2">(Custom snippet)</span>
              )}
            </p>
          </>
        )}
      </div>
    );
  };

  // Update your existing renderTile function to use the enhanced lyrics tile
  const renderTile = (tile) => {
    const { id, type, content, style } = tile;
    const isEditing = editingTile === id;

    // Use the new lyrics tile for lyrics type
    if (type === 'lyrics') {
      return renderLyricsTile(tile);
    }

    // Keep all your existing cases for other tile types
    switch (type) {
      case 'artist':
        return (
          <div key={id} className="relative group" style={style}>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setSearchType('artist')}
                    className={`px-3 py-1 rounded text-sm ${
                      searchType === 'artist' ? 'bg-blue-600 text-white' : 'bg-neutral-600 text-neutral-300'
                    }`}
                  >
                    Artists
                  </button>
                  <button
                    onClick={() => setSearchType('track')}
                    className={`px-3 py-1 rounded text-sm ${
                      searchType === 'track' ? 'bg-blue-600 text-white' : 'bg-neutral-600 text-neutral-300'
                    }`}
                  >
                    Tracks
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 bg-neutral-700 rounded text-white pr-10"
                    placeholder={`Search for ${searchType}...`}
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {searchResults.artists.length > 0 && searchType === 'artist' && (
                  <div className="max-h-32 overflow-y-auto space-y-2 border border-neutral-600 rounded p-2">
                    <p className="text-xs text-neutral-400 font-semibold">Artists:</p>
                    {searchResults.artists.map(artist => (
                      <div
                        key={artist.id}
                        onClick={() => selectArtist(artist)}
                        className="p-2 bg-neutral-600 rounded cursor-pointer hover:bg-neutral-500 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={artist.images[2]?.url || 'https://placehold.co/40x40/333/FFFFFF?text=🎵'} 
                            alt={artist.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-sm font-medium">{artist.name}</span>
                            {artist.genres[0] && (
                              <p className="text-xs text-neutral-300">{artist.genres[0]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.tracks.length > 0 && searchType === 'track' && (
                  <div className="max-h-32 overflow-y-auto space-y-2 border border-neutral-600 rounded p-2">
                    <p className="text-xs text-neutral-400 font-semibold">Tracks:</p>
                    {searchResults.tracks.map(track => (
                      <div
                        key={track.id}
                        onClick={() => selectTrack(track)}
                        className="p-2 bg-neutral-600 rounded cursor-pointer hover:bg-neutral-500 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={track.album.images[2]?.url || 'https://placehold.co/40x40/333/FFFFFF?text=🎵'} 
                            alt={track.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{track.name}</p>
                            <p className="text-xs text-neutral-300 truncate">{track.artists[0].name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  <input
                    type="text"
                    value={editContent.name || ''}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="w-full p-2 bg-neutral-700 rounded text-white"
                    placeholder="Artist name"
                  />
                  <input
                    type="text"
                    value={editContent.genre || ''}
                    onChange={(e) => handleEditChange('genre', e.target.value)}
                    className="w-full p-2 bg-neutral-700 rounded text-white"
                    placeholder="Genre"
                  />
                  <input
                    type="text"
                    value={editContent.image || ''}
                    onChange={(e) => handleEditChange('image', e.target.value)}
                    className="w-full p-2 bg-neutral-700 rounded text-white"
                    placeholder="Image URL"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => saveEditing(id)} className="px-3 py-1 bg-green-600 rounded text-sm">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="px-3 py-1 bg-neutral-600 rounded text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <img 
                  src={content.image} 
                  alt={content.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-white">{content.name}</h3>
                  <p className="text-neutral-300 text-sm">{content.genre}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'song':
        return (
          <div key={id} className="relative group" style={style}>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setSearchType('artist')}
                    className={`px-3 py-1 rounded text-sm ${
                      searchType === 'artist' ? 'bg-blue-600 text-white' : 'bg-neutral-600 text-neutral-300'
                    }`}
                  >
                    Artists
                  </button>
                  <button
                    onClick={() => setSearchType('track')}
                    className={`px-3 py-1 rounded text-sm ${
                      searchType === 'track' ? 'bg-blue-600 text-white' : 'bg-neutral-600 text-neutral-300'
                    }`}
                  >
                    Tracks
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 bg-neutral-700 rounded text-white pr-10"
                    placeholder={`Search for ${searchType}...`}
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {searchResults.artists.length > 0 && searchType === 'artist' && (
                  <div className="max-h-32 overflow-y-auto space-y-2 border border-neutral-600 rounded p-2">
                    <p className="text-xs text-neutral-400 font-semibold">Artists:</p>
                    {searchResults.artists.map(artist => (
                      <div
                        key={artist.id}
                        onClick={() => {
                          setEditContent(prev => ({ ...prev, artist: artist.name }));
                          setSearchResults({ artists: [], tracks: [] });
                          setSearchQuery('');
                        }}
                        className="p-2 bg-neutral-600 rounded cursor-pointer hover:bg-neutral-500 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={artist.images[2]?.url || 'https://placehold.co/40x40/333/FFFFFF?text=🎵'} 
                            alt={artist.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm">{artist.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.tracks.length > 0 && searchType === 'track' && (
                  <div className="max-h-32 overflow-y-auto space-y-2 border border-neutral-600 rounded p-2">
                    <p className="text-xs text-neutral-400 font-semibold">Tracks:</p>
                    {searchResults.tracks.map(track => (
                      <div
                        key={track.id}
                        onClick={() => selectTrack(track)}
                        className="p-2 bg-neutral-600 rounded cursor-pointer hover:bg-neutral-500 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={track.album.images[2]?.url || 'https://placehold.co/40x40/333/FFFFFF?text=🎵'} 
                            alt={track.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{track.name}</p>
                            <p className="text-xs text-neutral-300 truncate">{track.artists[0].name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  <input
                    type="text"
                    value={editContent.title || ''}
                    onChange={(e) => handleEditChange('title', e.target.value)}
                    className="w-full p-2 bg-neutral-700 rounded text-white"
                    placeholder="Song title"
                  />
                  <input
                    type="text"
                    value={editContent.artist || ''}
                    onChange={(e) => handleEditChange('artist', e.target.value)}
                    className="w-full p-2 bg-neutral-700 rounded text-white"
                    placeholder="Artist"
                  />
                  <input
                    type="text"
                    value={editContent.album || ''}
                    onChange={(e) => handleEditChange('album', e.target.value)}
                    className="w-full p-2 bg-neutral-700 rounded text-white"
                    placeholder="Album"
                  />
                  <input
                    type="text"
                    value={editContent.duration || ''}
                    onChange={(e) => handleEditChange('duration', e.target.value)}
                    className="w-full p-2 bg-neutral-700 rounded text-white"
                    placeholder="Duration"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => saveEditing(id)} className="px-3 py-1 bg-green-600 rounded text-sm">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="px-3 py-1 bg-neutral-600 rounded text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white">{content.title}</h3>
                  <p className="text-neutral-300 text-sm">{content.artist}</p>
                </div>
                <span className="text-neutral-400 text-sm">{content.duration}</span>
              </div>
            )}
          </div>
        );

      case 'album':
        return (
          <div key={id} className="relative group" style={style}>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editContent.title || ''}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white"
                  placeholder="Album title"
                />
                <input
                  type="text"
                  value={editContent.artist || ''}
                  onChange={(e) => handleEditChange('artist', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white"
                  placeholder="Artist"
                />
                <input
                  type="text"
                  value={editContent.year || ''}
                  onChange={(e) => handleEditChange('year', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white"
                  placeholder="Year"
                />
                <input
                  type="text"
                  value={editContent.image || ''}
                  onChange={(e) => handleEditChange('image', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white"
                  placeholder="Image URL"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEditing(id)} className="px-3 py-1 bg-green-600 rounded text-sm">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="px-3 py-1 bg-neutral-600 rounded text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <img 
                  src={content.image} 
                  alt={content.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <h3 className="font-bold text-white">{content.title}</h3>
                  <p className="text-neutral-300 text-sm">{content.artist}</p>
                  <p className="text-neutral-400 text-xs">{content.year}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'section':
        return (
          <div key={id} className="relative group" style={style}>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editContent.title || ''}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white text-2xl font-bold"
                  placeholder="Section title"
                />
                <input
                  type="text"
                  value={editContent.subtitle || ''}
                  onChange={(e) => handleEditChange('subtitle', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white"
                  placeholder="Subtitle (optional)"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEditing(id)} className="px-3 py-1 bg-green-600 rounded text-sm">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="px-3 py-1 bg-neutral-600 rounded text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                {content.subtitle && (
                  <p className="text-neutral-300 mt-1">{content.subtitle}</p>
                )}
              </>
            )}
          </div>
        );

      case 'text':
        return (
          <div key={id} className="relative group" style={style}>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editContent.title || ''}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white"
                  placeholder="Title (optional)"
                />
                <textarea
                  value={editContent.content || ''}
                  onChange={(e) => handleEditChange('content', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white h-32"
                  placeholder="Your text content"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEditing(id)} className="px-3 py-1 bg-green-600 rounded text-sm">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="px-3 py-1 bg-neutral-600 rounded text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {content.title && (
                  <h3 className="font-semibold text-white mb-2">{content.title}</h3>
                )}
                <p className="text-neutral-200 whitespace-pre-wrap">{content.content}</p>
              </>
            )}
          </div>
        );

      case 'picture':
        return (
          <div key={id} className="relative group" style={style}>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editContent.image || ''}
                  onChange={(e) => handleEditChange('image', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white"
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={editContent.caption || ''}
                  onChange={(e) => handleEditChange('caption', e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded text-white"
                  placeholder="Caption (optional)"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEditing(id)} className="px-3 py-1 bg-green-600 rounded text-sm">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="px-3 py-1 bg-neutral-600 rounded text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <img 
                  src={content.image} 
                  alt={content.caption}
                  className="w-full rounded-lg object-cover"
                />
                {content.caption && (
                  <p className="text-neutral-400 text-sm mt-2 text-center">{content.caption}</p>
                )}
              </>
            )}
          </div>
        );

      case 'spacer':
        return (
          <div key={id} style={style} />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-red-500 font-sans text-white h-screen overflow-hidden">
        <SearchBar />
        <LeftSidebar />
        <StatsSideBar />
        <main className="ml-24 mr-80 pt-20 px-8 h-full overflow-y-auto">
          <div className="bg-neutral-800/30 rounded-lg p-8 text-center mt-8">
            <p className="text-neutral-300">Loading your personalized content...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-red-500 font-sans text-white h-screen overflow-hidden">
      <SearchBar />
      <LeftSidebar />
      <StatsSideBar />

      <main className="ml-24 mr-80 pt-20 px-8 h-full overflow-y-auto">
        {/* Header */}
        <header className="py-8 border-b border-neutral-700/50">
          <h1 className="text-6xl font-black lowercase">My Liked Page</h1>
          <p className="text-neutral-300 mt-2">Personalize your music collection</p>
          
          {/* NEW: Lyrics customization info */}
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-300">
            <span>💡</span>
            <span>Click the scissor icon on lyrics tiles to customize which verses to feature</span>
          </div>
        </header>

        <div className="flex gap-8 py-8">
          {/* Left Sidebar - Tile Selection */}
          <div className="w-80 flex-shrink-0">
            {/* Templates Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Templates</h2>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm transition-colors"
                >
                  {showTemplates ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showTemplates && (
                <div className="space-y-3 mb-4">
                  {Object.entries(TEMPLATES).map(([key, template]) => (
                    <div
                      key={key}
                      onClick={() => applyTemplate(key)}
                      className="p-4 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer group border border-neutral-700"
                    >
                      <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                      <p className="text-neutral-400 text-sm">
                        {template.layout.length} tiles • {template.layout.filter(t => t.type === 'lyrics').length} lyrics tiles
                      </p>
                      <div className="text-right mt-2">
                        <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">
                          Use template →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Music Content Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Music</h2>
              
              <div className="space-y-4">
                {/* Artist Tile */}
                <div 
                  onClick={() => addTile('artist')}
                  className="p-4 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <h3 className="font-semibold text-white mb-1">Artist</h3>
                  <p className="text-neutral-400 text-sm">Add an artist tile</p>
                  <div className="text-right mt-2">
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">&gt;</span>
                  </div>
                </div>

                {/* Song Tile */}
                <div 
                  onClick={() => addTile('song')}
                  className="p-4 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <h3 className="font-semibold text-white mb-1">Song</h3>
                  <p className="text-neutral-400 text-sm">Add a song tile</p>
                  <div className="text-right mt-2">
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">&gt;</span>
                  </div>
                </div>

                {/* Album Tile */}
                <div 
                  onClick={() => addTile('album')}
                  className="p-4 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <h3 className="font-semibold text-white mb-1">Album</h3>
                  <p className="text-neutral-400 text-sm">Add an album tile</p>
                  <div className="text-right mt-2">
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">&gt;</span>
                  </div>
                </div>

                {/* Lyrics Tile */}
                <div 
                  onClick={() => addTile('lyrics')}
                  className="p-4 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <h3 className="font-semibold text-white mb-1">Lyrics</h3>
                  <p className="text-neutral-400 text-sm">Add a lyrics tile</p>
                  <div className="text-right mt-2">
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">&gt;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-700/50 my-6"></div>

            {/* Layout Elements Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-neutral-300">Layout</h2>
              
              <div className="space-y-4">
                {/* Section Header */}
                <div 
                  onClick={() => addTile('section')}
                  className="p-4 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <h3 className="font-semibold text-white mb-1">Section header</h3>
                  <p className="text-neutral-400 text-sm">Add a section header</p>
                  <div className="text-right mt-2">
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">&gt;</span>
                  </div>
                </div>

                {/* Text Tile */}
                <div 
                  onClick={() => addTile('text')}
                  className="p-4 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <h3 className="font-semibold text-white mb-1">Text</h3>
                  <p className="text-neutral-400 text-sm">Add a text tile</p>
                  <div className="text-right mt-2">
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">&gt;</span>
                  </div>
                </div>

                {/* Picture Tile */}
                <div 
                  onClick={() => addTile('picture')}
                  className="p-4 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <h3 className="font-semibold text-white mb-1">Picture</h3>
                  <p className="text-neutral-400 text-sm">Add a picture tile</p>
                  <div className="text-right mt-2">
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">&gt;</span>
                  </div>
                </div>

                {/* Spacer Tile */}
                <div 
                  onClick={() => addTile('spacer')}
                  className="p-4 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <h3 className="font-semibold text-white mb-1">Spacer</h3>
                  <p className="text-neutral-400 text-sm">Add a spacer tile</p>
                  <div className="text-right mt-2">
                    <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">&gt;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear All Button */}
            <button 
              onClick={() => setLayout([])}
              className="w-full mt-6 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
            >
              Clear All Tiles
            </button>
          </div>

          {/* Right Content Area - Grid Layout */}
          <div className="flex-1">
            {layout.length === 0 ? (
              <div className="bg-neutral-800/30 rounded-lg p-16 text-center">
                <p className="text-neutral-400 text-lg mb-2">Your liked page is empty</p>
                <p className="text-neutral-500 text-sm">
                  Click on the tiles to the left to start building your personalized page, or try a template above!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {layout.map((tile, index) => (
                  <div key={tile.id} className="relative group">
                    {/* Tile Controls */}
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                      <button
                        onClick={() => moveTile(tile.id, 'up')}
                        disabled={index === 0}
                        className="w-6 h-6 bg-neutral-700 rounded text-xs disabled:opacity-30"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveTile(tile.id, 'down')}
                        disabled={index === layout.length - 1}
                        className="w-6 h-6 bg-neutral-700 rounded text-xs disabled:opacity-30"
                        title="Move down"
                      >
                        ↓
                      </button>
                      {editingTile !== tile.id ? (
                        <button
                          onClick={() => startEditing(tile.id, tile.content)}
                          className="w-6 h-6 bg-blue-600 rounded text-xs"
                          title="Edit"
                        >
                          ✎
                        </button>
                      ) : null}
                      <button
                        onClick={() => removeTile(tile.id)}
                        className="w-6 h-6 bg-red-600 rounded text-xs"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                    
                    {renderTile(tile)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};