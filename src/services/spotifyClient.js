const axios = require('axios');

class SpotifyClient {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = null;
    this.tokenExpiration = null;
    this.baseURL = 'https://api.spotify.com/v1';
    this.authURL = 'https://accounts.spotify.com/api/token';
  }

  /**
   * Get access token using Client Credentials flow
   * This flow is suitable for server-to-server authentication
   */
  async getAccessToken() {
    try {
      // Check if we have a valid token that hasn't expired
      if (this.accessToken && this.tokenExpiration && Date.now() < this.tokenExpiration) {
        return this.accessToken;
      }

      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(this.authURL, 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiration time (subtract 60 seconds for buffer)
      this.tokenExpiration = Date.now() + (response.data.expires_in - 60) * 1000;
      
      console.log('Successfully obtained Spotify access token');
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Spotify API');
    }
  }

  /**
   * Make authenticated requests to Spotify API
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const token = await this.getAccessToken();
      
      const config = {
        method: options.method || 'GET',
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Spotify API request failed:', error.response?.data || error.message);
      
      // If token expired, clear it and retry once
      if (error.response?.status === 401 && this.accessToken) {
        console.log('Token expired, refreshing...');
        this.accessToken = null;
        this.tokenExpiration = null;
        
        // Retry the request with fresh token
        return this.makeRequest(endpoint, options);
      }
      
      throw error;
    }
  }

  /**
   * Search for tracks, artists, albums, playlists
   */
  async search(query, type = 'track', options = {}) {
    const params = new URLSearchParams({
      q: query,
      type: type,
      limit: options.limit || 20,
      offset: options.offset || 0,
      market: options.market || 'US'
    });

    return this.makeRequest(`/search?${params.toString()}`);
  }

  /**
   * Get track details by ID
   */
  async getTrack(trackId, market = 'US') {
    return this.makeRequest(`/tracks/${trackId}?market=${market}`);
  }

  /**
   * Get artist details by ID
   */
  async getArtist(artistId) {
    return this.makeRequest(`/artists/${artistId}`);
  }

  /**
   * Get album details by ID
   */
  async getAlbum(albumId, market = 'US') {
    return this.makeRequest(`/albums/${albumId}?market=${market}`);
  }

  /**
   * Get artist's top tracks
   */
  async getArtistTopTracks(artistId, market = 'US') {
    return this.makeRequest(`/artists/${artistId}/top-tracks?market=${market}`);
  }
}

module.exports = SpotifyClient;