// pages/liked.jsx
import React, { useState, useEffect, useRef } from 'react';
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

// Color themes
const COLOR_THEMES = {
  dark: {
    primary: '#1DB954',
    secondary: '#191414',
    accent: '#535353',
    text: '#FFFFFF',
    tileBg: 'rgba(255, 255, 255, 0.05)',
    sectionBg: 'rgba(255, 255, 255, 0.1)'
  },
  vibrant: {
    primary: '#FF6B6B',
    secondary: '#2D3436',
    accent: '#6C5CE7',
    text: '#FFFFFF',
    tileBg: 'rgba(108, 92, 231, 0.1)',
    sectionBg: 'rgba(108, 92, 231, 0.2)'
  },
  ocean: {
    primary: '#00CEC9',
    secondary: '#0F4C75',
    accent: '#3282B8',
    text: '#E3F2FD',
    tileBg: 'rgba(50, 130, 184, 0.1)',
    sectionBg: 'rgba(50, 130, 184, 0.2)'
  },
  sunset: {
    primary: '#FF9A76',
    secondary: '#2C3E50',
    accent: '#E74C3C',
    text: '#FFFFFF',
    tileBg: 'rgba(231, 76, 60, 0.1)',
    sectionBg: 'rgba(231, 76, 60, 0.2)'
  },
  forest: {
    primary: '#55D56E',
    secondary: '#1A3C34',
    accent: '#2E7D32',
    text: '#E8F5E9',
    tileBg: 'rgba(46, 125, 50, 0.1)',
    sectionBg: 'rgba(46, 125, 50, 0.2)'
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
        style: { padding: '1rem', borderRadius: '0.5rem' }
      },
      {
        id: 'artist-1',
        type: 'artist',
        content: { name: 'Add your first artist', image: 'https://placehold.co/200x200/333/FFFFFF?text=Artist+1', genre: 'Genre' },
        style: { padding: '1rem', borderRadius: '0.5rem' }
      },
      {
        id: 'artist-2',
        type: 'artist',
        content: { name: 'Add your second artist', image: 'https://placehold.co/200x200/333/FFFFFF?text=Artist+2', genre: 'Genre' },
        style: { padding: '1rem', borderRadius: '0.5rem' }
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
        style: { padding: '1rem', borderRadius: '0.5rem' }
      },
      {
        id: 'song-1',
        type: 'song',
        content: { title: 'Favorite Song', artist: 'Artist Name', album: 'Album Name', duration: '3:00' },
        style: { padding: '1rem', borderRadius: '0.5rem' }
      },
      {
        id: 'album-1',
        type: 'album',
        content: { title: 'Favorite Album', artist: 'Artist Name', image: 'https://placehold.co/200x200/333/FFFFFF?text=Album', year: '2024' },
        style: { padding: '1rem', borderRadius: '0.5rem' }
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
        style: { padding: '1rem', borderRadius: '0.5rem' }
      },
      {
        id: 'lyrics-1',
        type: 'lyrics',
        content: { 
          text: 'Your favorite lyrics will appear here...\nAdd a song and artist to fetch real lyrics!', 
          song: 'Song Name', 
          artist: 'Artist Name' 
        },
        style: { padding: '1rem', borderRadius: '0.5rem' }
      },
      {
        id: 'lyrics-2',
        type: 'lyrics',
        content: { 
          text: 'Another set of meaningful lyrics...\nCustomize which verses to feature!', 
          song: 'Another Song', 
          artist: 'Another Artist' 
        },
        style: { padding: '1rem', borderRadius: '0.5rem' }
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
        style: { padding: '1rem', borderRadius: '0.5rem' }
      },
      {
        id: 'artist-1',
        type: 'artist',
        content: { name: 'Top Artist', image: 'https://placehold.co/200x200/333/FFFFFF?text=Artist', genre: 'Genre' },
        style: { padding: '1rem', borderRadius: '0.5rem' }
      },
      {
        id: 'song-1',
        type: 'song',
        content: { title: 'Current Favorite', artist: 'Artist Name', album: 'Album Name', duration: '3:30' },
        style: { padding: '1rem', borderRadius: '0.5rem' }
      },
      {
        id: 'lyrics-1',
        type: 'lyrics',
        content: { 
          text: 'Add your favorite song lyrics here...', 
          song: 'Song Name', 
          artist: 'Artist Name' 
        },
        style: { padding: '1rem', borderRadius: '0.5rem' }
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

  // NEW: Color customization states
  const [colorTheme, setColorTheme] = useState('dark');
  const [customColors, setCustomColors] = useState({
    primary: '#1DB954',
    secondary: '#191414',
    accent: '#535353',
    text: '#FFFFFF',
    tileBg: 'rgba(255, 255, 255, 0.05)',
    sectionBg: 'rgba(255, 255, 255, 0.1)'
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickingColor, setPickingColor] = useState(null);
  const [eyeDropperActive, setEyeDropperActive] = useState(false);
  const [tempColor, setTempColor] = useState('');
  const canvasRef = useRef(null);

  // Get current theme colors
  const getThemeColors = () => {
    if (colorTheme === 'custom') {
      return customColors;
    }
    return COLOR_THEMES[colorTheme];
  };

  const themeColors = getThemeColors();

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

        // NEW: Load saved color theme
        const savedTheme = localStorage.getItem('likedPageTheme');
        if (savedTheme) {
          const parsed = JSON.parse(savedTheme);
          setColorTheme(parsed.theme);
          if (parsed.customColors) {
            setCustomColors(parsed.customColors);
          }
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

  // NEW: Save color theme
  useEffect(() => {
    localStorage.setItem('likedPageTheme', JSON.stringify({
      theme: colorTheme,
      customColors: customColors
    }));
  }, [colorTheme, customColors]);

  // NEW: Eye dropper functionality
  useEffect(() => {
    if (!eyeDropperActive) return;

    const handleMouseMove = (e) => {
      if (!pickingColor) return;

      try {
        // Create a temporary canvas to sample colors
        if (!canvasRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          canvas.style.display = 'none';
          document.body.appendChild(canvas);
          canvasRef.current = canvas;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Capture pixel color at cursor position
        ctx.clearRect(0, 0, 1, 1);
        ctx.drawImage(document.elementFromPoint(e.clientX, e.clientY) || new Image(), 0, 0, 1, 1);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        
        // Convert to hex
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        setTempColor(hex);
        
        // Update cursor style
        document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${hex}" stroke="white" stroke-width="2"/></svg>') 12 12, crosshair`;
      } catch (error) {
        console.error('Error sampling color:', error);
      }
    };

    const handleClick = (e) => {
      if (pickingColor && tempColor) {
        handleColorChange(pickingColor, tempColor);
        setEyeDropperActive(false);
        setPickingColor(null);
        document.body.style.cursor = '';
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setEyeDropperActive(false);
        setPickingColor(null);
        document.body.style.cursor = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.cursor = '';
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [eyeDropperActive, pickingColor, tempColor]);

  const debouncedSearchEffect = () => {
    if (searchQuery.trim().length < 2) {
      setSearchResults({ artists: [], tracks: [] });
      setSearchLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Apply the debounced search effect
  useEffect(debouncedSearchEffect, [searchQuery, searchType]);

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

  // NEW: Color customization functions
  const applyTheme = (themeName) => {
    setColorTheme(themeName);
    if (themeName !== 'custom') {
      setCustomColors(COLOR_THEMES[themeName]);
    }
  };

  const handleColorChange = (colorType, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: value
    }));
    setColorTheme('custom');
  };

  const activateEyeDropper = (colorType) => {
    setPickingColor(colorType);
    setEyeDropperActive(true);
    setTempColor('');
  };

  const resetColors = () => {
    setColorTheme('dark');
    setCustomColors(COLOR_THEMES.dark);
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
      backgroundColor: themeColors.tileBg
    };

    switch (type) {
      case 'section':
        return { ...baseStyle, backgroundColor: themeColors.sectionBg };
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
        <div className="relative group" style={{ ...style, backgroundColor: themeColors.tileBg }}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={editContent.artist || ''}
                onChange={(e) => handleEditChange('artist', e.target.value)}
                className="flex-1 p-2 bg-neutral-700 rounded text-white"
                placeholder="Artist name"
                style={{ backgroundColor: themeColors.accent + '40' }}
              />
              <input
                type="text"
                value={editContent.song || ''}
                onChange={(e) => handleEditChange('song', e.target.value)}
                className="flex-1 p-2 bg-neutral-700 rounded text-white"
                placeholder="Song name"
                style={{ backgroundColor: themeColors.accent + '40' }}
              />
              <button
                onClick={() => handleFetchLyrics(id)}
                disabled={fetchingLyrics || !editContent.artist || !editContent.song}
                className="px-3 py-2 rounded text-sm transition-colors"
                style={{ 
                  backgroundColor: fetchingLyrics ? themeColors.accent : themeColors.primary,
                  color: 'white'
                }}
              >
                {fetchingLyrics ? 'Loading...' : 'Get Lyrics'}
              </button>
            </div>
            
            <textarea
              value={editContent.text || ''}
              onChange={(e) => handleEditChange('text', e.target.value)}
              className="w-full p-2 rounded text-white h-32"
              placeholder="Lyrics will appear here..."
              style={{ backgroundColor: themeColors.accent + '40' }}
            />
            
            <div className="flex gap-2">
              <button 
                onClick={() => saveEditing(id)} 
                className="px-3 py-1 rounded text-sm"
                style={{ backgroundColor: themeColors.primary, color: 'white' }}
              >
                Save
              </button>
              <button 
                onClick={cancelEditing} 
                className="px-3 py-1 rounded text-sm"
                style={{ backgroundColor: themeColors.accent, color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative group" style={{ ...style, backgroundColor: themeColors.tileBg }}>
        {/* NEW: Customize button for lyrics */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={() => setCustomizingLyrics(customizingLyrics === id ? null : id)}
            className="w-6 h-6 rounded text-xs flex items-center justify-center"
            style={{ backgroundColor: themeColors.primary, color: 'white' }}
            title="Customize lyrics snippet"
          >
            ✂
          </button>
        </div>

        {customizingLyrics === id ? (
          <div className="space-y-3 p-4 rounded-lg" style={{ backgroundColor: themeColors.accent + '40' }}>
            <h4 className="font-semibold" style={{ color: themeColors.text }}>Customize Lyrics Snippet</h4>
            <p className="text-sm" style={{ color: themeColors.text + 'CC' }}>
              Select which part of the lyrics to feature:
            </p>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {content.text.split('\n').filter(line => line.trim()).map((line, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-2 hover:bg-opacity-30 rounded transition-colors"
                  style={{ backgroundColor: themeColors.accent + '20' }}
                >
                  <span className="text-xs w-6" style={{ color: themeColors.text + '99' }}>{index + 1}</span>
                  <span className="text-sm flex-1" style={{ color: themeColors.text }}>{line}</span>
                  <button
                    onClick={() => {
                      const snippet = extractSnippet(content.text, index, 6);
                      customizeLyricsSnippet(id, snippet);
                    }}
                    className="px-2 py-1 hover:opacity-90 rounded text-xs transition-colors"
                    style={{ backgroundColor: themeColors.primary, color: 'white' }}
                  >
                    Start here
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => customizeLyricsSnippet(id, content.text)}
                className="px-3 py-1 hover:opacity-90 rounded text-sm transition-colors"
                style={{ backgroundColor: themeColors.accent, color: 'white' }}
              >
                Show Full Lyrics
              </button>
              <button
                onClick={() => setCustomizingLyrics(null)}
                className="px-3 py-1 hover:opacity-90 rounded text-sm transition-colors"
                style={{ backgroundColor: themeColors.accent, color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-h-48 overflow-y-auto mb-3">
              <blockquote className="italic text-lg whitespace-pre-wrap leading-relaxed" style={{ color: themeColors.text }}>
                {displayLyrics}
              </blockquote>
            </div>
            <p className="text-sm border-t pt-2" style={{ color: themeColors.text + '99', borderColor: themeColors.accent + '40' }}>
              — {content.song} by {content.artist}
              {customSnippet && (
                <span className="text-xs ml-2" style={{ color: themeColors.primary }}>(Custom snippet)</span>
              )}
            </p>
          </>
        )}
      </div>
    );
  };

  // Update your existing renderTile function to use theme colors
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
          <div key={id} className="relative group" style={{ ...style, backgroundColor: themeColors.tileBg }}>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setSearchType('artist')}
                    className={`px-3 py-1 rounded text-sm ${
                      searchType === 'artist' ? 'text-white' : ''
                    }`}
                    style={{ 
                      backgroundColor: searchType === 'artist' ? themeColors.primary : themeColors.accent + '40',
                      color: searchType === 'artist' ? 'white' : themeColors.text + 'CC'
                    }}
                  >
                    Artists
                  </button>
                  <button
                    onClick={() => setSearchType('track')}
                    className={`px-3 py-1 rounded text-sm ${
                      searchType === 'track' ? 'text-white' : ''
                    }`}
                    style={{ 
                      backgroundColor: searchType === 'track' ? themeColors.primary : themeColors.accent + '40',
                      color: searchType === 'track' ? 'white' : themeColors.text + 'CC'
                    }}
                  >
                    Tracks
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 rounded text-white pr-10"
                    placeholder={`Search for ${searchType}...`}
                    style={{ backgroundColor: themeColors.accent + '40' }}
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-2">
                      <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" 
                           style={{ borderColor: `${themeColors.primary} transparent transparent transparent` }}></div>
                    </div>
                  )}
                </div>
                
                {searchResults.artists.length > 0 && searchType === 'artist' && (
                  <div className="max-h-32 overflow-y-auto space-y-2 border rounded p-2"
                       style={{ borderColor: themeColors.accent + '40', backgroundColor: themeColors.accent + '20' }}>
                    <p className="text-xs font-semibold" style={{ color: themeColors.text + '99' }}>Artists:</p>
                    {searchResults.artists.map(artist => (
                      <div
                        key={artist.id}
                        onClick={() => selectArtist(artist)}
                        className="p-2 rounded cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: themeColors.accent + '40' }}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={artist.images[2]?.url || 'https://placehold.co/40x40/333/FFFFFF?text=🎵'} 
                            alt={artist.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-sm font-medium" style={{ color: themeColors.text }}>{artist.name}</span>
                            {artist.genres[0] && (
                              <p className="text-xs" style={{ color: themeColors.text + 'CC' }}>{artist.genres[0]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.tracks.length > 0 && searchType === 'track' && (
                  <div className="max-h-32 overflow-y-auto space-y-2 border rounded p-2"
                       style={{ borderColor: themeColors.accent + '40', backgroundColor: themeColors.accent + '20' }}>
                    <p className="text-xs font-semibold" style={{ color: themeColors.text + '99' }}>Tracks:</p>
                    {searchResults.tracks.map(track => (
                      <div
                        key={track.id}
                        onClick={() => selectTrack(track)}
                        className="p-2 rounded cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: themeColors.accent + '40' }}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={track.album.images[2]?.url || 'https://placehold.co/40x40/333/FFFFFF?text=🎵'} 
                            alt={track.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: themeColors.text }}>{track.name}</p>
                            <p className="text-xs truncate" style={{ color: themeColors.text + 'CC' }}>{track.artists[0].name}</p>
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
                    className="w-full p-2 rounded text-white"
                    placeholder="Artist name"
                    style={{ backgroundColor: themeColors.accent + '40' }}
                  />
                  <input
                    type="text"
                    value={editContent.genre || ''}
                    onChange={(e) => handleEditChange('genre', e.target.value)}
                    className="w-full p-2 rounded text-white"
                    placeholder="Genre"
                    style={{ backgroundColor: themeColors.accent + '40' }}
                  />
                  <input
                    type="text"
                    value={editContent.image || ''}
                    onChange={(e) => handleEditChange('image', e.target.value)}
                    className="w-full p-2 rounded text-white"
                    placeholder="Image URL"
                    style={{ backgroundColor: themeColors.accent + '40' }}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => saveEditing(id)} className="px-3 py-1 rounded text-sm"
                          style={{ backgroundColor: themeColors.primary, color: 'white' }}>
                    Save
                  </button>
                  <button onClick={cancelEditing} className="px-3 py-1 rounded text-sm"
                          style={{ backgroundColor: themeColors.accent, color: 'white' }}>
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
                  <h3 className="font-bold" style={{ color: themeColors.text }}>{content.name}</h3>
                  <p className="text-sm" style={{ color: themeColors.text + 'CC' }}>{content.genre}</p>
                </div>
              </div>
            )}
          </div>
        );

      // ... (rest of your tile cases with theme color updates)
      // Update all other tile cases similarly with themeColors

      default:
        return null;
    }
  };

  // Color picker component
  const ColorPicker = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full" style={{ backgroundColor: themeColors.secondary }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold" style={{ color: themeColors.text }}>Customize Colors</h3>
          <button 
            onClick={() => setShowColorPicker(false)}
            className="text-2xl hover:opacity-70"
            style={{ color: themeColors.text }}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Theme Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium" style={{ color: themeColors.text }}>
              Select Theme
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => applyTheme(key)}
                  className={`px-3 py-2 rounded text-sm ${colorTheme === key ? 'ring-2 ring-white' : ''}`}
                  style={{ 
                    backgroundColor: theme.primary,
                    color: 'white'
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setColorTheme('custom')}
                className={`px-3 py-2 rounded text-sm ${colorTheme === 'custom' ? 'ring-2 ring-white' : ''}`}
                style={{ 
                  backgroundColor: customColors.primary,
                  color: 'white'
                }}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Color Customization */}
          <div>
            <label className="block mb-2 text-sm font-medium" style={{ color: themeColors.text }}>
              Customize Colors
            </label>
            <div className="space-y-3">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: value, borderColor: themeColors.accent }}></div>
                  <span className="w-20 text-sm capitalize" style={{ color: themeColors.text }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 p-2 rounded text-sm"
                    style={{ backgroundColor: themeColors.accent + '40', color: themeColors.text }}
                  />
                  <button
                    onClick={() => activateEyeDropper(key)}
                    className="p-2 rounded hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: themeColors.accent, color: themeColors.text }}
                    title="Pick color from screen"
                  >
                    🎨
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Eye Dropper Status */}
          {eyeDropperActive && (
            <div className="p-3 rounded text-sm text-center" 
                 style={{ backgroundColor: themeColors.accent + '40', color: themeColors.text }}>
              <p>🎨 Click anywhere on the screen to pick a color</p>
              <p className="text-xs mt-1" style={{ color: themeColors.text + '99' }}>
                Press ESC to cancel • Current: {tempColor}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={resetColors}
              className="flex-1 px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeColors.accent, color: themeColors.text }}
            >
              Reset to Default
            </button>
            <button
              onClick={() => setShowColorPicker(false)}
              className="flex-1 px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeColors.primary, color: 'white' }}
            >
              Apply Colors
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="font-sans text-white h-screen overflow-hidden" style={{ backgroundColor: themeColors.secondary }}>
        <SearchBar />
        <LeftSidebar />
        <StatsSideBar />
        <main className="ml-24 mr-80 pt-20 px-8 h-full overflow-y-auto">
          <div className="rounded-lg p-8 text-center mt-8" style={{ backgroundColor: themeColors.tileBg }}>
            <p style={{ color: themeColors.text }}>Loading your personalized content...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans h-screen overflow-hidden" style={{ backgroundColor: themeColors.secondary, color: themeColors.text }}>
      <SearchBar />
      <LeftSidebar />
      <StatsSideBar />

      {showColorPicker && <ColorPicker />}
      
      {/* Color Customization Button */}
      <button
        onClick={() => setShowColorPicker(true)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
        style={{ backgroundColor: themeColors.primary, color: 'white' }}
        title="Customize colors"
      >
        🎨
      </button>

      <main className="ml-24 mr-80 pt-20 px-8 h-full overflow-y-auto">
        {/* Header */}
        <header className="py-8 border-b" style={{ borderColor: themeColors.accent + '40' }}>
          <h1 className="text-6xl font-black lowercase" style={{ color: themeColors.text }}>My Liked Page</h1>
          <p className="mt-2" style={{ color: themeColors.text + 'CC' }}>Personalize your music collection</p>
          
          {/* NEW: Lyrics customization info */}
          <div className="flex items-center gap-2 mt-4 text-sm" style={{ color: themeColors.primary }}>
            <span>💡</span>
            <span>Click the scissor icon on lyrics tiles to customize which verses to feature</span>
          </div>

          {/* Current Theme Display */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: themeColors.primary }}></div>
              <span className="text-xs" style={{ color: themeColors.text + '99' }}>
                Theme: {colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1)}
              </span>
            </div>
            <button
              onClick={() => setShowColorPicker(true)}
              className="text-xs px-2 py-1 rounded hover:opacity-80 transition-opacity"
              style={{ backgroundColor: themeColors.accent + '40', color: themeColors.text }}
            >
              Change Colors
            </button>
          </div>
        </header>

        <div className="flex gap-8 py-8">
          {/* Left Sidebar - Tile Selection */}
          <div className="w-80 flex-shrink-0">
            {/* Templates Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold" style={{ color: themeColors.text }}>Templates</h2>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="px-3 py-1 rounded text-sm hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: themeColors.accent + '40', color: themeColors.text }}
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
                      className="p-4 rounded-lg hover:opacity-90 transition-opacity cursor-pointer group border"
                      style={{ 
                        backgroundColor: themeColors.tileBg,
                        borderColor: themeColors.accent + '40'
                      }}
                    >
                      <h3 className="font-semibold mb-1" style={{ color: themeColors.text }}>{template.name}</h3>
                      <p className="text-sm" style={{ color: themeColors.text + '99' }}>
                        {template.layout.length} tiles • {template.layout.filter(t => t.type === 'lyrics').length} lyrics tiles
                      </p>
                      <div className="text-right mt-2">
                        <span style={{ color: themeColors.text + '99' }} className="group-hover:opacity-100 opacity-70 transition-opacity">
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
              <h2 className="text-2xl font-bold mb-4" style={{ color: themeColors.text }}>Music</h2>
              
              <div className="space-y-4">
                {['artist', 'song', 'album', 'lyrics'].map((type) => (
                  <div 
                    key={type}
                    onClick={() => addTile(type)}
                    className="p-4 rounded-lg hover:opacity-90 transition-opacity cursor-pointer group"
                    style={{ backgroundColor: themeColors.tileBg }}
                  >
                    <h3 className="font-semibold mb-1 capitalize" style={{ color: themeColors.text }}>
                      {type}
                    </h3>
                    <p className="text-sm" style={{ color: themeColors.text + '99' }}>
                      Add {type === 'lyrics' ? 'a' : 'an'} {type} tile
                    </p>
                    <div className="text-right mt-2">
                      <span style={{ color: themeColors.text + '99' }} className="group-hover:opacity-100 opacity-70 transition-opacity">
                        &gt;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-6" style={{ borderTop: `1px solid ${themeColors.accent}40` }}></div>

            {/* Layout Elements Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: themeColors.text + 'CC' }}>Layout</h2>
              
              <div className="space-y-4">
                {['section', 'text', 'picture', 'spacer'].map((type) => (
                  <div 
                    key={type}
                    onClick={() => addTile(type)}
                    className="p-4 rounded-lg hover:opacity-90 transition-opacity cursor-pointer group"
                    style={{ backgroundColor: themeColors.tileBg }}
                  >
                    <h3 className="font-semibold mb-1 capitalize" style={{ color: themeColors.text }}>
                      {type === 'section' ? 'Section header' : type}
                    </h3>
                    <p className="text-sm" style={{ color: themeColors.text + '99' }}>
                      Add {type === 'spacer' ? 'a' : type === 'section' ? 'a section header' : `a ${type}`} tile
                    </p>
                    <div className="text-right mt-2">
                      <span style={{ color: themeColors.text + '99' }} className="group-hover:opacity-100 opacity-70 transition-opacity">
                        &gt;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear All Button */}
            <button 
              onClick={() => setLayout([])}
              className="w-full mt-6 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              Clear All Tiles
            </button>
          </div>

          {/* Right Content Area - Grid Layout */}
          <div className="flex-1">
            {layout.length === 0 ? (
              <div className="rounded-lg p-16 text-center" style={{ backgroundColor: themeColors.tileBg }}>
                <p className="text-lg mb-2" style={{ color: themeColors.text + '99' }}>Your liked page is empty</p>
                <p className="text-sm" style={{ color: themeColors.text + '77' }}>
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
                        className="w-6 h-6 rounded text-xs disabled:opacity-30"
                        style={{ backgroundColor: themeColors.accent, color: themeColors.text }}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveTile(tile.id, 'down')}
                        disabled={index === layout.length - 1}
                        className="w-6 h-6 rounded text-xs disabled:opacity-30"
                        style={{ backgroundColor: themeColors.accent, color: themeColors.text }}
                        title="Move down"
                      >
                        ↓
                      </button>
                      {editingTile !== tile.id ? (
                        <button
                          onClick={() => startEditing(tile.id, tile.content)}
                          className="w-6 h-6 rounded text-xs"
                          style={{ backgroundColor: themeColors.primary, color: 'white' }}
                          title="Edit"
                        >
                          ✎
                        </button>
                      ) : null}
                      <button
                        onClick={() => removeTile(tile.id)}
                        className="w-6 h-6 rounded text-xs"
                        style={{ backgroundColor: '#ef4444', color: 'white' }}
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