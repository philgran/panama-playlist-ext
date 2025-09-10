const axios = require('axios');

class YouTubeClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://www.googleapis.com/youtube/v3';
  }

  /**
   * Make authenticated requests to YouTube Data API
   */
  async makeRequest(endpoint, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('YouTube API key not configured');
      }

      const config = {
        method: options.method || 'GET',
        url: `${this.baseURL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        params: {
          key: this.apiKey,
          ...options.params
        },
        ...options
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('YouTube API request failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Search for videos, channels, playlists
   */
  async search(query, type = 'video', options = {}) {
    const params = {
      part: 'snippet',
      q: query,
      type: type,
      maxResults: options.limit || 20,
      order: options.order || 'relevance',
      ...options.params
    };

    return this.makeRequest('/search', { params });
  }

  /**
   * Get video details by ID
   */
  async getVideo(videoId, options = {}) {
    const params = {
      part: 'snippet,statistics,contentDetails',
      id: videoId,
      ...options.params
    };

    return this.makeRequest('/videos', { params });
  }

  /**
   * Get channel details by ID
   */
  async getChannel(channelId, options = {}) {
    const params = {
      part: 'snippet,statistics',
      id: channelId,
      ...options.params
    };

    return this.makeRequest('/channels', { params });
  }

  /**
   * Get playlist details by ID
   */
  async getPlaylist(playlistId, options = {}) {
    const params = {
      part: 'snippet,contentDetails',
      id: playlistId,
      ...options.params
    };

    return this.makeRequest('/playlists', { params });
  }
}

module.exports = YouTubeClient;
