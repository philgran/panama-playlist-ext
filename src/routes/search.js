const express = require('express');
const router = express.Router();

/**
 * Search endpoint - demonstrates Spotify API integration
 * GET /api/search?q=query&type=track&limit=10
 */
router.get('/', async (req, res) => {
  try {
    const { q, type = 'track', limit = 20, offset = 0, market = 'US' } = req.query;

    if (!q) {
      return res.status(400).json({ 
        error: 'Query parameter "q" is required' 
      });
    }

    // Validate type parameter
    const validTypes = ['album', 'artist', 'playlist', 'track', 'show', 'episode'];
    const types = type.split(',');
    for (const t of types) {
      if (!validTypes.includes(t.trim())) {
        return res.status(400).json({ 
          error: `Invalid type "${t}". Valid types: ${validTypes.join(', ')}` 
        });
      }
    }

    // Use the Spotify client from app locals (set in server.js)
    const spotifyClient = req.app.locals.spotifyClient;
    
    const searchResults = await spotifyClient.search(q, type, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      market
    });

    res.json({
      success: true,
      query: q,
      type,
      results: searchResults
    });

  } catch (error) {
    console.error('Search endpoint error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Search failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * Get track by ID
 * GET /api/search/track/:id
 */
router.get('/track/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { market = 'US' } = req.query;

    const spotifyClient = req.app.locals.spotifyClient;
    const track = await spotifyClient.getTrack(id, market);

    res.json({
      success: true,
      track
    });

  } catch (error) {
    console.error('Get track error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get track',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * Get artist by ID
 * GET /api/search/artist/:id
 */
router.get('/artist/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const spotifyClient = req.app.locals.spotifyClient;
    const artist = await spotifyClient.getArtist(id);

    res.json({
      success: true,
      artist
    });

  } catch (error) {
    console.error('Get artist error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get artist',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * Get artist's top tracks
 * GET /api/search/artist/:id/top-tracks
 */
router.get('/artist/:id/top-tracks', async (req, res) => {
  try {
    const { id } = req.params;
    const { market = 'US' } = req.query;

    const spotifyClient = req.app.locals.spotifyClient;
    const topTracks = await spotifyClient.getArtistTopTracks(id, market);

    res.json({
      success: true,
      tracks: topTracks.tracks
    });

  } catch (error) {
    console.error('Get artist top tracks error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get artist top tracks',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * Get audio features for a track
 * GET /api/search/track/:id/audio-features
 */
router.get('/track/:id/audio-features', async (req, res) => {
  try {
    const { id } = req.params;

    const spotifyClient = req.app.locals.spotifyClient;
    const audioFeatures = await spotifyClient.getAudioFeatures(id);

    res.json({
      success: true,
      trackId: id,
      audioFeatures
    });

  } catch (error) {
    console.error('Get audio features error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get audio features',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = router;
