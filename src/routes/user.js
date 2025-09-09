const express = require('express');
const router = express.Router();

/**
 * Get saved tracks for a user
 * GET /api/user/:userId/tracks
 */
router.get('/:userId/tracks', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0, market = 'US' } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        error: 'User ID parameter is required' 
      });
    }

    // Use the Spotify client from app locals (set in server.js)
    const spotifyClient = req.app.locals.spotifyClient;
    
    const userTracks = await spotifyClient.getUserTracks(userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      market
    });

    res.json({
      success: true,
      userId,
      tracks: userTracks
    });

  } catch (error) {
    console.error('Get user tracks error:', error);
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get user tracks',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = router;
