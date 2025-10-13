const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '693322d20f6840f3aff9e6b3d8a2f9e8';
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5176/callback';

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
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
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
      redirect_uri: REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  });
  
  if (!response.ok) {
    const { error_description, error } = await response.json();
    throw new Error(`Token error: ${error_description || error}`);
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
      client_id: SPOTIFY_CLIENT_ID,
    }),
  });
  
  if (!response.ok) {
    const { error_description, error } = await response.json();
    throw new Error(`Refresh failed: ${error_description || error}`);
  }
  
  const { access_token, refresh_token: newRefreshToken, expires_in } = await response.json();
  
  localStorage.setItem('spotify_access_token', access_token);
  localStorage.setItem('spotify_token_expiry', Date.now() + (expires_in * 1000));
  if (newRefreshToken) localStorage.setItem('spotify_refresh_token', newRefreshToken);
  
  return { access_token, expires_in };
}

// Authenticated API requests
export async function spotifyApiRequest(endpoint, options = {}) {
  let token = getAccessToken();
  
  // Auto-refresh expired tokens
  if (!isSpotifyAuthenticated()) {
    await refreshAccessToken();
    token = getAccessToken();
  }
  
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    if (response.status === 401) throw new Error('Authentication failed. Please log in again.');
    throw new Error(`Spotify API error: ${response.status}`);
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
 */
export async function getRecentlyPlayed(limit = 20) {
  return spotifyApiRequest(`/me/player/recently-played?limit=${limit}`);
}

/**
 * Get current playback state
 */
export async function getCurrentPlayback() {
  return spotifyApiRequest('/me/player');
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