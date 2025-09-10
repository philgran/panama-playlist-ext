const express = require('express');
const router = express.Router();

/**
 * YouTube search endpoint
 * GET /api/youtube/search?q=query&type=video&limit=10
 */
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'video', limit = 20, order = 'relevance' } = req.query;

    if (!q) {
      return res.status(400).json({ 
        error: 'Query parameter "q" is required' 
      });
    }

    // Validate type parameter
    const validTypes = ['video', 'channel', 'playlist'];
    const types = type.split(',');
    for (const t of types) {
      if (!validTypes.includes(t.trim())) {
        return res.status(400).json({ 
          error: `Invalid type "${t}". Valid types: ${validTypes.join(', ')}` 
        });
      }
    }

    const youtubeClient = req.app.locals.youtubeClient;
    
    const searchResults = await youtubeClient.search(q, type, {
      limit: parseInt(limit),
      order
    });

    res.json({
      success: true,
      query: q,
      type,
      results: searchResults
    });

  } catch (error) {
    console.error('YouTube search endpoint error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'YouTube search failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * Get YouTube video by ID
 * GET /api/youtube/video/:id
 */
router.get('/video/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const youtubeClient = req.app.locals.youtubeClient;
    const video = await youtubeClient.getVideo(id);

    res.json({
      success: true,
      video
    });

  } catch (error) {
    console.error('Get YouTube video error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get YouTube video',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * Get YouTube channel by ID
 * GET /api/youtube/channel/:id
 */
router.get('/channel/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const youtubeClient = req.app.locals.youtubeClient;
    const channel = await youtubeClient.getChannel(id);

    res.json({
      success: true,
      channel
    });

  } catch (error) {
    console.error('Get YouTube channel error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get YouTube channel',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * Get YouTube playlist by ID
 * GET /api/youtube/playlist/:id
 */
router.get('/playlist/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const youtubeClient = req.app.locals.youtubeClient;
    const playlist = await youtubeClient.getPlaylist(id);

    res.json({
      success: true,
      playlist
    });

  } catch (error) {
    console.error('Get YouTube playlist error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get YouTube playlist',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = router;
