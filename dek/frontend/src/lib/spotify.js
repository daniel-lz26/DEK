const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

if (!clientId || !redirectUri) {
  throw new Error('Missing Spotify environment variables. Check your .env.local file.');
}

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'streaming'
].join(' ');

// Generate random string
const generateRandomString = (length) => 
  Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[x % 62])
    .join('');

// PKCE utilities
const base64URLEncode = (str) => btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

async function generatePKCE() {
  const verifier = base64URLEncode(Array.from(crypto.getRandomValues(new Uint8Array(32)), x => String.fromCharCode(x)).join(''));
  const challenge = base64URLEncode(
    Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))), x => String.fromCharCode(x)).join('')
  );
  return { verifier, challenge };
}

// Redirect to Spotify authorization
export async function redirectToSpotifyAuth() {
  const state = generateRandomString(16);
  const { verifier, challenge } = await generatePKCE();
  
  localStorage.setItem('spotify_auth_state', state);
  localStorage.setItem('spotify_code_verifier', verifier);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: redirectUri,
    state,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    show_dialog: true
  });
  
  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

// Handle Spotify callback
export async function handleSpotifyCallback(code, state) {
  const storedState = localStorage.getItem('spotify_auth_state');
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  
  if (state !== storedState) throw new Error('State mismatch');
  if (!codeVerifier) throw new Error('Code verifier not found');
  
  // Clean up temporary storage
  localStorage.removeItem('spotify_auth_state');
  localStorage.removeItem('spotify_code_verifier');
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Token error: ${errorData.error_description || errorData.error || 'Unknown error'}`);
  }
  
  const { access_token, refresh_token, expires_in } = await response.json();
  
  // Store tokens
  localStorage.setItem('spotify_access_token', access_token);
  localStorage.setItem('spotify_refresh_token', refresh_token);
  localStorage.setItem('spotify_token_expiry', Date.now() + (expires_in * 1000));
  
  return { access_token, refresh_token, expires_in };
}

// Token management
export const getAccessToken = () => localStorage.getItem('spotify_access_token');

export const isSpotifyAuthenticated = () => {
  const token = getAccessToken();
  const expiry = localStorage.getItem('spotify_token_expiry');
  return token && expiry && Date.now() < parseInt(expiry);
};

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  if (!refreshToken) throw new Error('No refresh token available');
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Refresh failed: ${errorData.error_description || errorData.error || 'Unknown error'}`);
  }
  
  const { access_token, refresh_token: newRefreshToken, expires_in } = await response.json();
  
  localStorage.setItem('spotify_access_token', access_token);
  localStorage.setItem('spotify_token_expiry', Date.now() + (expires_in * 1000));
  if (newRefreshToken) localStorage.setItem('spotify_refresh_token', newRefreshToken);
  
  return { access_token, expires_in };
}

// Enhanced API request with detailed error handling
export async function spotifyApiRequest(endpoint, options = {}) {
  let token = getAccessToken();

  // Refresh token if missing or expired
  if (!token || !isSpotifyAuthenticated()) {
    console.log('🔄 Token missing or expired, refreshing...');
    try {
      await refreshAccessToken();
      token = getAccessToken();
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      // Clear invalid tokens
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('spotify_token_expiry');
      throw new Error('Authentication failed. Please log in again.');
    }
  }

  console.log('🔗 Requesting:', `https://api.spotify.com/v1${endpoint}`);
  console.log('🪪 Using token:', token?.slice(0, 10) + '...');

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `Spotify API error: ${response.status}`;
    
    try {
      const errorData = await response.json();
      console.error('❌ Spotify API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        endpoint: endpoint,
        error: errorData
      });
      
      if (errorData.error?.message) {
        errorMessage = `Spotify API error: ${response.status} - ${errorData.error.message}`;
      }
    } catch (parseError) {
      console.error('❌ Failed to parse error response:', parseError);
    }
    
    if (response.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('spotify_token_expiry');
      throw new Error('Authentication failed. Please log in again.');
    } else if (response.status === 403) {
      throw new Error('Permission denied. The app may need additional permissions. Please try logging in again.');
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (response.status >= 500) {
      throw new Error('Spotify service is temporarily unavailable. Please try again later.');
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Get user's profile
 */
export async function getCurrentUser() {
  return spotifyApiRequest('/me');
}

/**
 * Get top tracks
 */
export async function getTopTracks(timeRange = 'medium_term', limit = 20) {
  return spotifyApiRequest(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
}

/**
 * Get top artists
 */
export async function getTopArtists(timeRange = 'medium_term', limit = 20) {
  return spotifyApiRequest(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
}

/**
 * Get recently played tracks
 * Filters out any null track IDs to prevent errors in StatsSidebar
 */
export async function getRecentlyPlayed(limit = 20) {
  const data = await spotifyApiRequest(`/me/player/recently-played?limit=${limit}`);
  // Filter out items without a valid track ID
  data.items = data.items?.filter(item => item.track?.id) || [];
  return data;
}

/**
 * Get current playback state
 */
export async function getCurrentPlayback() {
  return spotifyApiRequest('/me/player');
}

/**
 * Get currently playing track
 */
export async function getCurrentlyPlaying() {
  return spotifyApiRequest('/me/player/currently-playing');
}

/**
 * Get Audio Features for Several Tracks
 * Filters out null track IDs
 */
export const getAudioFeaturesForTracks = async (trackIds) => {
  const validIds = trackIds.filter(Boolean);
  if (validIds.length === 0) return { audio_features: [] };
  const ids = validIds.join(',');
  return spotifyApiRequest(`/audio-features?ids=${ids}`);
};

/**
 * Get an Artist's Top Tracks
 */
export async function getArtistTopTracks(artistId, country = 'US') {
  return spotifyApiRequest(`/artists/${artistId}/top-tracks?country=${country}`);
}

/**
 * Check token scopes
 */
export async function checkTokenScopes() {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });
    
    const scopes = response.headers.get('X-Spotify-Scopes');
    console.log('🔑 Granted Scopes:', scopes);
    return scopes ? scopes.split(' ') : [];
  } catch (error) {
    console.error('❌ Failed to check scopes:', error);
    return [];
  }
}

/**
 * Logout from Spotify 
 */
export function logoutSpotify() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiry');
  localStorage.removeItem('spotify_auth_state');
  localStorage.removeItem('spotify_code_verifier');
}

// ========== ADD THESE SEARCH FUNCTIONS ==========

/**
 * Search for artists
 */
export const searchArtists = async (query, limit = 10) => {
  return spotifyApiRequest(`/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`);
};

/**
 * Search for tracks
 */
export const searchTracks = async (query, limit = 10) => {
  return spotifyApiRequest(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
};